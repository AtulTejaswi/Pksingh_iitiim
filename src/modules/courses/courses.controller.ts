import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/db';
import { z } from 'zod';
import { formatZodError } from '../../utils/formatZodError';
import { AuthRequest } from '../../middleware/auth.middleware';
import { autoBackup } from '../backup/backup.controller';
import { NotFoundError } from '../../utils/errors';
import { storageService } from '../../utils/storage';

const courseSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10),
  subject: z.string(),
  isFree: z.boolean().optional(),
  // Sale price in whole rupees (shown to students; stored as-is). Free/paid
  // is driven by isFree — price is the amount charged when the course is paid.
  price: z.number().int().min(0).optional().nullable(),
  thumbnailUrl: z.union([z.string().url(), z.literal('')]).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  categoryId: z.string().optional(),
  examTags: z.array(z.string()).optional(),
});

async function upsertExamTags(courseId: string, examTags: string[]) {
  await prisma.courseTag.deleteMany({ where: { courseId } });
  for (const tagName of examTags) {
    const slug = tagName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const tag = await prisma.tag.upsert({
      where: { name: tagName },
      update: {},
      create: { name: tagName, slug },
    });
    await prisma.courseTag.create({ data: { courseId, tagId: tag.id } });
  }
}

const courseWithTags = {
  id: true, title: true, description: true,
  subject: true, thumbnailUrl: true, isFree: true, price: true,
  status: true, categoryId: true, sortOrder: true, createdAt: true,
  tags: { select: { tag: { select: { name: true } } } },
  _count: { select: { lessons: true, enrollments: true } },
} as const;

export const listCourses = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { subject, categoryId, examTag, page = '1', limit = '12', includeDrafts = '0' } = req.query;

    const includeDraftsBool = String(includeDrafts) === '1' || String(includeDrafts).toLowerCase() === 'true';
    const isAdminOrMentor = req.user?.role === 'SUPER_ADMIN' || req.user?.role === 'MENTOR';

    const whereClause: any = {
      ...(subject && { subject: subject as string }),
      ...(categoryId && { categoryId: categoryId as string }),
      ...(examTag && { tags: { some: { tag: { name: examTag as string } } } }),
    };

    if (!includeDraftsBool || !isAdminOrMentor) {
      whereClause.status = 'PUBLISHED';
    }

    const courses = await prisma.course.findMany({
      where: whereClause,
      select: courseWithTags,
      skip: (parseInt(page as string) - 1) * parseInt(limit as string),
      take: parseInt(limit as string),
      orderBy: { sortOrder: 'asc' },
    });

    const mapped = courses.map(({ tags, ...rest }) => ({
      ...rest,
      isPublished: rest.status === 'PUBLISHED',
      examTags: tags.map((t) => t.tag.name),
    }));

    res.json({ courses: mapped });
  } catch (err) {
    next(err);
  }
};

export const getCourse = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
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

    const tagsData = await prisma.courseTag.findMany({
      where: { courseId: id },
      select: { tag: { select: { name: true } } },
    });
    const courseWithExamTags = {
      ...course,
      isPublished: course.status === 'PUBLISHED',
      examTags: tagsData.map((t) => t.tag.name),
    };

    res.json({ course: courseWithExamTags });
  } catch (err) {
    next(err);
  }
};

/**
 * Lightweight public endpoint for video-grid pages: returns every published
 * lesson of a course with its YouTube video ID (extracted from the attached
 * media), so the frontend can render thumbnails + play buttons with ONE
 * request. No media, notes or other lesson payload — just what a grid needs.
 */
