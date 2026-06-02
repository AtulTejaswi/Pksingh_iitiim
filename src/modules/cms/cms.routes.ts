import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { mentorOrAdmin } from '../../middleware/rbac.middleware';
import * as cmsController from './cms.controller';

const router = Router();

// ─── PUBLIC ROUTES (For students/visitors) ──────────────────────────────────
router.get('/pages', cmsController.getPages);
router.get('/blogs', cmsController.getBlogs);
router.get('/announcements', cmsController.getAnnouncements);
router.get('/faqs', cmsController.getFaqs);
router.get('/testimonials', cmsController.getTestimonials);

// ─── PROTECTED ROUTES (Mentor/Admin Only) ───────────────────────────────────
router.use(authenticate, mentorOrAdmin);

// Pages & Sections
router.post('/pages', cmsController.createPage);
router.post('/pages/:pageId/sections', cmsController.updatePageSection);
router.put('/pages/:pageId/sections/:sectionId', cmsController.updatePageSection);

// Blogs
router.post('/blogs', cmsController.createBlog);

// Announcements
router.post('/announcements', cmsController.createAnnouncement);

// FAQs
router.post('/faqs', cmsController.createFaq);

// Testimonials
router.post('/testimonials', cmsController.createTestimonial);

export default router;
