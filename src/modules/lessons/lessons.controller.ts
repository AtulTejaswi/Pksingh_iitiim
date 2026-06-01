import { Request, Response } from 'express';
import { prisma } from '../../config/db';
import { AuthRequest } from '../../middleware/auth.middleware';
import { z } from 'zod';
import { formatZodError } from '../../utils/formatZodError';

const lessonSchema = z.object({
  courseId: z.string().uuid(),
  title: z.string().min(3).max(200),
  description: z.string().optional(),
  content: z.string().optional(),
  sortOrder: z.number().int().optional(),
  isFree: z.boolean().optional(),
  isPublished: z.boolean().optional(),
});

// GET /api/lessons — list all lessons (admin only)
export const listLessons = async (req: AuthRequest, res: Response): Promise<void> => {
  const { courseId } = req.query;
  const where: any = {};
  if (courseId) where.courseId = courseId as string;

  const lessons = await prisma.lesson.findMany({
    where,
    include: { media: true, notes: true },
    orderBy: { sortOrder: 'asc' },
  });
  res.json({ lessons });
};

export const getLesson = async (req: AuthRequest, res: Response): Promise<void> => {
  const id = req.params.id as string;

  const lesson = await prisma.lesson.findUnique({
    where: { id },
    include: { course: true, media: true, notes: true },
  });

  if (!lesson) {
    res.status(404).json({ error: 'Lesson not found' });
    return;
  }
  
  if (!lesson.isPublished && req.user?.role !== 'ADMIN') {
    res.status(404).json({ error: 'Lesson not found' });
    return;
  }

  // Allow if lesson is free or user is admin
  if (lesson.isFree || req.user?.role === 'ADMIN') {
    res.json({ lesson });
    return;
  }

  if (!req.user) {
    res.status(401).json({ error: 'Please login to access this lesson' });
    return;
  }

  // Check enrollment
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: req.user.id,
        courseId: lesson.courseId,
      },
    },
  });

  if (!enrollment || enrollment.status !== 'ACTIVE') {
    res.status(403).json({ error: 'Please enroll in this course to access this lesson' });
    return;
  }

  res.json({ lesson });
};

// POST /api/lessons — admin only
export const createLesson = async (req: AuthRequest, res: Response): Promise<void> => {
  const result = lessonSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: formatZodError(result.error) });
    return;
  }

  const lesson = await prisma.lesson.create({ data: result.data });
  res.status(201).json({ lesson });
};

export const updateLesson = async (req: AuthRequest, res: Response): Promise<void> => {
  const id = req.params.id as string;
  const result = lessonSchema.partial().safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: formatZodError(result.error) });
    return;
  }

  const lesson = await prisma.lesson.update({
    where: { id },
    data: result.data,
  });
  res.json({ lesson });
};

export const deleteLesson = async (req: AuthRequest, res: Response): Promise<void> => {
  const id = req.params.id as string;
  await prisma.lesson.delete({ where: { id } });
  res.json({ message: 'Lesson deleted successfully' });
};

// POST /api/lessons/:id/progress - student
export const markProgress = async (req: AuthRequest, res: Response): Promise<void> => {
  const id = req.params.id as string;
  if (!req.user) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }
  
  const progress = await prisma.lessonProgress.upsert({
    where: {
      userId_lessonId: {
        userId: req.user.id,
        lessonId: id
      }
    },
    update: { completedAt: new Date() },
    create: {
      userId: req.user.id,
      lessonId: id
    }
  });

  res.json({ progress });
};
