"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMedia = exports.getLessonMedia = exports.addLink = exports.uploadMedia = exports.upload = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const supabase_js_1 = require("@supabase/supabase-js");
const multer_1 = __importDefault(require("multer"));
const db_1 = require("../../config/db");
const useSupabase = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
const supabase = useSupabase
    ? (0, supabase_js_1.createClient)(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
    : null;
// Multer: in-memory buffer (we stream to Supabase)
// Use disk storage to avoid buffering large uploads in memory.
const uploadTempDir = path_1.default.join(os_1.default.tmpdir(), 'pksingh_uploads');
fs_1.default.mkdirSync(uploadTempDir, { recursive: true });
exports.upload = (0, multer_1.default)({
    storage: multer_1.default.diskStorage({
        destination: (_req, _file, cb) => cb(null, uploadTempDir),
        filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
    }),
    limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE_MB || '500') * 1024 * 1024 },
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
    try {
        if (useSupabase && supabase) {
            // Stream file to Supabase storage to avoid buffering large files in memory.
            try {
                const fileStream = fs_1.default.createReadStream(file.path);
                const { error: uploadError } = await supabase.storage
                    .from('media')
                    .upload(storagePath, fileStream, { contentType: file.mimetype });
                if (uploadError) {
                    // Try buffer fallback if stream upload fails
                    const buffer = fs_1.default.readFileSync(file.path);
                    const { error: uploadError2 } = await supabase.storage.from('media').upload(storagePath, buffer, { contentType: file.mimetype });
                    if (uploadError2) {
                        console.error('Supabase upload errors', uploadError, uploadError2);
                        throw new Error('Supabase upload failed');
                    }
                }
                const { data } = supabase.storage.from('media').getPublicUrl(storagePath);
                publicUrl = data.publicUrl;
                // remove temp file after successful transfer
                if (fs_1.default.existsSync(file.path))
                    fs_1.default.unlinkSync(file.path);
            }
            catch (err) {
                // If supabase upload fails, rethrow so we return 500 to caller
                throw err;
            }
        }
        else {
            const uploadFolder = path_1.default.join(process.cwd(), 'uploads', 'lessons', lessonId);
            fs_1.default.mkdirSync(uploadFolder, { recursive: true });
            const filename = path_1.default.basename(file.path);
            const filePath = path_1.default.join(uploadFolder, filename);
            try {
                fs_1.default.copyFileSync(file.path, filePath);
            }
            catch (copyErr) {
                try {
                    fs_1.default.renameSync(file.path, filePath);
                }
                catch (renameErr) {
                    console.error('Failed to move temp file to uploads folder', copyErr, renameErr);
                }
            }
            // Use BACKEND_URL if provided; otherwise derive base URL from the incoming request
            const providedUrl = process.env.BACKEND_URL;
            const derivedBase = providedUrl ?? `${req.protocol}://${req.get('host')}`;
            publicUrl = `${derivedBase.replace(/\/$/, '')}/uploads/lessons/${lessonId}/${filename}`;
            savedPath = `uploads/lessons/${lessonId}/${filename}`;
        }
        const type = file.mimetype === 'application/pdf' ? 'PDF'
            : file.mimetype.startsWith('video') ? 'VIDEO'
                : 'IMAGE';
        const stats = fs_1.default.existsSync(file.path) ? fs_1.default.statSync(file.path) : { size: file.size };
        const media = await db_1.prisma.media.create({
            data: {
                lessonId,
                title: title ?? file.originalname,
                type,
                url: publicUrl,
                storagePath: savedPath,
                sizeBytes: stats.size,
                mimeType: file.mimetype,
            },
        });
        res.status(201).json({ media });
    }
    catch (err) {
        console.error('uploadMedia error', err);
        res.status(500).json({ error: 'File upload failed' });
    }
    finally {
        // Cleanup temp file if it still exists
        try {
            if (file.path && fs_1.default.existsSync(file.path))
                fs_1.default.unlinkSync(file.path);
        }
        catch (e) {
            // ignore
        }
    }
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
