import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/db';
import { AuthRequest } from '../../middleware/auth.middleware';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { z } from 'zod';
import { AppError, NotFoundError, BadRequestError } from '../../utils/errors';
import { formatZodError } from '../../utils/formatZodError';
import { storageService, isCloudStorageConfigured } from '../../utils/storage';

const DEFAULT_ALLOWED_MIMES = [
  'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml',
  'video/mp4', 'video/webm', 'video/quicktime', 'video/x-matroska',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
];

// Configurable via env (see .env.example) so file-size/type limits can be
// tuned per deployment without touching code.
const ALLOWED_MIMES = process.env.ALLOWED_MIME_TYPES
  ? process.env.ALLOWED_MIME_TYPES.split(',').map((m) => m.trim()).filter(Boolean)
  : DEFAULT_ALLOWED_MIMES;

const MAX_FILE_SIZE_MB = parseInt(process.env.MAX_FILE_SIZE_MB || '500', 10);
const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;

// Files are always staged here first (multer streams to disk, it never
// buffers the whole upload in memory — safe even for large lecture videos).
// When Supabase Storage is configured, the staged file is uploaded then
// deleted immediately; the folder is NOT the permanent home in that case.
const UPLOADS_DIR = path.join(process.cwd(), 'uploads', 'lessons');
try {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
} catch {
  /* best-effort; upload will fail loudly later if this really matters */
}

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
    cb(new AppError(
      `File type "${file.mimetype}" is not allowed. Allowed types: images, PDF, DOC/DOCX, PPT/PPTX, and MP4/WebM/MOV/MKV video. ` +
      `For very large lecture recordings, upload the video to YouTube (as "Unlisted") and paste the link instead — it's free with no size limit.`,
      400
    ));
  }
};

const upload = multer({ storage, limits: { fileSize: MAX_FILE_SIZE }, fileFilter });

// Wraps multer so its errors (wrong type, too large, etc.) become clean JSON
// responses instead of falling through to a generic 500 — this was the #1
// cause of "the backend just failed" reports when the owner tried to upload
// a video that was a little too big.
export const uploadSingle = (req: Request, res: Response, next: NextFunction) => {
  upload.single('file')(req, res, (err: unknown) => {
    if (!err) return next();
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        res.status(400).json({
          error: `That file is larger than the ${MAX_FILE_SIZE_MB}MB limit. For lecture videos, upload to YouTube (Unlisted) and paste the link instead — no size limit and it streams better for students too.`,
        });
        return;
      }
      res.status(400).json({ error: `Upload error: ${err.message}` });
      return;
    }
    if (err instanceof AppError) {
      res.status(err.statusCode).json({ error: err.message });
      return;
    }
    res.status(400).json({ error: (err as Error).message || 'Upload failed' });
  });
};

const linkSchema = z.object({
  lessonId: z.string().min(1, 'lessonId is required'),
  title: z.string().min(1, 'Title is required').max(300),
  url: z.string().url('Enter a valid URL (must start with http:// or https://)'),
  type: z.enum(['YOUTUBE_LINK', 'EXTERNAL_LINK']).optional().default('EXTERNAL_LINK'),
  folder: z.string().optional(),
});

const updateMediaSchema = z.object({
  title: z.string().min(1).max(300).optional(),
  sortOrder: z.number().int().optional(),
});

async function assertLessonExists(lessonId: string) {
  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId }, select: { id: true } });
  if (!lesson) throw new NotFoundError('Lesson not found. Refresh the page and try again.');
}