export const getCourseVideos = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const course = await prisma.course.findUnique({
      where: { id },
      select: { id: true, title: true, isFree: true, status: true },
    });
    if (!course) {
      res.status(404).json({ error: 'Course not found' });
      return;
    }
    if (course.status !== 'PUBLISHED') {
      res.status(404).json({ error: 'Course not found' });
      return;
    }

    const lessons = await prisma.lesson.findMany({
      where: { courseId: id, status: 'PUBLISHED' },
      select: {
        id: true,
        title: true,
        isFree: true,
        sortOrder: true,
        media: {
          orderBy: { sortOrder: 'asc' },
          select: {
            mediaAsset: { select: { url: true, type: true } },
          },
        },
      },
      orderBy: { sortOrder: 'asc' },
    });

    const videos = lessons
      .map((lesson) => {
        const youTube = lesson.media.find((m) => m.mediaAsset?.type === 'YOUTUBE_LINK');
        const url = youTube?.mediaAsset?.url || '';
        const match = /[?&]v=([A-Za-z0-9_-]{11})/.exec(url);
        return {
          lessonId: lesson.id,
          title: lesson.title,
          isFree: lesson.isFree,
          sortOrder: lesson.sortOrder,
          videoId: match ? match[1] : null,
          url: match ? url : null,
        };
      })
      .filter((v) => v.videoId);

    res.json({ course: { id: course.id, title: course.title, isFree: course.isFree }, videos });
  } catch (err) {
    next(err);
  }
};

export const getPublicStats = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const [students, publishedCourses, publishedLessons, enrollments] = await Promise.all([
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.course.count({ where: { status: 'PUBLISHED' } }),
      prisma.lesson.count({ where: { status: 'PUBLISHED' } }),
      prisma.enrollment.count({ where: { status: 'ACTIVE' } }),
    ]);
    res.json({ stats: { students, publishedCourses, publishedLessons, enrollments } });
  } catch (err) {
    next(err);
  }
};

export const getCourseProgress = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
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
  } catch (err) {
    next(err);
  }
};

export const createCourse = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = courseSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: formatZodError(result.error) });
      return;
    }
    const { examTags, ...courseData } = result.data;
    const course = await prisma.course.create({ data: courseData as any });
    if (examTags && examTags.length > 0) {
      await upsertExamTags(course.id, examTags);
    }
    autoBackup();
    res.status(201).json({ course: { ...course, isPublished: course.status === 'PUBLISHED' } });
  } catch (err) {
    next(err);
  }
};

export const updateCourse = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const result = courseSchema.partial().safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: formatZodError(result.error) });
      return;
    }

    const existing = await prisma.course.findUnique({ where: { id }, select: { id: true } });
    if (!existing) {
      throw new NotFoundError('Course not found. It may have been deleted already.');
    }

    const { examTags, ...courseData } = result.data;
    const course = await prisma.course.update({ where: { id }, data: courseData as any });
    if (examTags) {
      await upsertExamTags(id, examTags);
    }
    autoBackup();
    res.json({ course: { ...course, isPublished: course.status === 'PUBLISHED' } });
  } catch (err) {
    next(err);
  }
};

export const deleteCourse = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;

    // Deleting a Course cascades Lessons -> LessonMedia in the DB, but the
    // MediaAsset rows (and the actual files in storage) are NOT part of
    // that cascade — clean those up explicitly so deleting a course doesn't
    // leave every one of its videos/PDFs orphaned in storage forever.
    const mediaLinks = await prisma.lessonMedia.findMany({
      where: { lesson: { courseId: id } },
      include: { mediaAsset: true },
    });

    await prisma.course.delete({ where: { id } });

    await Promise.all(
      mediaLinks.map(async (link) => {
        await prisma.mediaAsset.deleteMany({ where: { id: link.mediaAssetId } }).catch(() => null);
        if (link.mediaAsset.storagePath) {
          await storageService.deleteFile(link.mediaAsset.storagePath).catch(() => null);
        }
      })
    );

    autoBackup();
    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    next(err);
  }
};

export const togglePublish = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { isPublished } = req.body;
    const status = isPublished ? 'PUBLISHED' : 'DRAFT';
    const course = await prisma.course.update({ where: { id }, data: { status } });
    res.json({ course: { ...course, status, isPublished: isPublished } });
  } catch (err) {
    next(err);
  }
};

export const exportCourses = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const courses = await prisma.course.findMany({ orderBy: { sortOrder: 'asc' } });
    const withFlag = courses.map((c) => ({ ...c, isPublished: c.status === 'PUBLISHED' }));
    res.json({ courses: withFlag });
  } catch (err) {
    next(err);
  }
};
