"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const courses_controller_1 = require("./courses.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const rbac_middleware_1 = require("../../middleware/rbac.middleware");
const router = (0, express_1.Router)();
// Public routes
router.get('/', courses_controller_1.listCourses);
router.get('/:id', courses_controller_1.getCourse);
// Admin only routes
router.post('/', auth_middleware_1.authenticate, rbac_middleware_1.adminOnly, courses_controller_1.createCourse);
router.put('/:id', auth_middleware_1.authenticate, rbac_middleware_1.adminOnly, courses_controller_1.updateCourse);
router.delete('/:id', auth_middleware_1.authenticate, rbac_middleware_1.adminOnly, courses_controller_1.deleteCourse);
router.patch('/:id/publish', auth_middleware_1.authenticate, rbac_middleware_1.adminOnly, courses_controller_1.togglePublish);
exports.default = router;
