"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listUsers = exports.resetPassword = exports.requestPasswordReset = exports.exportUsers = exports.demoteFromAdmin = exports.promoteToAdmin = exports.getMe = exports.login = exports.register = void 0;
const db_1 = require("../../config/db");
const supabase_1 = require("../../config/supabase");
const zod_1 = require("zod");
const formatZodError_1 = require("../../utils/formatZodError");
const crypto_1 = __importStar(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const registerSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8, 'Password must be at least 8 characters'),
    fullName: zod_1.z.string().min(2).max(100),
    country: zod_1.z.enum(['IN', 'US']).optional(),
});
const resetRequestSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
});
const resetPasswordSchema = zod_1.z.object({
    token: zod_1.z.string(),
    password: zod_1.z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: zod_1.z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});
const localJwtSecret = process.env.LOCAL_JWT_SECRET || 'local-secret';
const useSupabase = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.SUPABASE_JWT_SECRET);
const jwtSecret = useSupabase ? process.env.SUPABASE_JWT_SECRET : localJwtSecret;
const resetJwtSecret = process.env.RESET_JWT_SECRET || jwtSecret;
const hashPassword = (password) => {
    return crypto_1.default.scryptSync(password, 'local-salt', 64).toString('hex');
};
const verifyPassword = (password, hash) => {
    return hashPassword(password) === hash;
};
const register = async (req, res) => {
    const result = registerSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({ error: (0, formatZodError_1.formatZodError)(result.error) });
        return;
    }
    const { email, password, fullName, country } = result.data;
    if (useSupabase && supabase_1.supabase) {
        const { data: authData, error: authError } = await supabase_1.supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
        });
        if (authError) {
            res.status(400).json({ error: authError.message });
            return;
        }
        const user = await db_1.prisma.user.create({
            data: {
                supabaseId: authData.user.id,
                email,
                fullName,
                country: country ?? null,
                role: 'STUDENT',
            },
        });
        res.status(201).json({
            message: 'Registration successful',
            user: { id: user.id, email: user.email, role: user.role },
        });
        return;
    }
    const passwordHash = hashPassword(password);
    const localId = (0, crypto_1.randomUUID)();
    const user = await db_1.prisma.user.create({
        data: {
            supabaseId: localId,
            passwordHash,
            email,
            fullName,
            country: country ?? null,
            role: 'STUDENT',
        },
    });
    res.status(201).json({
        message: 'Registration successful',
        user: { id: user.id, email: user.email, role: user.role },
    });
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    if (useSupabase && supabase_1.supabase) {
        const { data, error } = await supabase_1.supabase.auth.signInWithPassword({ email, password });
        if (error) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }
        const user = await db_1.prisma.user.findUnique({ where: { email } });
        res.json({
            accessToken: data.session?.access_token,
            refreshToken: data.session?.refresh_token,
            user: {
                id: user?.id || '',
                email: data.user?.email || email,
                role: user?.role || 'STUDENT',
            },
        });
        return;
    }
    const user = await db_1.prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash || !verifyPassword(password, user.passwordHash)) {
        res.status(401).json({ error: 'Invalid email or password' });
        return;
    }
    const token = jsonwebtoken_1.default.sign({ sub: user.id, userId: user.id }, jwtSecret, { expiresIn: '7d' });
    res.json({
        accessToken: token,
        refreshToken: null,
        user: { id: user.id, email: user.email, role: user.role },
    });
};
exports.login = login;
const getMe = async (req, res) => {
    const user = await db_1.prisma.user.findUnique({
        where: { id: req.user.id },
        select: { id: true, email: true, fullName: true, role: true, country: true, avatarUrl: true },
    });
    res.json(user);
};
exports.getMe = getMe;
const promoteToAdmin = async (req, res) => {
    const userId = req.params.userId;
    const user = await db_1.prisma.user.update({
        where: { id: userId },
        data: { role: 'ADMIN' },
    });
    res.json({ message: `${user.email} is now an admin` });
};
exports.promoteToAdmin = promoteToAdmin;
const demoteFromAdmin = async (req, res) => {
    const userId = req.params.userId;
    const user = await db_1.prisma.user.update({
        where: { id: userId },
        data: { role: 'STUDENT' },
    });
    res.json({ message: `${user.email} is now a student` });
};
exports.demoteFromAdmin = demoteFromAdmin;
const exportUsers = async (req, res) => {
    const { format } = req.query;
    const users = await db_1.prisma.user.findMany({ select: { id: true, email: true, fullName: true, role: true, country: true, createdAt: true } });
    if (String(format).toLowerCase() === 'csv') {
        const csvRows = [
            'id,email,fullName,role,country,createdAt',
            ...users.map((user) => `${user.id},"${user.email}","${user.fullName}",${user.role},${user.country ?? ''},${user.createdAt.toISOString()}`),
        ];
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="users-export.csv"');
        res.send(csvRows.join('\n'));
        return;
    }
    res.json({ users });
};
exports.exportUsers = exportUsers;
const requestPasswordReset = async (req, res) => {
    const result = resetRequestSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({ error: (0, formatZodError_1.formatZodError)(result.error) });
        return;
    }
    const user = await db_1.prisma.user.findUnique({ where: { email: result.data.email } });
    if (!user) {
        res.json({ message: 'If that account exists, a reset link will be available shortly.' });
        return;
    }
    const token = jsonwebtoken_1.default.sign({ sub: user.id, type: 'password_reset' }, resetJwtSecret, { expiresIn: '1h' });
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${encodeURIComponent(token)}`;
    const responsePayload = {
        message: 'Password reset request received. Use the reset link to continue.',
    };
    if (process.env.NODE_ENV !== 'production') {
        responsePayload.resetUrl = resetUrl;
    }
    res.json(responsePayload);
};
exports.requestPasswordReset = requestPasswordReset;
const resetPassword = async (req, res) => {
    const result = resetPasswordSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({ error: (0, formatZodError_1.formatZodError)(result.error) });
        return;
    }
    const { token, password } = result.data;
    let payload;
    try {
        payload = jsonwebtoken_1.default.verify(token, resetJwtSecret);
    }
    catch (error) {
        res.status(400).json({ error: 'Invalid or expired password reset token' });
        return;
    }
    if (!payload || payload.type !== 'password_reset' || !payload.sub) {
        res.status(400).json({ error: 'Invalid password reset token' });
        return;
    }
    const user = await db_1.prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
    }
    if (useSupabase && supabase_1.supabase) {
        const updateResult = await supabase_1.supabase.auth.admin.updateUserById(user.supabaseId, { password });
        if (updateResult.error) {
            res.status(500).json({ error: 'Failed to update password' });
            return;
        }
        res.json({ message: 'Password has been reset successfully' });
        return;
    }
    const passwordHash = hashPassword(password);
    await db_1.prisma.user.update({ where: { id: user.id }, data: { passwordHash } });
    res.json({ message: 'Password has been reset successfully' });
};
exports.resetPassword = resetPassword;
const listUsers = async (req, res) => {
    const users = await db_1.prisma.user.findMany({ select: { id: true, email: true, fullName: true, role: true, country: true } });
    res.json({ users });
};
exports.listUsers = listUsers;
