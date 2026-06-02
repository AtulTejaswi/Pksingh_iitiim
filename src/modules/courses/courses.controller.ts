import { Request, Response } from 'express';
import { prisma } from '../../config/db';
import { z } from 'zod';
import { formatZodError } from '../../utils/formatZodError';
import { AuthRequest } from '../../middleware/auth.middleware';

const courseSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10),
  subject: z.string(),
  isFree: z.boolean().optional(),
  thumbnailUrl: z.union([z.string().url(), z.literal('')]).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  categoryId: z.string().optional(),
});

export const listCourses = async (req: AuthRequest, res: Response): Promise<void> => {
  const { subject, categoryId, page = '1', limit = '12', includeDrafts = '0' } = req.query;

  const includeDraftsBool = String(includeDrafts) === '1' || String(includeDrafts).toLowerCase() === 'true';
  const isAdminOrMentor = req.user?.role === 'SUPER_ADMIN' || req.user?.role === 'MENTOR';

  const whereClause: any = {
    ...(subject && { subject: subject as string }),
    ...(categoryId && { categoryId: categoryId as string }),
  };

  if (!includeDraftsBool || !isAdminOrMentor) {
    whereClause.status = 'PUBLISHED';
  }

  const courses = await prisma.course.findMany({
    where: whereClause,
    select: {
      id: true, title: true, description: true,
      subject: true, thumbnailUrl: true, isFree: true,
      status: true, categoryId: true,
      _count: { select: { lessons: true, enrollments: true } },
    },
    skip: (parseInt(page as string) - 1) * parseInt(limit as string),
    take: parseInt(limit as string),
    orderBy: { sortOrder: 'asc' },
  });

  res.json({ courses });
};

export const getCourse = async (req: AuthRequest, res: Response): Promise<void> => {
  const id = req.params.id as string;
  const isAdminOrMentor = req.user?.role === 'SUPER_ADMIN' || req.user?.role === 'MENTOR';
  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      lessons: isAdminOrMentor
        ? {
            orderBy: { sortOrder: 'asc' },
            include: {
              media: { orderBy: { sortOrder: 'asc' }, include: { mediaAsset: true } },
              notes: { orderBy: { createdAt: 'asc' } },
            },
          }
        : {
            where: { status: 'PUBLISHED' },
            select: {
              id: true, title: true, isFree: true, sortOrder: true, description: true, status: true,
            },
            orderBy: { sortOrder: 'asc' },
          },
      _count: { select: { lessons: true, enrollments: true } },
    },
  });

  if (!course) {
    res.status(404).json({ error: 'Course not found' });
    return;
  }
  if (course.status !== 'PUBLISHED' && !isAdminOrMentor) {
    res.status(404).json({ error: 'Course not found' });
    return;
  }
  res.json({ course });
};

export const getPublicStats = async (_req: Request, res: Response): Promise<void> => {
  const [students, publishedCourses, publishedLessons, enrollments] = await Promise.all([
    prisma.user.count({ where: { role: 'STUDENT' } }),
    prisma.course.count({ where: { status: 'PUBLISHED' } }),
    prisma.lesson.count({ where: { status: 'PUBLISHED' } }),
    prisma.enrollment.count({ where: { status: 'ACTIVE' } }),
  ]);
  res.json({ stats: { students, publishedCourses, publishedLessons, enrollments } });
};

export const getCourseProgress = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }
  const courseId = req.params.id as string;
  const lessons = await prisma.lesson.findMany({
    where: { courseId, status: 'PUBLISHED' },
    select: { id: true, sortOrder: true },
    orderBy: { sortOrder: 'asc' },
  });
  const completedRows = await prisma.lessonProgress.findMany({
    where: { userId: req.user.id, lessonId: { in: lessons.map((l) => l.id) } },
    select: { lessonId: true, completedAt: true },
  });
  const completedSet = new Set(completedRows.map((r) => r.lessonId));
  const lastIncomplete = lessons.find((l) => !completedSet.has(l.id));

  res.json({
    progress: {
      totalLessons: lessons.length,
      completedLessons: completedRows.length,
      percentComplete: lessons.length === 0 ? 0 : Math.round((completedRows.length / lessons.length) * 100),
      completedLessonIds: completedRows.map((r) => r.lessonId),
      resumeLessonId: lastIncomplete?.id ?? lessons[lessons.length - 1]?.id ?? null,
    },
  });
};

export const createCourse = async (req: AuthRequest, res: Response): Promise<void> => {
  const result = courseSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: formatZodError(result.error) });
    return;
  }
  const course = await prisma.course.create({ data: result.data as any });
  res.status(201).json({ course });
};

// PATCH architecture & autosave support
export const updateCourse = async (req: AuthRequest, res: Response): Promise<void> => {
  const id = req.params.id as string;
  const result = courseSchema.partial().safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: formatZodError(result.error) });
    return;
  }
  const course = await prisma.course.update({ where: { id }, data: result.data as any });
  res.json({ course });
};

export const deleteCourse = async (req: AuthRequest, res: Response): Promise<void> => {
  const id = req.params.id as string;
  await prisma.course.delete({ where: { id } });
  res.json({ message: 'Course deleted successfully' });
};

export const togglePublish = async (req: AuthRequest, res: Response): Promise<void> => {
  const id = req.params.id as string;
  const { isPublished } = req.body;
  const status = isPublished ? 'PUBLISHED' : 'DRAFT';
  const course = await prisma.course.update({ where: { id }, data: { status } });
  res.json({ course });
};

export const exportCourses = async (req: AuthRequest, res: Response): Promise<void> => {
  const courses = await prisma.course.findMany({ orderBy: { sortOrder: 'asc' } });
  res.json({ courses });
};
