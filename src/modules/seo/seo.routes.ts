import { Router } from 'express';
import { getSitemapData, getStudyGuide, getStructuredData } from './seo.controller';

const router = Router();

// All SEO endpoints are public (no auth required)

// Full sitemap data (courses + lessons with slugs)
router.get('/sitemap-data', getSitemapData);

// Study guide content for a specific slug
router.get('/study/:slug', getStudyGuide);

// JSON-LD structured data for a specific slug
router.get('/structured-data/:slug', getStructuredData);

export default router;
