import { Response, NextFunction } from 'express';
import { prisma } from '../../config/db';
import { z } from 'zod';
import { AuthRequest } from '../../middleware/auth.middleware';
import { autoBackup } from '../backup/backup.controller';
import { formatZodError } from '../../utils/formatZodError';
import { NotFoundError, BadRequestError } from '../../utils/errors';
import { storageService } from '../../utils/storage';

const createLessonSchema = z.object({
  courseId: z.string().min(1, 'courseId is required'),
  title: z.string().min(3, 'Title must be at least 3 characters').max(300),
  description: z.string().optional().nullable(),
  content: z.string().optional().nullable(),
  isFree: z.boolean().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
});

// courseId is intentionally excluded from updates — moving a lesson to a
// different course isn't a supported flow in the UI, and silently accepting
// it (the old behaviour, which passed req.body straight to Prisma) could
// re-parent a lesson by accident if a stray courseId field was submitted.
const updateLessonSchema = z.object({
  title: z.string().min(3).max(300).optional(),
  description: z.string().optional().nullable(),
  content: z.string().optional().nullable(),
  sortOrder: z.number().int().optional(),
  isFree: z.boolean().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
});

export const listLessons = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { courseId } = req.query;
    const lessons = await prisma.lesson.findMany({
      where: courseId ? { courseId: courseId as string } : undefined,
      orderBy: { sortOrder: 'asc' },
    });
    res.json({ lessons });
  } catch (err) {
    next(err);
  }
};

export const getLesson = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const isAdminOrMentor = req.user?.role === 'SUPER_ADMIN' || req.user?.role === 'MENTOR';

    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: {
        course: true,
        media: { orderBy: { sortOrder: 'asc' }, include: { mediaAsset: true } },
        notes: { orderBy: { createdAt: 'asc' } },
      },
    });

    if (!lesson) {
      res.status(404).json({ error: 'Lesson not found' });
      return;
    }
    if (lesson.status !== 'PUBLISHED' && !isAdminOrMentor) {
      res.status(404).json({ error: 'Lesson not found' });
      return;
    }

    if (!lesson.isFree && !isAdminOrMentor) {
      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }
      const enrollment = await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId: req.user.id, courseId: lesson.courseId } },
      });
      if (!enrollment) {
        res.status(403).json({ error: 'Must be enrolled to view this lesson' });
        return;
      }
    }

    res.json({ lesson });
  } catch (err) {
    next(err);
  }
};

export const createLesson = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = createLessonSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: formatZodError(result.error) });
      return;
    }
    const { courseId, title, description, content, isFree, status } = result.data;

    const course = await prisma.course.findUnique({ where: { id: courseId }, select: { id: true } });
    if (!course) {
      throw new NotFoundError('Course not found. Refresh the page and try again.');
    }

    const lastLesson = await prisma.lesson.findFirst({
      where: { courseId },
      orderBy: { sortOrder: 'desc' },
    });
    const sortOrder = lastLesson ? lastLesson.sortOrder + 1 : 0;

    const lesson = await prisma.lesson.create({
      data: { courseId, title, description, content, isFree, status: status || 'DRAFT', sortOrder },
    });
    autoBackup();
    res.status(201).json({ lesson });
  } catch (err) {
    next(err);
  }
};

export const updateLesson = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const result = updateLessonSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: formatZodError(result.error) });
      return;
    }

    const lesson = await prisma.lesson.update({ where: { id }, data: result.data });
    autoBackup();
    res.json({ lesson });
  } catch (err) {
    next(err);
  }
};

export const deleteLesson = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;

    // Deleting a Lesson cascades LessonMedia rows in the DB, but it does NOT
    // delete the underlying MediaAsset rows or the files themselves — that
    // used to leave orphaned videos/PDFs sitting in storage forever. Clean
    // those up explicitly before removing the lesson.
    const mediaLinks = await prisma.lessonMedia.findMany({
      where: { lessonId: id },
      include: { mediaAsset: true },
    });

    await prisma.lesson.delete({ where: { id } });

    await Promise.all(
      mediaLinks.map(async (link) => {
        await prisma.mediaAsset.deleteMany({ where: { id: link.mediaAssetId } }).catch(() => null);
        if (link.mediaAsset.storagePath) {
          await storageService.deleteFile(link.mediaAsset.storagePath).catch(() => null);
        }
      })
    );

    autoBackup();
    res.json({ message: 'Lesson deleted successfully' });
  } catch (err) {
    next(err);
  }
};

export const reorderLessons = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { lessonIds } = req.body as { lessonIds?: string[] };
    if (!Array.isArray(lessonIds) || lessonIds.length === 0) {
      throw new BadRequestError('lessonIds must be a non-empty array');
    }
    const updates = lessonIds.map((id, index) =>
      prisma.lesson.update({ where: { id }, data: { sortOrder: index } })
    );
    await prisma.$transaction(updates);
    res.json({ message: 'Lessons reordered successfully' });
  } catch (err) {
    next(err);
  }
};

export const markProgress = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const lessonId = req.params.id as string;
    const progress = await prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId: req.user.id, lessonId } },
      update: {},
      create: { userId: req.user.id, lessonId },
    });
    res.json({ message: 'Progress marked', progress });
  } catch (err) {
    next(err);
  }
};
