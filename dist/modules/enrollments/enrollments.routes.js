"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const enrollments_controller_1 = require("./enrollments.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const rbac_middleware_1 = require("../../middleware/rbac.middleware");
const router = (0, express_1.Router)();
router.post('/', auth_middleware_1.authenticate, rbac_middleware_1.studentOrAdmin, enrollments_controller_1.enroll);
router.get('/my', auth_middleware_1.authenticate, rbac_middleware_1.studentOrAdmin, enrollments_controller_1.getMyEnrollments);
// Admin
router.get('/', auth_middleware_1.authenticate, rbac_middleware_1.adminOnly, enrollments_controller_1.listAllEnrollments);
router.delete('/:id', auth_middleware_1.authenticate, rbac_middleware_1.adminOnly, enrollments_controller_1.removeEnrollment);
exports.default = router;
