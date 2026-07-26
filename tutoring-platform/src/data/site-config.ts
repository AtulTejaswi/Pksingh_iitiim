// ─────────────────────────────────────────────────────────────────────────────
// EDITABLE CONFIG — All business numbers/copy live here. Edit freely.
// ─────────────────────────────────────────────────────────────────────────────

/** Platform-wide stats displayed in the Stats section and Trust Badges */
export const SITE_STATS = {
  /** Number shown in "Learners Mentored" stat card */
  learnersMentored: 10000,
  /** Number shown in "Interactive Courses" stat card */
  interactiveCourses: 40,
  /** Number shown in "Lesson Modules" stat card */
  lessonModules: 500,
  /** Number shown in "Free Resources" stat card */
  freeResources: 100,
} as const;

/** Upcoming cohort details — drives the CohortBanner component */
export const COHORT_CONFIG = {
  /** ISO date string for cohort start: YYYY-MM-DD */
  upcomingStartDate: '2026-09-01',
  /** Total seats in the cohort */
  totalSeats: 50,
  /** Seats already filled — shown as seatsLeft = totalSeats - filledSeats */
  filledSeats: 28,
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
    cta: 'Start Learning Free',
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
    cta: 'Join Live Cohort',
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
    cta: 'Book a Discovery Call',
    ctaHref: '/signup',
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

/** WhatsApp community button configuration */
export const WHATSAPP_CONFIG = {
  communityLink: 'https://chat.whatsapp.com/join-community',
  enabled: true,
} as const;

/** Social media links — update with actual handles before launch */
export const SOCIAL_LINKS = {
  instagram: 'https://instagram.com/pksinghmentor',
  youtube: 'https://youtube.com/@pksinghmentor',
  linkedin: 'https://linkedin.com/in/pksinghmentor',
  whatsapp: 'https://wa.me/919999999999',
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