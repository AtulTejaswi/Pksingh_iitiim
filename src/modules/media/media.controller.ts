import { Request, Response } from 'express';
import { prisma } from '../../config/db';
import { AuthRequest } from '../../middleware/auth.middleware';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { AppError } from '../../utils/errors';

const ALLOWED_MIMES = [
  'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml',
  'video/mp4', 'video/webm',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
];

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

const UPLOADS_DIR = path.join(process.cwd(), 'uploads', 'lessons');
try {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
} catch { }

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeExt = /^\.\w+$/.test(ext) ? ext : '';
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + safeExt);
  },
});

const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (ALLOWED_MIMES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError(`File type ${file.mimetype} is not allowed`, 400));
  }
};

export const upload = multer({ storage, limits: { fileSize: MAX_FILE_SIZE }, fileFilter });

export const uploadMedia = async (req: Request, res: Response): Promise<void> => {
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
  const proto = req.get('x-forwarded-proto') || req.protocol;
  const baseUrl = `${proto}://${req.get('host')}`;
  const fileUrl = `${baseUrl}/uploads/lessons/${file.filename}`;
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

export const getLessonMedia = async (req: AuthRequest, res: Response): Promise<void> => {
  const lessonId = req.params.lessonId as string;
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: { id: true, isFree: true, courseId: true, status: true },
  });
  if (!lesson) {
    res.status(404).json({ error: 'Lesson not found' });
    return;
  }

  // Enforce enrollment check for non-free lessons
  if (!lesson.isFree && req.user?.role !== 'SUPER_ADMIN' && req.user?.role !== 'MENTOR') {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }
    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: req.user.id, courseId: lesson.courseId } },
    });
    if (!enrollment) {
      res.status(403).json({ error: 'Must be enrolled to access this lesson media' });
      return;
    }
  }

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
  const link = await prisma.lessonMedia.findUnique({ where: { id } });
  if (!link) {
    res.status(404).json({ error: 'Media link not found' });
    return;
  }
  await prisma.mediaAsset.delete({ where: { id: link.mediaAssetId } });
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
