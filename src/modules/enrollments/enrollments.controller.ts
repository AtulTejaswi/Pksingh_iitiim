import { Request, Response } from 'express';
import { prisma } from '../../config/db';
import { AuthRequest } from '../../middleware/auth.middleware';
import { z } from 'zod';
import { formatZodError } from '../../utils/formatZodError';

const enrollmentSchema = z.object({
  courseId: z.string().uuid(),
});

export const enroll = async (req: AuthRequest, res: Response): Promise<void> => {
  const result = enrollmentSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: formatZodError(result.error) });
    return;
  }
  if (!req.user) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }

  const { courseId } = result.data;

  try {
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: req.user.id,
        courseId,
      },
    });
    res.status(201).json({ enrollment });
  } catch (error: any) {
    if (error.code === 'P2002') {
      res.status(400).json({ error: 'Already enrolled in this course' });
      return;
    }
    res.status(500).json({ error: 'Failed to enroll' });
  }
};

export const getMyEnrollments = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: req.user.id },
    include: {
      course: {
        select: { id: true, title: true, thumbnailUrl: true }
      }
    }
  });

  res.json({ enrollments });
};

export const listAllEnrollments = async (req: AuthRequest, res: Response): Promise<void> => {
  const { courseId } = req.query;
  const enrollments = await prisma.enrollment.findMany({
    where: {
      ...(courseId && { courseId: courseId as string })
    },
    include: {
      user: { select: { id: true, email: true, fullName: true } },
      course: { select: { id: true, title: true } }
    },
    orderBy: { enrolledAt: 'desc' },
  });

  res.json({ enrollments });
};

export const exportEnrollments = async (req: AuthRequest, res: Response): Promise<void> => {
  const { courseId, format } = req.query;
  const enrollments = await prisma.enrollment.findMany({
    where: {
      ...(courseId && { courseId: courseId as string }),
    },
    include: {
      user: { select: { id: true, email: true, fullName: true } },
      course: { select: { id: true, title: true } }
    },
    orderBy: { enrolledAt: 'desc' },
  });

  if (String(format).toLowerCase() === 'csv') {
    const csv = ['id,userId,userEmail,userName,courseId,courseTitle,status,enrolledAt,completedAt',
      ...enrollments.map((enrollment) =>
        `${enrollment.id},${enrollment.user.id},"${enrollment.user.email}","${enrollment.user.fullName}",${enrollment.course.id},"${enrollment.course.title}",${enrollment.status},${enrollment.enrolledAt.toISOString()},${enrollment.completedAt?.toISOString() || ''}`
      ),
    ].join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="enrollments-export.csv"');
    res.send(csv);
    return;
  }

  res.json({ enrollments });
};

export const removeEnrollment = async (req: AuthRequest, res: Response): Promise<void> => {
  const id = req.params.id as string;
  await prisma.enrollment.delete({ where: { id } });
  res.json({ message: 'Enrollment removed' });
};
