import { Request, Response } from 'express';
import { prisma } from '../../config/db';
import { AuthRequest } from '../../middleware/auth.middleware';
import { z } from 'zod';
import { formatZodError } from '../../utils/formatZodError';

const noteSchema = z.object({
  lessonId: z.string().uuid(),
  title: z.string().min(2),
  content: z.string().min(1),
  fileUrl: z.string().url().optional(),
});

export const getLessonNotes = async (req: AuthRequest, res: Response): Promise<void> => {
  const lessonId = req.params.lessonId as string;
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: { id: true, isFree: true, courseId: true, status: true },
  });
  const isStaff = req.user?.role === 'SUPER_ADMIN' || req.user?.role === 'MENTOR';

  // Notes are paid study material — a draft lesson or a paid lesson of a
  // course the user isn't enrolled in must not leak them (same gate as
  // getLessonMedia).
  if (!lesson || (lesson.status !== 'PUBLISHED' && !isStaff)) {
    res.status(404).json({ error: 'Lesson not found' });
    return;
  }
  if (!lesson.isFree && !isStaff) {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }
    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: req.user.id, courseId: lesson.courseId } },
    });
    if (!enrollment) {
      res.status(403).json({ error: 'Must be enrolled to access this lesson' });
      return;
    }
  }

  const notes = await prisma.note.findMany({
    where: { lessonId },
    orderBy: { createdAt: 'asc' }
  });
  res.json({ notes });
};

export const createNote = async (req: AuthRequest, res: Response): Promise<void> => {
  const result = noteSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: formatZodError(result.error) });
    return;
  }

  const note = await prisma.note.create({ data: result.data });
  res.status(201).json({ note });
};

export const updateNote = async (req: AuthRequest, res: Response): Promise<void> => {
  const id = req.params.id as string;
  const result = noteSchema.partial().safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: formatZodError(result.error) });
    return;
  }

  const note = await prisma.note.update({
    where: { id },
    data: result.data,
  });
  res.json({ note });
};

export const deleteNote = async (req: AuthRequest, res: Response): Promise<void> => {
  const id = req.params.id as string;
  await prisma.note.delete({ where: { id } });
  res.json({ message: 'Note deleted successfully' });
};
