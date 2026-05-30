import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import multer from 'multer';
import { prisma } from '../../config/db';
import { AuthRequest } from '../../middleware/auth.middleware';
import { Response } from 'express';

const useSupabase = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
const supabase = useSupabase
  ? createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  : null;

// Multer: in-memory buffer (we stream to Supabase)
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE_MB || '50') * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = (process.env.ALLOWED_MIME_TYPES || 'application/pdf,video/mp4,image/jpeg,image/png,image/webp').split(',');
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} not allowed`));
    }
  },
});

export const uploadMedia = async (req: AuthRequest, res: Response): Promise<void> => {
  const file = req.file;
  const { lessonId, title } = req.body;

  if (!file) {
    res.status(400).json({ error: 'No file provided' });
    return;
  }

  const ext = file.originalname.split('.').pop();
  const storagePath = `lessons/${lessonId}/${Date.now()}.${ext}`;

  let publicUrl: string;
  let savedPath = storagePath;

  if (useSupabase && supabase) {
    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(storagePath, file.buffer, { contentType: file.mimetype });

    if (uploadError) {
      res.status(500).json({ error: 'File upload failed' });
      return;
    }

    const { data } = supabase.storage.from('media').getPublicUrl(storagePath);
    publicUrl = data.publicUrl;
  } else {
    const uploadFolder = path.join(process.cwd(), 'uploads', 'lessons', lessonId);
    fs.mkdirSync(uploadFolder, { recursive: true });

    const filename = `${Date.now()}.${ext}`;
    const filePath = path.join(uploadFolder, filename);
    fs.writeFileSync(filePath, file.buffer);

    publicUrl = `${process.env.BACKEND_URL || 'http://localhost:4000'}/uploads/lessons/${lessonId}/${filename}`;
    savedPath = `uploads/lessons/${lessonId}/${filename}`;
  }

  const type = file.mimetype === 'application/pdf' ? 'PDF'
             : file.mimetype.startsWith('video') ? 'VIDEO'
             : 'IMAGE';

  const media = await prisma.media.create({
    data: {
      lessonId,
      title: title ?? file.originalname,
      type,
      url: publicUrl,
      storagePath: savedPath,
      sizeBytes: file.size,
      mimeType: file.mimetype,
    },
  });

  res.status(201).json({ media });
};

export const addLink = async (req: AuthRequest, res: Response): Promise<void> => {
  const { lessonId, title, url, type } = req.body; // type = YOUTUBE_LINK or EXTERNAL_LINK
  
  if (!['YOUTUBE_LINK', 'EXTERNAL_LINK'].includes(type)) {
    res.status(400).json({ error: 'Invalid link type' });
    return;
  }

  const media = await prisma.media.create({
    data: {
      lessonId,
      title,
      type,
      url,
    }
  });

  res.status(201).json({ media });
};

export const getLessonMedia = async (req: AuthRequest, res: Response): Promise<void> => {
  const lessonId = req.params.lessonId as string;
  const media = await prisma.media.findMany({
    where: { lessonId },
    orderBy: { sortOrder: 'asc' }
  });
  res.json({ media });
};

export const deleteMedia = async (req: AuthRequest, res: Response): Promise<void> => {
  const id = req.params.id as string;
  const media = await prisma.media.findUnique({ where: { id } });
  
  if (!media) {
    res.status(404).json({ error: 'Media not found' });
    return;
  }

  if (media.storagePath) {
    if (useSupabase && supabase) {
      await supabase.storage.from('media').remove([media.storagePath]);
    } else {
      const filePath = path.join(process.cwd(), media.storagePath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  }

  await prisma.media.delete({ where: { id } });
  res.json({ message: 'Media deleted successfully' });
};
