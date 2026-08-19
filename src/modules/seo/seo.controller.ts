import { Request, Response } from 'express';
import { prisma } from '../../config/db';

/**
 * GET /api/seo/sitemap-data — Returns all published courses + lessons
 * with slugs, titles, and metadata for programmatic SEO page generation.
 *
 * The frontend uses this to:
 * 1. Generate static sitemap entries for every topic/chapter page
 * 2. Build programmatic "study guides" at /study/:slug
 * 3. Create structured data (JSON-LD) for search engines
 */
export const getSitemapData = async (_req: Request, res: Response): Promise<void> => {
  try {
    const courses = await prisma.course.findMany({
      where: { status: 'PUBLISHED' },
      select: {
        id: true,
        title: true,
        description: true,
        subject: true,
        thumbnailUrl: true,
        isFree: true,
        lessons: {
          where: { status: 'PUBLISHED' },
          select: {
            id: true,
            title: true,
            description: true,
            isFree: true,
            sortOrder: true,
          },
          orderBy: { sortOrder: 'asc' },
        },
        tags: {
          select: { tag: { select: { name: true, slug: true } } },
        },
        _count: { select: { lessons: true, enrollments: true } },
      },
      orderBy: { sortOrder: 'asc' },
    });

    // Generate SEO-friendly slugs from course titles and lesson titles
    type SeoPage = {
      type: 'course' | 'lesson';
      slug: string;
      courseId: string;
      lessonId: string | null;
      title: string;
      description: string | null;
      subject: string;
      thumbnailUrl: string | null;
      isFree: boolean;
      tags: string[];
      lessonCount: number | null;
      enrollmentCount: number | null;
    };

    const seoPages: SeoPage[] = courses.flatMap((course) => {
      const courseSlug = slugify(course.title);

      // Course-level SEO page
      const pages: SeoPage[] = [
        {
          type: 'course' as const,
          slug: courseSlug,
          courseId: course.id,
          lessonId: null,
          title: course.title,
          description: course.description,
          subject: course.subject,
          thumbnailUrl: course.thumbnailUrl,
          isFree: course.isFree,
          tags: course.tags.map((t) => t.tag.name),
          lessonCount: course._count.lessons,
          enrollmentCount: course._count.enrollments,
        },
      ];

      // Lesson-level SEO pages
      for (const lesson of course.lessons) {
        const lessonSlug = `${courseSlug}/${slugify(lesson.title)}`;
        pages.push({
          type: 'lesson' as const,
          slug: lessonSlug,
          courseId: course.id,
          lessonId: lesson.id,
          title: `${lesson.title} — ${course.title}`,
          description: lesson.description || course.description,
          subject: course.subject,
          thumbnailUrl: course.thumbnailUrl,
          isFree: lesson.isFree,
          tags: course.tags.map((t) => t.tag.name),
          lessonCount: null,
          enrollmentCount: null,
        });
      }

      return pages;
    });

    res.json({ pages: seoPages, total: seoPages.length });
  } catch (err: any) {
    console.error('[seo/getSitemapData]', err);
    res.status(500).json({ error: 'Failed to generate SEO data.' });
  }
};

/**
 * GET /api/seo/study/:slug — Returns content for a specific study guide page.
 * Used by the frontend's /study/[slug] dynamic route.
 */
