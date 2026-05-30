"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
const db_1 = require("./config/db");
const PORT = process.env.PORT || 4000;
async function startServer() {
    try {
        await db_1.prisma.$connect();
        console.log('Connected to database successfully');
    }
    catch (error) {
        console.error('Warning: Failed to connect to database. Server will run but DB features may fail:', error);
    }
    app_1.default.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
startServer();
