"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../config/db");
const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        res.status(401).json({ error: 'No token provided' });
        return;
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.SUPABASE_JWT_SECRET);
        let user = await db_1.prisma.user.findUnique({ where: { supabaseId: decoded.sub } });
        if (!user) {
            res.status(401).json({ error: 'User not found. Please complete registration.' });
            return;
        }
        req.user = {
            id: user.id,
            supabaseId: user.supabaseId,
            role: user.role,
            email: user.email,
        };
        next();
    }
    catch (error) {
        res.status(401).json({ error: 'Invalid or expired token' });
        return;
    }
};
exports.authenticate = authenticate;
