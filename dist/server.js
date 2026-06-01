"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
const db_1 = require("./config/db");
const crypto_1 = __importDefault(require("crypto"));
const PORT = process.env.PORT || 4000;
const ensureAdminUser = async () => {
    const email = process.env.ADMIN_EMAIL || 'admin@pksingh.com';
    const password = process.env.ADMIN_PASSWORD || 'adminpassword123';
    const existing = await db_1.prisma.user.findUnique({ where: { email } });
    if (existing) {
        console.log('Admin user already exists.');
        return;
    }
    const hashPassword = (password) => {
        return crypto_1.default.scryptSync(password, 'local-salt', 64).toString('hex');
    };
    const user = await db_1.prisma.user.create({
        data: {
            supabaseId: crypto_1.default.randomUUID(),
            email,
            fullName: 'PK Singh Admin',
            role: 'ADMIN',
            passwordHash: hashPassword(password),
        },
    });
    console.log(`Created default admin user: ${user.email} with password: ${password}`);
};
async function startServer() {
    try {
        await db_1.prisma.$connect();
        console.log('Connected to database successfully');
        await ensureAdminUser();
    }
    catch (error) {
        console.error('Warning: Failed to connect to database or seed admin user. Server will run but DB features may fail:', error);
    }
    app_1.default.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
startServer();
