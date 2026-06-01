import { Request, Response } from 'express';
import { prisma } from '../../config/db';
import { z } from 'zod';
import { formatZodError } from '../../utils/formatZodError';
import { AuthRequest } from '../../middleware/auth.middleware';

const courseSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10),
  subject: z.enum(['PHYSICS', 'CHEMISTRY', 'MATH']),
  examTags: z.array(z.enum(['JEE_MAINS','JEE_ADVANCED','NEET','MHT_CET','SAT','AP_PHYSICS','AP_CHEMISTRY','AP_CALCULUS','GENERAL'])),
  isFree: z.boolean().optional(),
  thumbnailUrl: z.union([z.string().url(), z.literal('')]).optional(),
  isPublished: z.boolean().optional(),
});

// GET /api/courses — public
export const listCourses = async (req: Request, res: Response): Promise<void> => {
  const { subject, examTag, page = '1', limit = '12', includeDrafts = '0' } = req.query;

  const includeDraftsBool = String(includeDrafts) === '1' || String(includeDrafts).toLowerCase() === 'true';

  const whereClause: any = {
    ...(subject && { subject: subject as any }),
    ...(examTag && { examTags: { contains: examTag as string } }),
  };

  if (!includeDraftsBool) {
    whereClause.isPublished = true;
  }

  console.log('DEBUG listCourses whereClause before query:', whereClause);
  const courses = await prisma.course.findMany({
    where: whereClause,
    select: {
      id: true, title: true, description: true,
      subject: true, examTags: true, thumbnailUrl: true, isFree: true,
      isPublished: true,
      _count: { select: { lessons: true, enrollments: true } },
    },
    skip: (parseInt(page as string) - 1) * parseInt(limit as string),
    take: parseInt(limit as string),
    orderBy: { sortOrder: 'asc' },
  });

  console.log('DEBUG listCourses where:', whereClause, 'returned:', courses.length);
  console.log('DEBUG listCourses sample course:', courses[0]);

  const parsedCourses = courses.map((course) => ({
    ...course,
    examTags: course.examTags ? JSON.parse(course.examTags) : [],
  }));

  res.json({ courses: parsedCourses });
};

export const getCourse = async (req: AuthRequest, res: Response): Promise<void> => {
  const id = req.params.id as string;
  const isAdmin = req.user?.role === 'ADMIN';
  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      lessons: {
        where: isAdmin ? undefined : { isPublished: true },
        select: { id: true, title: true, isFree: true, sortOrder: true, description: true, isPublished: true },
        orderBy: { sortOrder: 'asc' }
      }
    }
  });

  if (!course) {
    res.status(404).json({ error: 'Course not found' });
    return;
  }
  
  res.json({ course: { ...course, examTags: course.examTags ? JSON.parse(course.examTags) : [] } });
};

// POST /api/courses — admin only
export const createCourse = async (req: AuthRequest, res: Response): Promise<void> => {
  const result = courseSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: formatZodError(result.error) });
    return;
  }

  const course = await prisma.course.create({
    data: {
      ...result.data,
      examTags: JSON.stringify(result.data.examTags),
    },
  });
  res.status(201).json({ course: { ...course, examTags: JSON.parse(course.examTags) } });
};

export const updateCourse = async (req: AuthRequest, res: Response): Promise<void> => {
  const id = req.params.id as string;
  const result = courseSchema.partial().safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: formatZodError(result.error) });
    return;
  }

  const { examTags, ...rest } = result.data;
  const dataToUpdate: Record<string, unknown> = {
    ...rest,
  };

  if (examTags !== undefined) {
    dataToUpdate.examTags = JSON.stringify(examTags);
  }

  const course = await prisma.course.update({
    where: { id },
    data: dataToUpdate as any,
  });
  res.json({ course: { ...course, examTags: course.examTags ? JSON.parse(course.examTags) : [] } });
};

export const deleteCourse = async (req: AuthRequest, res: Response): Promise<void> => {
  const id = req.params.id as string;
  await prisma.course.delete({ where: { id } });
  res.json({ message: 'Course deleted successfully' });
};

export const exportCourses = async (req: AuthRequest, res: Response): Promise<void> => {
  const { format } = req.query;
  const courses = await prisma.course.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      subject: true,
      examTags: true,
      thumbnailUrl: true,
      isFree: true,
      isPublished: true,
      sortOrder: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { sortOrder: 'asc' },
  });

  const payload = courses.map((course) => ({
    ...course,
    examTags: course.examTags ? JSON.parse(course.examTags) : [],
  }));

  if (String(format).toLowerCase() === 'csv') {
    const csvRows = [
      'id,title,description,subject,examTags,thumbnailUrl,isFree,isPublished,sortOrder,createdAt,updatedAt',
      ...payload.map((course) =>
        `${course.id},"${course.title.replace(/"/g, '""')}","${course.description.replace(/"/g, '""')}",${course.subject},"${JSON.stringify(course.examTags).replace(/"/g, '""')}",${course.thumbnailUrl ? '"' + course.thumbnailUrl + '"' : ''},${course.isFree},${course.isPublished},${course.sortOrder},${course.createdAt.toISOString()},${course.updatedAt.toISOString()}`
      ),
    ];
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="courses-export.csv"');
    res.send(csvRows.join('\n'));
    return;
  }

  res.json({ courses: payload });
};

export const togglePublish = async (req: AuthRequest, res: Response): Promise<void> => {
  const id = req.params.id as string;
  const { isPublished } = req.body;
  
  if (typeof isPublished !== 'boolean') {
    res.status(400).json({ error: 'isPublished must be a boolean' });
    return;
  }

  const course = await prisma.course.update({
    where: { id },
    data: { isPublished },
  });
  res.json({ course: { ...course, examTags: course.examTags ? JSON.parse(course.examTags) : [] } });
};
