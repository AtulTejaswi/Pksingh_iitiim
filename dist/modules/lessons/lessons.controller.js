"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markProgress = exports.deleteLesson = exports.updateLesson = exports.createLesson = exports.getLesson = exports.listLessons = void 0;
const db_1 = require("../../config/db");
const zod_1 = require("zod");
const formatZodError_1 = require("../../utils/formatZodError");
const lessonSchema = zod_1.z.object({
    courseId: zod_1.z.string().uuid(),
    title: zod_1.z.string().min(3).max(200),
    description: zod_1.z.string().optional(),
    content: zod_1.z.string().optional(),
    sortOrder: zod_1.z.number().int().optional(),
    isFree: zod_1.z.boolean().optional(),
    isPublished: zod_1.z.boolean().optional(),
});
// GET /api/lessons — list all lessons (admin only)
const listLessons = async (req, res) => {
    const { courseId } = req.query;
    const where = {};
    if (courseId)
        where.courseId = courseId;
    const lessons = await db_1.prisma.lesson.findMany({
        where,
        include: { media: true, notes: true },
        orderBy: { sortOrder: 'asc' },
    });
    res.json({ lessons });
};
exports.listLessons = listLessons;
const getLesson = async (req, res) => {
    const id = req.params.id;
    const lesson = await db_1.prisma.lesson.findUnique({
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
    const enrollment = await db_1.prisma.enrollment.findUnique({
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
exports.getLesson = getLesson;
// POST /api/lessons — admin only
const createLesson = async (req, res) => {
    const result = lessonSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({ error: (0, formatZodError_1.formatZodError)(result.error) });
        return;
    }
    const lesson = await db_1.prisma.lesson.create({ data: result.data });
    res.status(201).json({ lesson });
};
exports.createLesson = createLesson;
const updateLesson = async (req, res) => {
    const id = req.params.id;
    const result = lessonSchema.partial().safeParse(req.body);
    if (!result.success) {
        res.status(400).json({ error: (0, formatZodError_1.formatZodError)(result.error) });
        return;
    }
    const lesson = await db_1.prisma.lesson.update({
        where: { id },
        data: result.data,
    });
    res.json({ lesson });
};
exports.updateLesson = updateLesson;
const deleteLesson = async (req, res) => {
    const id = req.params.id;
    await db_1.prisma.lesson.delete({ where: { id } });
    res.json({ message: 'Lesson deleted successfully' });
};
exports.deleteLesson = deleteLesson;
// POST /api/lessons/:id/progress - student
const markProgress = async (req, res) => {
    const id = req.params.id;
    if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
    }
    const progress = await db_1.prisma.lessonProgress.upsert({
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
exports.markProgress = markProgress;
