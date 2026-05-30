"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeEnrollment = exports.listAllEnrollments = exports.getMyEnrollments = exports.enroll = void 0;
const db_1 = require("../../config/db");
const zod_1 = require("zod");
const enrollmentSchema = zod_1.z.object({
    courseId: zod_1.z.string().uuid(),
});
const enroll = async (req, res) => {
    const result = enrollmentSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({ error: result.error.flatten() });
        return;
    }
    if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
    }
    const { courseId } = result.data;
    try {
        const enrollment = await db_1.prisma.enrollment.create({
            data: {
                userId: req.user.id,
                courseId,
            },
        });
        res.status(201).json({ enrollment });
    }
    catch (error) {
        if (error.code === 'P2002') {
            res.status(400).json({ error: 'Already enrolled in this course' });
            return;
        }
        res.status(500).json({ error: 'Failed to enroll' });
    }
};
exports.enroll = enroll;
const getMyEnrollments = async (req, res) => {
    if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
    }
    const enrollments = await db_1.prisma.enrollment.findMany({
        where: { userId: req.user.id },
        include: {
            course: {
                select: { id: true, title: true, thumbnailUrl: true }
            }
        }
    });
    res.json({ enrollments });
};
exports.getMyEnrollments = getMyEnrollments;
const listAllEnrollments = async (req, res) => {
    const { courseId } = req.query;
    const enrollments = await db_1.prisma.enrollment.findMany({
        where: {
            ...(courseId && { courseId: courseId })
        },
        include: {
            user: { select: { id: true, email: true, fullName: true } },
            course: { select: { id: true, title: true } }
        }
    });
    res.json({ enrollments });
};
exports.listAllEnrollments = listAllEnrollments;
const removeEnrollment = async (req, res) => {
    const id = req.params.id;
    await db_1.prisma.enrollment.delete({ where: { id } });
    res.json({ message: 'Enrollment removed' });
};
exports.removeEnrollment = removeEnrollment;
