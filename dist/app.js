"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRateLimit = void 0;
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
// Security headers
app.use((0, helmet_1.default)());
// CORS — allow frontend
app.use((0, cors_1.default)({
    origin: [
        process.env.FRONTEND_URL || 'http://localhost:3000',
        'http://127.0.0.1:3000',
        'https://pksingh.netlify.app',
    ],
    credentials: true,
}));
// JSON body limit
app.use(express_1.default.json({ limit: '10mb' }));
// Serve local uploads when running without Supabase storage
app.use('/uploads', express_1.default.static(path_1.default.join(process.cwd(), 'uploads')));
// Global rate limit: 100 requests per 15 minutes per IP
app.use((0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
}));
// Auth-specific stricter rate limit
exports.authRateLimit = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: 'Too many auth attempts, please try again later.' },
});
// Import Routes
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const courses_routes_1 = __importDefault(require("./modules/courses/courses.routes"));
const lessons_routes_1 = __importDefault(require("./modules/lessons/lessons.routes"));
const enrollments_routes_1 = __importDefault(require("./modules/enrollments/enrollments.routes"));
const media_routes_1 = __importDefault(require("./modules/media/media.routes"));
const notes_routes_1 = __importDefault(require("./modules/notes/notes.routes"));
// Mount Routes
app.use('/api/auth', exports.authRateLimit, auth_routes_1.default);
app.use('/api/courses', courses_routes_1.default);
app.use('/api/lessons', lessons_routes_1.default);
app.use('/api/enrollments', enrollments_routes_1.default);
app.use('/api/media', media_routes_1.default);
app.use('/api/notes', notes_routes_1.default);
// 404 handler
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));
// (debug route removed)
exports.default = app;
