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
// Temporary one-time endpoint to seed an admin if none exists
// Dev-only quick login (local dev only)
router.post('/dev-login', (req, res) => { return require('./auth.controller').devLogin(req, res); });
router.post('/request-reset', auth_controller_1.requestPasswordReset);
router.post('/reset-password', auth_controller_1.resetPassword);
// Protected
router.get('/me', auth_middleware_1.authenticate, auth_controller_1.getMe);
// Admin helpers
router.get('/users', auth_middleware_1.authenticate, rbac_middleware_1.adminOnly, (req, res) => { return require('./auth.controller').listUsers(req, res); });
router.get('/users/export', auth_middleware_1.authenticate, rbac_middleware_1.adminOnly, auth_controller_1.exportUsers);
// Admin only — promote or demote user roles
router.patch('/promote/:userId', auth_middleware_1.authenticate, rbac_middleware_1.adminOnly, auth_controller_1.promoteToAdmin);
router.patch('/demote/:userId', auth_middleware_1.authenticate, rbac_middleware_1.adminOnly, auth_controller_1.demoteFromAdmin);
exports.default = router;
