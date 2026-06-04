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
        select: { id: true, title: true, thumbnailUrl: true, subject: true }
      }
    },
    orderBy: { enrolledAt: 'desc' },
  });

  const enriched = await Promise.all(
    enrollments.map(async (enrollment) => {
      const lessons = await prisma.lesson.findMany({
        where: { courseId: enrollment.courseId, status: 'PUBLISHED' },
        select: { id: true, sortOrder: true },
        orderBy: { sortOrder: 'asc' },
      });
      const completed = await prisma.lessonProgress.count({
        where: {
          userId: req.user!.id,
          lessonId: { in: lessons.map((l) => l.id) },
        },
      });
      const completedIds = await prisma.lessonProgress.findMany({
        where: {
          userId: req.user!.id,
          lessonId: { in: lessons.map((l) => l.id) },
        },
        select: { lessonId: true },
      });
      const completedSet = new Set(completedIds.map((r) => r.lessonId));
      const resumeLesson = lessons.find((l) => !completedSet.has(l.id));

      return {
        ...enrollment,
        progress: {
          totalLessons: lessons.length,
          completedLessons: completed,
          percentComplete: lessons.length === 0 ? 0 : Math.round((completed / lessons.length) * 100),
          resumeLessonId: resumeLesson?.id ?? lessons[0]?.id ?? null,
        },
      };
    })
  );

  res.json({ enrollments: enriched });
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
