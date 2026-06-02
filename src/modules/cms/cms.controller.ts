import { Request, Response } from 'express';
import { prisma } from '../../config/db';

// ─── PAGES & SECTIONS (HOMEPAGE BUILDER) ────────────────────────────────────

export const createPage = async (req: Request, res: Response): Promise<void> => {
  const { title, slug, status, metaTitle, metaDescription, metaKeywords, ogImageUrl } = req.body;
  try {
    const page = await prisma.page.create({
      data: { title, slug, status, metaTitle, metaDescription, metaKeywords, ogImageUrl }
    });
    res.status(201).json(page);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getPages = async (req: Request, res: Response): Promise<void> => {
  try {
    const pages = await prisma.page.findMany({
      include: { sections: { orderBy: { sortOrder: 'asc' } } }
    });
    res.json(pages);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updatePageSection = async (req: Request, res: Response): Promise<void> => {
  const pageId = req.params.pageId as string;
  const sectionId = req.params.sectionId as string;
  const { type, content, sortOrder, isHidden } = req.body;
  try {
    const section = await prisma.pageSection.upsert({
      where: { id: sectionId || '' },
      update: { type, content, sortOrder, isHidden },
      create: { pageId, type, content, sortOrder, isHidden }
    });
    res.json(section);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// ─── BLOGS & SEO ────────────────────────────────────────────────────────────

export const createBlog = async (req: Request, res: Response): Promise<void> => {
  const { title, slug, content, categoryId, status, featuredImage, metaTitle, metaDescription } = req.body;
  const authorId = (req as any).user.id;
  try {
    const blog = await prisma.blog.create({
      data: { title, slug, content, categoryId, status, featuredImage, metaTitle, metaDescription, authorId }
    });
    res.status(201).json(blog);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getBlogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const blogs = await prisma.blog.findMany({
      include: { author: { select: { fullName: true, avatarUrl: true } }, category: true }
    });
    res.json(blogs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ─── ANNOUNCEMENTS ──────────────────────────────────────────────────────────

export const createAnnouncement = async (req: Request, res: Response): Promise<void> => {
  const { title, content, attachmentUrl, status, scheduledFor, expiresAt } = req.body;
  try {
    const announcement = await prisma.announcement.create({
      data: { title, content, attachmentUrl, status, scheduledFor, expiresAt }
    });
    res.status(201).json(announcement);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getAnnouncements = async (req: Request, res: Response): Promise<void> => {
  try {
    const announcements = await prisma.announcement.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { createdAt: 'desc' }
    });
    res.json(announcements);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ─── FAQS ───────────────────────────────────────────────────────────────────

export const createFaq = async (req: Request, res: Response): Promise<void> => {
  const { question, answer, category, sortOrder, isActive } = req.body;
  try {
    const faq = await prisma.fAQ.create({
      data: { question, answer, category, sortOrder, isActive }
    });
    res.status(201).json(faq);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getFaqs = async (req: Request, res: Response): Promise<void> => {
  try {
    const faqs = await prisma.fAQ.findMany({
      where: { isActive: true },
      orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }]
    });
    res.json(faqs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ─── TESTIMONIALS ───────────────────────────────────────────────────────────

export const createTestimonial = async (req: Request, res: Response): Promise<void> => {
  const { name, studentPhoto, rank, achievement, review, status } = req.body;
  try {
    const testimonial = await prisma.testimonial.create({
      data: { name, studentPhoto, rank, achievement, review, status }
    });
    res.status(201).json(testimonial);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getTestimonials = async (req: Request, res: Response): Promise<void> => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { status: 'PUBLISHED' }
    });
    res.json(testimonials);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
