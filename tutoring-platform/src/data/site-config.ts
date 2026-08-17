// ─────────────────────────────────────────────────────────────────────────────
// EDITABLE CONFIG — All business numbers/copy live here. Edit freely.
// ─────────────────────────────────────────────────────────────────────────────

import { CTA } from '@/lib/cta';

/**
 * Platform-wide stats shown in the Stats section.
 *
 * These are NOT hardcoded claims. Each value is read from an env override so the
 * owner can publish confirmed numbers. With no env vars set, every value is 0 and
 * the homepage renders honest "coming soon" states instead of fabricated counts.
 * Set e.g. NEXT_PUBLIC_LEARNERS_MENTORED=5000 once the business can verify it.
 */
export const SITE_STATS = {
  /** Number shown in "Learners Mentored" stat card (set via NEXT_PUBLIC_LEARNERS_MENTORED) */
  learnersMentored: Number(process.env.NEXT_PUBLIC_LEARNERS_MENTORED) || 0,
  /** Number shown in "Interactive Courses" stat card (set via NEXT_PUBLIC_INTERACTIVE_COURSES) */
  interactiveCourses: Number(process.env.NEXT_PUBLIC_INTERACTIVE_COURSES) || 0,
  /** Number shown in "Lesson Modules" stat card (set via NEXT_PUBLIC_LESSON_MODULES) */
  lessonModules: Number(process.env.NEXT_PUBLIC_LESSON_MODULES) || 0,
  /** Number shown in "Free Resources" stat card (set via NEXT_PUBLIC_FREE_RESOURCES) */
  freeResources: Number(process.env.NEXT_PUBLIC_FREE_RESOURCES) || 0,
} as const;

/**
 * Upcoming cohort details — drives the CohortBanner component.
 * Seat counts come from env overrides so no fabricated number is shown by default.
 * When seats are not configured, the banner shows a generic limited-cohort message.
 */
export const COHORT_CONFIG = {
  /** ISO date string for cohort start: YYYY-MM-DD */
  upcomingStartDate: '2026-09-01',
  /** Total seats in the cohort (set via NEXT_PUBLIC_COHORT_TOTAL_SEATS) */
  totalSeats: Number(process.env.NEXT_PUBLIC_COHORT_TOTAL_SEATS) || 0,
  /** Seats already filled (set via NEXT_PUBLIC_COHORT_FILLED_SEATS) */
  filledSeats: Number(process.env.NEXT_PUBLIC_COHORT_FILLED_SEATS) || 0,
  /** Display label for the cohort (e.g. "Fall 2026") */
  cohortLabel: 'Fall 2026',
} as const;

/** Pricing tiers — drives the PricingSection component */
export const PRICING_CONFIG = {
  selfPaced: {
    name: 'Self-Paced',
    price: 'Free',
    priceSuffix: '',
    currency: '',
    cta: CTA.FREE_SIGNUP,
    ctaHref: '/signup',
    features: [
      'Access to recorded lecture library',
      'Downloadable study notes & formulas',
      'Community discussion forum',
      'Basic progress tracking',
      'Email support',
    ],
  },
  liveCohort: {
    name: 'Live Cohort',
    price: '₹2,999',
    priceSuffix: '/mo',
    currency: 'INR',
    cta: CTA.PAID_ENROLL,
    ctaHref: '/signup',
    badge: 'Most Popular',
    features: [
      'Everything in Self-Paced',
      'Live interactive classes with PK Singh',
      'Weekly doubt-solving sessions',
      'Chapter-wise mock tests with analysis',
      'Recorded backup of all live sessions',
      'Priority doubt support',
    ],
  },
  oneOnOne: {
    name: '1:1 Mentorship',
    price: '₹9,999',
    priceSuffix: '/mo',
    currency: 'INR',
    cta: CTA.PAID_ENROLL,
    ctaHref: '/support',
    features: [
      'Everything in Live Cohort',
      'Personal 1:1 sessions with PK Singh',
      'Custom study plan & timeline',
      'Mock test review with detailed feedback',
      'Direct WhatsApp/call access',
      'Guaranteed doubt resolution within 4 hours',
    ],
  },
} as const;

/** Referral program configuration */
export const REFERRAL_CONFIG = {
  rewardDescription: 'Refer a friend, both get 1 free 1:1 session',
  enabled: true,
} as const;

/**
 * WhatsApp community button configuration.
 *
 * IMPORTANT (owner action): confirm `communityLink` is a real, active invite.
 * For Phase 3, per-exam-track segmentation was considered: the owner should
 * decide between (a) keeping one general community link, or (b) providing one
 * invite per track (JEE / NEET / SAT / CAT-GMAT) or a Discord/Telegram server.
 * Until real per-track invites are provided, a single link is shown — we do NOT
 * fabricate track-specific invite URLs.
 */
export const WHATSAPP_CONFIG = {
  communityLink: 'https://chat.whatsapp.com/EyfnanzGYgK2EUycPqsrMH',
  enabled: true,
} as const;

/**
 * Direct WhatsApp chat number (for the wa.me/ link). Set via
 * NEXT_PUBLIC_WHATSAPP_NUMBER (e.g. "9198xxxxxxxx"). Leave empty to hide the
 * direct-chat link — the community invite link is always the safe fallback.
 * No placeholder numbers are hardcoded.
 */
export const WHATSAPP_DIRECT_NUMBER =
  (typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_WHATSAPP_NUMBER : '') || '';

/**
 * Social media links. YouTube and Instagram are the verified, active profiles;
 * they render directly. LinkedIn remains env-driven and hidden unless
 * NEXT_PUBLIC_LINKEDIN_URL is set to a real, active profile URL, so no fake
 * links are shown.
 */
export const SOCIAL_LINKS = {
  youtube: 'https://www.youtube.com/@PKSir_IITIIM',
  instagram:
    'https://www.instagram.com/pksirclass?igsh=MWg2ejJibHZpaWdndQ==&igsi=MWg2ejJibHZpaWdndQ==',
  linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || '',
  whatsapp: WHATSAPP_DIRECT_NUMBER
    ? `https://wa.me/${WHATSAPP_DIRECT_NUMBER}`
    : WHATSAPP_CONFIG.communityLink,
} as const;

/** Email-to-open-in-Gmail compose links for queries */
export const GMAIL_CONFIG = {
  /** Opens Gmail's compose view with the recipient prefilled (works on desktop + mobile browsers). */
  composeUrl: 'https://mail.google.com/mail/?view=cm&fs=1&to=pksirpcmclasses@gmail.com',
  /** Fallback email link for devices where the mailto: scheme works. */
  mailtoUrl: 'mailto:pksirpcmclasses@gmail.com',
} as const;

/** Contact & support */
export const CONTACT_CONFIG = {
  email: 'support@pksingh.com',
  /** Doubt resolution SLA for 1:1 students */
  doubtSlaSLA: '4 hours',
  /** Live class timezone */
  timezone: 'IST (UTC+5:30)',
  /** Live class timing */
  classTimings: '7:00 PM – 9:00 PM IST (weekdays)',
} as const;