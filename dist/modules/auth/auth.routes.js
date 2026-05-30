"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const rbac_middleware_1 = require("../../middleware/rbac.middleware");
const router = (0, express_1.Router)();
// Public
router.post('/register', auth_controller_1.register);
router.post('/login', auth_controller_1.login);
// Protected
router.get('/me', auth_middleware_1.authenticate, auth_controller_1.getMe);
// Admin only — promote a student to admin
router.patch('/promote/:userId', auth_middleware_1.authenticate, rbac_middleware_1.adminOnly, auth_controller_1.promoteToAdmin);
exports.default = router;
