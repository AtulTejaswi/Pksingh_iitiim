"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMedia = exports.getLessonMedia = exports.addLink = exports.uploadMedia = exports.upload = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const multer_1 = __importDefault(require("multer"));
const db_1 = require("../../config/db");
const supabase = (0, supabase_js_1.createClient)(process.env.SUPABASE_URL || 'https://placeholder.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder');
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
    // Upload to Supabase Storage bucket named "media"
    const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(storagePath, file.buffer, { contentType: file.mimetype });
    if (uploadError) {
        res.status(500).json({ error: 'File upload failed' });
        return;
    }
    const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(storagePath);
    const type = file.mimetype === 'application/pdf' ? 'PDF'
        : file.mimetype.startsWith('video') ? 'VIDEO'
            : 'IMAGE';
    const media = await db_1.prisma.media.create({
        data: {
            lessonId,
            title: title ?? file.originalname,
            type,
            url: publicUrl,
            storagePath,
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
        await supabase.storage.from('media').remove([media.storagePath]);
    }
    await db_1.prisma.media.delete({ where: { id } });
    res.json({ message: 'Media deleted successfully' });
};
exports.deleteMedia = deleteMedia;
