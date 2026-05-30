"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNote = exports.updateNote = exports.createNote = exports.getLessonNotes = void 0;
const db_1 = require("../../config/db");
const zod_1 = require("zod");
const noteSchema = zod_1.z.object({
    lessonId: zod_1.z.string().uuid(),
    title: zod_1.z.string().min(2),
    content: zod_1.z.string().min(1),
    fileUrl: zod_1.z.string().url().optional(),
});
const getLessonNotes = async (req, res) => {
    const lessonId = req.params.lessonId;
    const notes = await db_1.prisma.note.findMany({
        where: { lessonId },
        orderBy: { createdAt: 'asc' }
    });
    res.json({ notes });
};
exports.getLessonNotes = getLessonNotes;
const createNote = async (req, res) => {
    const result = noteSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({ error: result.error.flatten() });
        return;
    }
    const note = await db_1.prisma.note.create({ data: result.data });
    res.status(201).json({ note });
};
exports.createNote = createNote;
const updateNote = async (req, res) => {
    const id = req.params.id;
    const result = noteSchema.partial().safeParse(req.body);
    if (!result.success) {
        res.status(400).json({ error: result.error.flatten() });
        return;
    }
    const note = await db_1.prisma.note.update({
        where: { id },
        data: result.data,
    });
    res.json({ note });
};
exports.updateNote = updateNote;
const deleteNote = async (req, res) => {
    const id = req.params.id;
    await db_1.prisma.note.delete({ where: { id } });
    res.json({ message: 'Note deleted successfully' });
};
exports.deleteNote = deleteNote;
