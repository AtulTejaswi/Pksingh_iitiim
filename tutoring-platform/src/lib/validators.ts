import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const signupSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  country: z.enum(['IN', 'US']),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const courseSchema = z.object({
  title: z.string().min(3, 'Course title must be at least 3 characters').max(200),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  subject: z.enum(['PHYSICS', 'CHEMISTRY', 'MATH']),
  examTags: z.array(z.enum([
    'JEE_MAINS',
    'JEE_ADVANCED',
    'NEET',
    'MHT_CET',
    'SAT',
    'AP_PHYSICS',
    'AP_CHEMISTRY',
    'AP_CALCULUS',
    'GENERAL'
  ])),
  isFree: z.boolean(),
  thumbnailUrl: z.string().url('Invalid URL format').optional().or(z.literal('')),
});

export const lessonSchema = z.object({
  courseId: z.string().uuid('Invalid course ID'),
  title: z.string().min(3, 'Lesson title must be at least 3 characters').max(200),
  description: z.string().optional(),
  content: z.string().optional(),
  sortOrder: z.number().int().optional(),
  isFree: z.boolean(),
  isPublished: z.boolean(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type CourseInput = z.infer<typeof courseSchema>;
export type LessonInput = z.infer<typeof lessonSchema>;
