import { Request, Response } from 'express';
import { prisma } from '../../config/db';
import { AuthRequest } from '../../middleware/auth.middleware';
import { autoBackup } from '../backup/backup.controller';

export const listLessons = async (req: AuthRequest, res: Response): Promise<void> => {
  const { courseId } = req.query;
  const lessons = await prisma.lesson.findMany({
    where: courseId ? { courseId: courseId as string } : undefined,
    orderBy: { sortOrder: 'asc' },
  });
  res.json({ lessons });
};

export const getLesson = async (req: AuthRequest, res: Response): Promise<void> => {
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
  if (lesson.status !== 'PUBLISHED' && !lesson.isFree && !isAdminOrMentor) {
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
};

export const createLesson = async (req: AuthRequest, res: Response): Promise<void> => {
  const { courseId, title, description, content, isFree, status } = req.body;
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
};

export const updateLesson = async (req: AuthRequest, res: Response): Promise<void> => {
  const id = req.params.id as string;
  const lesson = await prisma.lesson.update({
    where: { id },
    data: req.body,
  });
  autoBackup();
  res.json({ lesson });
};

export const deleteLesson = async (req: AuthRequest, res: Response): Promise<void> => {
  const id = req.params.id as string;
  await prisma.lesson.delete({ where: { id } });
  autoBackup();
  res.json({ message: 'Lesson deleted successfully' });
};

export const reorderLessons = async (req: AuthRequest, res: Response): Promise<void> => {
  const { lessonIds } = req.body as { lessonIds: string[] };
  const updates = lessonIds.map((id, index) =>
    prisma.lesson.update({ where: { id }, data: { sortOrder: index } })
  );
  await prisma.$transaction(updates);
  res.json({ message: 'Lessons reordered successfully' });
};

export const markProgress = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) return;
  const lessonId = req.params.id as string;
  const progress = await prisma.lessonProgress.upsert({
    where: { userId_lessonId: { userId: req.user.id, lessonId } },
    update: {},
    create: { userId: req.user.id, lessonId },
  });
  res.json({ message: 'Progress marked', progress });
};