export const uploadMedia = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file provided' });
      return;
    }
    const { lessonId, title } = req.body as { lessonId?: string; title?: string };
    if (!lessonId) {
      // Clean up the staged file — nothing will reference it.
      fs.unlink(req.file.path, () => {});
      res.status(400).json({ error: 'lessonId is required' });
      return;
    }

    await assertLessonExists(lessonId);

    const file = req.file;
    const proto = req.get('x-forwarded-proto') || req.protocol;
    const baseUrl = `${proto}://${req.get('host')}`;

    const uploaded = await storageService.uploadFile(file, 'lessons', baseUrl);

    const type = file.mimetype.startsWith('video')
      ? 'VIDEO'
      : file.mimetype === 'application/pdf'
        ? 'PDF'
        : file.mimetype.startsWith('image')
          ? 'IMAGE'
          : 'DOC';

    const asset = await prisma.mediaAsset.create({
      data: {
        title: title || file.originalname,
        type,
        url: uploaded.url,
        storagePath: uploaded.storagePath,
        sizeBytes: uploaded.sizeBytes,
        mimeType: uploaded.mimeType,
        folder: '/lessons',
      },
    });

    const lastMedia = await prisma.lessonMedia.findFirst({
      where: { lessonId },
      orderBy: { sortOrder: 'desc' },
    });

    const link = await prisma.lessonMedia.create({
      data: { lessonId, mediaAssetId: asset.id, sortOrder: lastMedia ? lastMedia.sortOrder + 1 : 0 },
    });

    res.status(201).json({ media: { ...asset, lessonId, lessonMediaId: link.id } });
  } catch (err) {
    // If something failed after multer staged the file locally, don't leave
    // it behind (only relevant when using the Supabase provider, which
    // already cleans up on its own path — this is a defensive backstop).
    if (req.file && isCloudStorageConfigured()) {
      fs.unlink(req.file.path, () => {});
    }
    next(err);
  }
};

export const addLink = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = linkSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: formatZodError(result.error) });
      return;
    }
    const { lessonId, title, url, folder } = result.data;
    let { type } = result.data;

    // Auto-detect YouTube links even if the client didn't set the type.
    if (/youtube\.com|youtu\.be/i.test(url)) {
      type = 'YOUTUBE_LINK';
    }

    await assertLessonExists(lessonId);

    const asset = await prisma.mediaAsset.create({
      data: { title, type, url, folder: folder || '/' },
    });

    const lastMedia = await prisma.lessonMedia.findFirst({
      where: { lessonId },
      orderBy: { sortOrder: 'desc' },
    });

    const link = await prisma.lessonMedia.create({
      data: { lessonId, mediaAssetId: asset.id, sortOrder: lastMedia ? lastMedia.sortOrder + 1 : 0 },
    });

    res.status(201).json({ media: { ...asset, lessonId, lessonMediaId: link.id } });
  } catch (err) {
    next(err);
  }
};

export const getLessonMedia = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
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
  } catch (err) {
    next(err);
  }
};

export const updateMedia = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string; // this is the LessonMedia join id
    const result = updateMediaSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: formatZodError(result.error) });
      return;
    }

    const link = await prisma.lessonMedia.findUnique({ where: { id } });
    if (!link) {
      res.status(404).json({ error: 'Media not found' });
      return;
    }

    const { sortOrder, ...assetFields } = result.data;

    let media = await prisma.mediaAsset.findUnique({ where: { id: link.mediaAssetId } });
    if (!media) {
      res.status(404).json({ error: 'Media not found' });
      return;
    }

    if (Object.keys(assetFields).length > 0) {
      media = await prisma.mediaAsset.update({ where: { id: link.mediaAssetId }, data: assetFields });
    }
    if (sortOrder !== undefined) {
      await prisma.lessonMedia.update({ where: { id }, data: { sortOrder } });
    }

    res.json({ media: { ...media, lessonId: link.lessonId, lessonMediaId: link.id } });
  } catch (err) {
    next(err);
  }
};

export const deleteMedia = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string; // LessonMedia join id
    const link = await prisma.lessonMedia.findUnique({
      where: { id },
      include: { mediaAsset: true },
    });
    if (!link) {
      res.status(404).json({ error: 'Media link not found' });
      return;
    }

    await prisma.mediaAsset.delete({ where: { id: link.mediaAssetId } });

    // Also remove the underlying file from storage so deleted material
    // doesn't silently keep consuming Supabase Storage / disk quota forever.
    if (link.mediaAsset.storagePath) {
      await storageService.deleteFile(link.mediaAsset.storagePath);
    }

    res.json({ message: 'Media deleted' });
  } catch (err) {
    next(err);
  }
};

export const reorderMedia = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { mediaIds } = req.body as { mediaIds?: string[] };
    if (!Array.isArray(mediaIds) || mediaIds.length === 0) {
      throw new BadRequestError('mediaIds must be a non-empty array');
    }
    const updates = mediaIds.map((id, index) =>
      prisma.lessonMedia.update({ where: { id }, data: { sortOrder: index } })
    );
    await prisma.$transaction(updates);
    res.json({ message: 'Media reordered' });
  } catch (err) {
    next(err);
  }
};
