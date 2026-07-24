export type Locale = 'en' | 'hi';

export const defaultLocale: Locale = 'en';

export const locales: Locale[] = ['en', 'hi'];

export const localeLabels: Record<Locale, string> = {
  en: 'English',
  hi: 'हिन्दी',
};

// Shared translations (stub — only English filled in)
export const translations: Record<string, Record<Locale, string>> = {
  'nav.explore': { en: 'Explore Courses', hi: 'कोर्स देखें' },
  'nav.signup': { en: 'Sign Up', hi: 'साइन अप' },
  'nav.login': { en: 'Log In', hi: 'लॉग इन' },
  'hero.headline': { en: 'Premium mentorship for top rank outcomes', hi: 'टॉप रैंक के लिए प्रीमियम मेंटरशिप' },
  'cta.getStarted': { en: 'Get Started', hi: 'शुरू करें' },
  'cta.watchFree': { en: 'Watch Free Lesson', hi: 'मुफ्त लेसन देखें' },
};