export const getStudyGuide = async (req: Request, res: Response): Promise<void> => {
  try {
    const rawSlug = req.params.slug as string;

    // Try to find by course slug first, then by lesson slug
    const courses = await prisma.course.findMany({
      where: { status: 'PUBLISHED' },
      select: {
        id: true,
        title: true,
        description: true,
        subject: true,
        thumbnailUrl: true,
        isFree: true,
        price: true,
        lessons: {
          where: { status: 'PUBLISHED' },
          select: {
            id: true,
            title: true,
            description: true,
            content: true,
            isFree: true,
            sortOrder: true,
            notes: { select: { title: true, content: true } },
          },
          orderBy: { sortOrder: 'asc' },
        },
        tags: { select: { tag: { select: { name: true } } } },
        _count: { select: { enrollments: true } },
      },
    });

    // Match slug against course titles and lesson titles
    for (const course of courses) {
      const courseSlug = slugify(course.title);

      // Check if it's a course page
      if (courseSlug === rawSlug) {
        res.json({
          type: 'course',
          slug: courseSlug,
          course: {
            ...course,
            tags: course.tags.map((t) => t.tag.name),
            enrollmentCount: course._count.enrollments,
          },
        });
        return;
      }

      // Check if it's a lesson page
      for (const lesson of course.lessons) {
        const lessonSlug = `${courseSlug}/${slugify(lesson.title)}`;
        if (lessonSlug === rawSlug) {
          res.json({
            type: 'lesson',
            slug: lessonSlug,
            course: {
              id: course.id,
              title: course.title,
              subject: course.subject,
              thumbnailUrl: course.thumbnailUrl,
              isFree: course.isFree,
            },
            lesson: {
              ...lesson,
              notes: lesson.notes,
            },
          });
          return;
        }
      }
    }

    res.status(404).json({ error: 'Study guide not found.' });
  } catch (err: any) {
    console.error('[seo/getStudyGuide]', err);
    res.status(500).json({ error: 'Failed to load study guide.' });
  }
};

/**
 * GET /api/seo/structured-data/:slug — Returns JSON-LD structured data
 * for a study guide page, for embedding in <script type="application/ld+json">.
 */
export const getStructuredData = async (req: Request, res: Response): Promise<void> => {
  try {
    const rawSlug = req.params.slug as string;
    const baseUrl = process.env.FRONTEND_URL || 'https://pksingh-iitiim.vercel.app';

    const courses = await prisma.course.findMany({
      where: { status: 'PUBLISHED' },
      select: {
        id: true,
        title: true,
        description: true,
        subject: true,
        isFree: true,
        lessons: {
          where: { status: 'PUBLISHED' },
          select: { id: true, title: true, description: true, isFree: true, sortOrder: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    for (const course of courses) {
      const courseSlug = slugify(course.title);

      if (courseSlug === rawSlug) {
        const structuredData = {
          '@context': 'https://schema.org',
          '@type': 'Course',
          name: course.title,
          description: course.description,
          provider: {
            '@type': 'Organization',
            name: 'PK Singh Mentorship',
            sameAs: 'https://pksingh-iitiim.vercel.app',
          },
          educationalLevel: course.subject,
          isAccessibleForFree: course.isFree,
          hasCourseInstance: {
            '@type': 'CourseInstance',
            courseMode: 'online',
            courseWorkload: `${course.lessons.length} lessons`,
          },
        };

        res.json(structuredData);
        return;
      }

      for (const lesson of course.lessons) {
        const lessonSlug = `${courseSlug}/${slugify(lesson.title)}`;
        if (lessonSlug === rawSlug) {
          const structuredData = {
            '@context': 'https://schema.org',
            '@type': 'TechArticle',
            headline: lesson.title,
            description: lesson.description || course.description,
            author: {
              '@type': 'Person',
              name: 'PK Singh',
              url: 'https://pksingh-iitiim.vercel.app',
            },
            publisher: {
              '@type': 'Organization',
              name: 'PK Singh Mentorship',
            },
            about: {
              '@type': 'Thing',
              name: course.subject,
            },
            isAccessibleForFree: lesson.isFree,
          };

          res.json(structuredData);
          return;
        }
      }
    }

    res.status(404).json({ error: 'No structured data available for this page.' });
  } catch (err: any) {
    console.error('[seo/getStructuredData]', err);
    res.status(500).json({ error: 'Failed to generate structured data.' });
  }
};

/** Generate a URL-friendly slug from a title. */
function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
