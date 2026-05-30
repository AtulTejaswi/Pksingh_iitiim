"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.promoteToAdmin = exports.getMe = exports.login = exports.register = void 0;
const db_1 = require("../../config/db");
const supabase_1 = require("../../config/supabase");
const zod_1 = require("zod");
const registerSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8, 'Password must be at least 8 characters'),
    fullName: zod_1.z.string().min(2).max(100),
    country: zod_1.z.enum(['IN', 'US']).optional(),
});
const register = async (req, res) => {
    const result = registerSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({ error: result.error.flatten() });
        return;
    }
    const { email, password, fullName, country } = result.data;
    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase_1.supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
    });
    if (authError) {
        res.status(400).json({ error: authError.message });
        return;
    }
    // Create user in our database
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
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    // Supabase handles password verification and returns JWT
    const { data, error } = await supabase_1.supabase.auth.signInWithPassword({ email, password });
    if (error) {
        res.status(401).json({ error: 'Invalid email or password' });
        return;
    }
    res.json({
        accessToken: data.session?.access_token,
        refreshToken: data.session?.refresh_token,
        user: { email: data.user?.email },
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
