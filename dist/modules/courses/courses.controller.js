"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.togglePublish = exports.exportCourses = exports.deleteCourse = exports.updateCourse = exports.createCourse = exports.getCourse = exports.listCourses = void 0;
const db_1 = require("../../config/db");
const zod_1 = require("zod");
const formatZodError_1 = require("../../utils/formatZodError");
const courseSchema = zod_1.z.object({
    title: zod_1.z.string().min(3).max(200),
    description: zod_1.z.string().min(10),
    subject: zod_1.z.enum(['PHYSICS', 'CHEMISTRY', 'MATH']),
    examTags: zod_1.z.array(zod_1.z.enum(['JEE_MAINS', 'JEE_ADVANCED', 'NEET', 'MHT_CET', 'SAT', 'AP_PHYSICS', 'AP_CHEMISTRY', 'AP_CALCULUS', 'GENERAL'])),
    isFree: zod_1.z.boolean().optional(),
    thumbnailUrl: zod_1.z.union([zod_1.z.string().url(), zod_1.z.literal('')]).optional(),
    isPublished: zod_1.z.boolean().optional(),
});
// GET /api/courses — public
const listCourses = async (req, res) => {
    const { subject, examTag, page = '1', limit = '12', includeDrafts = '0' } = req.query;
    const includeDraftsBool = String(includeDrafts) === '1' || String(includeDrafts).toLowerCase() === 'true';
    const whereClause = {
        ...(subject && { subject: subject }),
        ...(examTag && { examTags: { contains: examTag } }),
    };
    if (!includeDraftsBool) {
        whereClause.isPublished = true;
    }
    console.log('DEBUG listCourses whereClause before query:', whereClause);
    const courses = await db_1.prisma.course.findMany({
        where: whereClause,
        select: {
            id: true, title: true, description: true,
            subject: true, examTags: true, thumbnailUrl: true, isFree: true,
            _count: { select: { lessons: true, enrollments: true } },
        },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
        orderBy: { sortOrder: 'asc' },
    });
    console.log('DEBUG listCourses where:', whereClause, 'returned:', courses.length);
    const parsedCourses = courses.map((course) => ({
        ...course,
        examTags: course.examTags ? JSON.parse(course.examTags) : [],
    }));
    res.json({ courses: parsedCourses });
};
exports.listCourses = listCourses;
const getCourse = async (req, res) => {
    const id = req.params.id;
    const isAdmin = req.user?.role === 'ADMIN';
    const course = await db_1.prisma.course.findUnique({
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
exports.getCourse = getCourse;
// POST /api/courses — admin only
const createCourse = async (req, res) => {
    const result = courseSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({ error: (0, formatZodError_1.formatZodError)(result.error) });
        return;
    }
    const course = await db_1.prisma.course.create({
        data: {
            ...result.data,
            examTags: JSON.stringify(result.data.examTags),
        },
    });
    res.status(201).json({ course: { ...course, examTags: JSON.parse(course.examTags) } });
};
exports.createCourse = createCourse;
const updateCourse = async (req, res) => {
    const id = req.params.id;
    const result = courseSchema.partial().safeParse(req.body);
    if (!result.success) {
        res.status(400).json({ error: (0, formatZodError_1.formatZodError)(result.error) });
        return;
    }
    const { examTags, ...rest } = result.data;
    const dataToUpdate = {
        ...rest,
    };
    if (examTags !== undefined) {
        dataToUpdate.examTags = JSON.stringify(examTags);
    }
    const course = await db_1.prisma.course.update({
        where: { id },
        data: dataToUpdate,
    });
    res.json({ course: { ...course, examTags: course.examTags ? JSON.parse(course.examTags) : [] } });
};
exports.updateCourse = updateCourse;
const deleteCourse = async (req, res) => {
    const id = req.params.id;
    await db_1.prisma.course.delete({ where: { id } });
    res.json({ message: 'Course deleted successfully' });
};
exports.deleteCourse = deleteCourse;
const exportCourses = async (req, res) => {
    const { format } = req.query;
    const courses = await db_1.prisma.course.findMany({
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
            ...payload.map((course) => `${course.id},"${course.title.replace(/"/g, '""')}","${course.description.replace(/"/g, '""')}",${course.subject},"${JSON.stringify(course.examTags).replace(/"/g, '""')}",${course.thumbnailUrl ? '"' + course.thumbnailUrl + '"' : ''},${course.isFree},${course.isPublished},${course.sortOrder},${course.createdAt.toISOString()},${course.updatedAt.toISOString()}`),
        ];
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="courses-export.csv"');
        res.send(csvRows.join('\n'));
        return;
    }
    res.json({ courses: payload });
};
exports.exportCourses = exportCourses;
const togglePublish = async (req, res) => {
    const id = req.params.id;
    const { isPublished } = req.body;
    if (typeof isPublished !== 'boolean') {
        res.status(400).json({ error: 'isPublished must be a boolean' });
        return;
    }
    const course = await db_1.prisma.course.update({
        where: { id },
        data: { isPublished },
    });
    res.json({ course });
};
exports.togglePublish = togglePublish;
