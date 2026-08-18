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
    // Public route — draft pages (work in progress) must never be readable.
    const pages = await prisma.page.findMany({
      where: { status: 'PUBLISHED' },
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
    // Public route — unpublished blog drafts must never be readable.
    const blogs = await prisma.blog.findMany({
      where: { status: 'PUBLISHED' },
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
  const { name, studentPhoto, rank, achievement, review, status, isVerified, proofUrl } = req.body;

  // A testimonial cannot be marked verified without linked proof.
  if (isVerified && !proofUrl) {
    res.status(400).json({ error: 'isVerified requires a linked proofUrl (scorecard image or video).' });
    return;
  }

  try {
    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        studentPhoto,
        rank,
        achievement,
        review,
        status,
        isVerified: Boolean(isVerified),
        proofUrl: proofUrl ?? null,
        verifiedAt: isVerified ? new Date() : null,
      }
    });
    res.status(201).json(testimonial);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const updateTestimonial = async (req: Request, res: Response): Promise<void> => {
  const id = String(req.params.id);
  const { name, studentPhoto, rank, achievement, review, status, isVerified, proofUrl } = req.body;

  if (isVerified && !proofUrl) {
    res.status(400).json({ error: 'isVerified requires a linked proofUrl (scorecard image or video).' });
    return;
  }

  try {
    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: {
        name,
        studentPhoto,
        rank,
        achievement,
        review,
        status,
        isVerified: isVerified === undefined ? undefined : Boolean(isVerified),
        proofUrl: proofUrl === undefined ? undefined : (proofUrl ?? null),
        verifiedAt: isVerified ? new Date() : isVerified === false ? null : undefined,
      },
    });
    res.json(testimonial);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

/** Public route — only fully verified, published testimonials are ever shown. */
export const getTestimonials = async (req: Request, res: Response): Promise<void> => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { status: 'PUBLISHED', isVerified: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(testimonials);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/** Admin route — full list including pending/unverified for moderation. */
export const getTestimonialsAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(testimonials);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteTestimonial = async (req: Request, res: Response): Promise<void> => {
  const id = String(req.params.id);
  try {
    await prisma.testimonial.delete({ where: { id } });
    res.json({ message: 'Testimonial deleted' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
