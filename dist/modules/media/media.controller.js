"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMedia = exports.getLessonMedia = exports.addLink = exports.uploadMedia = exports.upload = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const supabase_js_1 = require("@supabase/supabase-js");
const multer_1 = __importDefault(require("multer"));
const db_1 = require("../../config/db");
const useSupabase = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
const supabase = useSupabase
    ? (0, supabase_js_1.createClient)(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
    : null;
// Multer: in-memory buffer (we stream to Supabase)
exports.upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE_MB || '50') * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = (process.env.ALLOWED_MIME_TYPES || 'application/pdf,video/mp4,image/jpeg,image/png,image/webp').split(',');
        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error(`File type ${file.mimetype} not allowed`));
        }
    },
});
const uploadMedia = async (req, res) => {
    const file = req.file;
    const { lessonId, title } = req.body;
    if (!file) {
        res.status(400).json({ error: 'No file provided' });
        return;
    }
    const ext = file.originalname.split('.').pop();
    const storagePath = `lessons/${lessonId}/${Date.now()}.${ext}`;
    let publicUrl;
    let savedPath = storagePath;
    if (useSupabase && supabase) {
        const { error: uploadError } = await supabase.storage
            .from('media')
            .upload(storagePath, file.buffer, { contentType: file.mimetype });
        if (uploadError) {
            res.status(500).json({ error: 'File upload failed' });
            return;
        }
        const { data } = supabase.storage.from('media').getPublicUrl(storagePath);
        publicUrl = data.publicUrl;
    }
    else {
        const uploadFolder = path_1.default.join(process.cwd(), 'uploads', 'lessons', lessonId);
        fs_1.default.mkdirSync(uploadFolder, { recursive: true });
        const filename = `${Date.now()}.${ext}`;
        const filePath = path_1.default.join(uploadFolder, filename);
        fs_1.default.writeFileSync(filePath, file.buffer);
        publicUrl = `${process.env.BACKEND_URL || 'http://localhost:4000'}/uploads/lessons/${lessonId}/${filename}`;
        savedPath = `uploads/lessons/${lessonId}/${filename}`;
    }
    const type = file.mimetype === 'application/pdf' ? 'PDF'
        : file.mimetype.startsWith('video') ? 'VIDEO'
            : 'IMAGE';
    const media = await db_1.prisma.media.create({
        data: {
            lessonId,
            title: title ?? file.originalname,
            type,
            url: publicUrl,
            storagePath: savedPath,
            sizeBytes: file.size,
            mimeType: file.mimetype,
        },
    });
    res.status(201).json({ media });
};
exports.uploadMedia = uploadMedia;
const addLink = async (req, res) => {
    const { lessonId, title, url, type } = req.body; // type = YOUTUBE_LINK or EXTERNAL_LINK
    if (!['YOUTUBE_LINK', 'EXTERNAL_LINK'].includes(type)) {
        res.status(400).json({ error: 'Invalid link type' });
        return;
    }
    const media = await db_1.prisma.media.create({
        data: {
            lessonId,
            title,
            type,
            url,
        }
    });
    res.status(201).json({ media });
};
exports.addLink = addLink;
const getLessonMedia = async (req, res) => {
    const lessonId = req.params.lessonId;
    const media = await db_1.prisma.media.findMany({
        where: { lessonId },
        orderBy: { sortOrder: 'asc' }
    });
    res.json({ media });
};
exports.getLessonMedia = getLessonMedia;
const deleteMedia = async (req, res) => {
    const id = req.params.id;
    const media = await db_1.prisma.media.findUnique({ where: { id } });
    if (!media) {
        res.status(404).json({ error: 'Media not found' });
        return;
    }
    if (media.storagePath) {
        if (useSupabase && supabase) {
            await supabase.storage.from('media').remove([media.storagePath]);
        }
        else {
            const filePath = path_1.default.join(process.cwd(), media.storagePath);
            if (fs_1.default.existsSync(filePath)) {
                fs_1.default.unlinkSync(filePath);
            }
        }
    }
    await db_1.prisma.media.delete({ where: { id } });
    res.json({ message: 'Media deleted successfully' });
};
exports.deleteMedia = deleteMedia;
