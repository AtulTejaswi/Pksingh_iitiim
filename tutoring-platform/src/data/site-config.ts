export const SITE_STATS = {
  learnersMentored: 10000,
  interactiveCourses: 40,
  lessonModules: 500,
  freeResources: 100,
} as const;

export const COHORT_CONFIG = {
  upcomingStartDate: '2026-09-01',
  totalSeats: 50,
  filledSeats: 28,
  cohortLabel: 'Fall 2026',
} as const;

export const REFERRAL_CONFIG = {
  rewardDescription: 'Refer a friend, both get 1 free 1:1 session',
  enabled: true,
} as const;

export const WHATSAPP_CONFIG = {
  communityLink: 'https://chat.whatsapp.com/your-group-link-here',
  enabled: true,
} as const;

export const SOCIAL_LINKS = {
  instagram: 'https://instagram.com/your-handle',
  youtube: 'https://youtube.com/@your-channel',
  linkedin: 'https://linkedin.com/in/your-profile',
  whatsapp: 'https://wa.me/your-number',
} as const;