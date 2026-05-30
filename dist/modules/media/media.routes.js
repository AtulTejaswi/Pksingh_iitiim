"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const media_controller_1 = require("./media.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const rbac_middleware_1 = require("../../middleware/rbac.middleware");
const router = (0, express_1.Router)();
// Student
router.get('/lesson/:lessonId', auth_middleware_1.authenticate, rbac_middleware_1.studentOrAdmin, media_controller_1.getLessonMedia);
// Admin
router.post('/upload', auth_middleware_1.authenticate, rbac_middleware_1.adminOnly, media_controller_1.upload.single('file'), media_controller_1.uploadMedia);
router.post('/link', auth_middleware_1.authenticate, rbac_middleware_1.adminOnly, media_controller_1.addLink);
router.delete('/:id', auth_middleware_1.authenticate, rbac_middleware_1.adminOnly, media_controller_1.deleteMedia);
exports.default = router;
