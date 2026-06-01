import fs from 'fs';
import path from 'path';
import os from 'os';
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
// Use disk storage to avoid buffering large uploads in memory.
const uploadTempDir = path.join(os.tmpdir(), 'pksingh_uploads');
fs.mkdirSync(uploadTempDir, { recursive: true });

export const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadTempDir),
    filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
  }),
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE_MB || '500') * 1024 * 1024 },
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
  const file = req.file as Express.Multer.File | undefined;
  const { lessonId, title } = req.body;

  if (!file) {
    res.status(400).json({ error: 'No file provided' });
    return;
  }

  const ext = file.originalname.split('.').pop();
  const storagePath = `lessons/${lessonId}/${Date.now()}.${ext}`;

  let publicUrl: string;
  let savedPath = storagePath;

  try {
    if (useSupabase && supabase) {
      // Stream file to Supabase storage to avoid buffering large files in memory.
      try {
        const fileStream = fs.createReadStream(file.path);
        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(storagePath, fileStream as any, { contentType: file.mimetype });

        if (uploadError) {
          // Try buffer fallback if stream upload fails
          const buffer = fs.readFileSync(file.path);
          const { error: uploadError2 } = await supabase.storage.from('media').upload(storagePath, buffer, { contentType: file.mimetype });
          if (uploadError2) {
            console.error('Supabase upload errors', uploadError, uploadError2);
            throw new Error('Supabase upload failed');
          }
        }

        const { data } = supabase.storage.from('media').getPublicUrl(storagePath);
        publicUrl = data.publicUrl;
        // remove temp file after successful transfer
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      } catch (err) {
        // On any Supabase failure, log and fall back to local disk storage instead of returning 500.
        console.warn('Supabase upload failed, falling back to local disk storage:', String(err));

        const uploadFolder = path.join(process.cwd(), 'uploads', 'lessons', lessonId);
        fs.mkdirSync(uploadFolder, { recursive: true });

        const filename = path.basename(file.path);
        const destPath = path.join(uploadFolder, filename);
        try {
          // Prefer copy to avoid issues with temp file locks; fallback to rename if copy fails
          fs.copyFileSync(file.path, destPath);
        } catch (copyErr) {
          try { fs.renameSync(file.path, destPath); } catch (renameErr) { console.error('Failed to move temp file to uploads folder', copyErr, renameErr); }
        }

        const providedUrl = process.env.BACKEND_URL;
        const derivedBase = providedUrl ?? `${req.protocol}://${req.get('host')}`;
        publicUrl = `${derivedBase.replace(/\/$/, '')}/uploads/lessons/${lessonId}/${filename}`;
        savedPath = `uploads/lessons/${lessonId}/${filename}`;
      }
    } else {
      const uploadFolder = path.join(process.cwd(), 'uploads', 'lessons', lessonId);
      fs.mkdirSync(uploadFolder, { recursive: true });

      const filename = path.basename(file.path);
      const filePath = path.join(uploadFolder, filename);
      fs.renameSync(file.path, filePath);

      // Use BACKEND_URL if provided; otherwise derive base URL from the incoming request
      const providedUrl = process.env.BACKEND_URL;
      const derivedBase = providedUrl ?? `${req.protocol}://${req.get('host')}`;
      publicUrl = `${derivedBase.replace(/\/$/, '')}/uploads/lessons/${lessonId}/${filename}`;
      savedPath = `uploads/lessons/${lessonId}/${filename}`;
    }

    const type = file.mimetype === 'application/pdf' ? 'PDF'
               : file.mimetype.startsWith('video') ? 'VIDEO'
               : 'IMAGE';

    const stats = fs.existsSync(path.join(process.cwd(), savedPath || '')) ? fs.statSync(path.join(process.cwd(), savedPath || '')) : (fs.existsSync(file.path) ? fs.statSync(file.path) : { size: file.size });

    const media = await prisma.media.create({
      data: {
        lessonId,
        title: title ?? file.originalname,
        type,
        url: publicUrl,
        storagePath: savedPath,
        sizeBytes: stats.size,
        mimeType: file.mimetype,
      },
    });

    res.status(201).json({ media });
  } catch (err) {
    console.error('uploadMedia error', err);
    res.status(500).json({ error: 'File upload failed', details: String(err) });
  } finally {
    // Cleanup temp file if it still exists
    try {
      if (file.path && fs.existsSync(file.path)) fs.unlinkSync(file.path);
    } catch (e) {
      // ignore
    }
  }
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
