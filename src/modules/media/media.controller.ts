import { Request, Response } from 'express';
import { prisma } from '../../config/db';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const UPLOADS_DIR = path.join(process.cwd(), 'uploads', 'lessons');
try {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
} catch { }

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});
export const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

export const uploadMedia = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file provided' });
      return;
    }
    const { lessonId, title } = req.body;
    if (!lessonId) {
      res.status(400).json({ error: 'lessonId is required' });
      return;
    }
    const file = req.file;
    const fileUrl = `/uploads/lessons/${file.filename}`;
    const asset = await prisma.mediaAsset.create({
      data: {
        title: title || file.originalname,
        type: file.mimetype.startsWith('video') ? 'VIDEO' : file.mimetype === 'application/pdf' ? 'PDF' : 'IMAGE',
        url: fileUrl,
        storagePath: file.path,
        sizeBytes: file.size,
        mimeType: file.mimetype,
        folder: '/lessons',
      },
    });
    await prisma.lessonMedia.create({
      data: { lessonId, mediaAssetId: asset.id, sortOrder: 0 },
    });
    res.status(201).json({ media: { ...asset, lessonId } });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Upload failed' });
  }
};

export const addLink = async (req: Request, res: Response): Promise<void> => {
  const { lessonId, title, type, url, folder } = req.body;
  if (!lessonId) {
    res.status(400).json({ error: 'lessonId is required' });
    return;
  }
  const asset = await prisma.mediaAsset.create({
    data: { title, type, url, folder: folder || '/' }
  });
  await prisma.lessonMedia.create({
    data: { lessonId, mediaAssetId: asset.id, sortOrder: 0 },
  });
  res.status(201).json({ media: { ...asset, lessonId } });
};

export const getLessonMedia = async (req: Request, res: Response): Promise<void> => {
  const lessonId = req.params.lessonId as string;
  const media = await prisma.lessonMedia.findMany({
    where: { lessonId },
    include: { mediaAsset: true },
    orderBy: { sortOrder: 'asc' },
  });
  res.json({ media });
};

export const updateMedia = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id as string;
  const media = await prisma.mediaAsset.update({ where: { id }, data: req.body });
  res.json({ media });
};

export const deleteMedia = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id as string;
  await prisma.mediaAsset.delete({ where: { id } });
  res.json({ message: 'Media deleted' });
};

export const reorderMedia = async (req: Request, res: Response): Promise<void> => {
  const { mediaIds } = req.body as { mediaIds: string[] };
  const updates = mediaIds.map((id, index) =>
    prisma.lessonMedia.update({ where: { id }, data: { sortOrder: index } })
  );
  await prisma.$transaction(updates);
  res.json({ message: 'Media reordered' });
};
