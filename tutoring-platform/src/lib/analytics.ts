'use client';

/**
 * Analytics utility for tracking user events across the signup → plan → checkout funnel.
 *
 * Supports both GA4 (Google Analytics) and PostHog. Configure via env vars:
 * - NEXT_PUBLIC_GA_ID: Google Analytics 4 measurement ID (e.g. G-XXXXXXXXXX)
 * - NEXT_PUBLIC_POSTHOG_KEY: PostHog project API key
 * - NEXT_PUBLIC_POSTHOG_HOST: PostHog host (defaults to https://app.posthog.com)
 *
 * All tracking is opt-in: if no keys are configured, no events are sent.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

interface AnalyticsEvent {
  name: string;
  properties?: Record<string, string | number | boolean>;
}

// ─── GA4 ─────────────────────────────────────────────────────────────────────

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

function getGaId(): string | null {
  if (typeof window === 'undefined') return null;
  return process.env.NEXT_PUBLIC_GA_ID || null;
}

function trackGa4(event: AnalyticsEvent) {
  const gaId = getGaId();
  if (!gaId || !window.gtag) return;

  window.gtag('event', event.name, {
    ...event.properties,
    send_to: gaId,
  });
}

// ─── PostHog ─────────────────────────────────────────────────────────────────

declare global {
  interface Window {
    posthog?: {
      capture: (event: string, properties?: Record<string, unknown>) => void;
      identify: (distinctId: string, properties?: Record<string, unknown>) => void;
    };
  }
}

function getPosthogKey(): string | null {
  if (typeof window === 'undefined') return null;
  return process.env.NEXT_PUBLIC_POSTHOG_KEY || null;
}

function trackPosthog(event: AnalyticsEvent) {
  const key = getPosthogKey();
  if (!key || !window.posthog) return;

  window.posthog.capture(event.name, event.properties);
}

// ─── Public API ──────────────────────────────────────────────────────────────

/** Track a custom event across all configured analytics providers */
export function trackEvent(name: string, properties?: Record<string, string | number | boolean>) {
  const event = { name, properties };

  // Fire-and-forget — don't block the UI
  try { trackGa4(event); } catch { /* analytics should never break the app */ }
  try { trackPosthog(event); } catch { /* analytics should never break the app */ }
}

/** Identify the current user across analytics providers */
export function identifyUser(userId: string, traits?: Record<string, string | number | boolean>) {
  try {
    if (window.posthog && getPosthogKey()) {
      window.posthog.identify(userId, traits);
    }
  } catch { /* analytics should never break the app */ }
}

// ─── Pre-defined Events (funnel instrumentation) ─────────────────────────────

export const analytics = {
  // Signup funnel
  signupStarted: () => trackEvent('signup_started'),
  signupCompleted: (method: string) => trackEvent('signup_completed', { method }),

  // Plan view
  planViewed: (planName: string) => trackEvent('plan_viewed', { plan_name: planName }),

  // Checkout funnel
  checkoutStarted: (planName: string, amount: number) =>
    trackEvent('checkout_started', { plan_name: planName, amount }),
  checkoutCompleted: (planName: string, amount: number) =>
    trackEvent('checkout_completed', { plan_name: planName, amount }),
  checkoutFailed: (planName: string, error: string) =>
    trackEvent('checkout_failed', { plan_name: planName, error }),
  checkoutDismissed: (planName: string) =>
    trackEvent('checkout_dismissed', { plan_name: planName }),

  // Subscription
  subscriptionCreated: (planName: string) =>
    trackEvent('subscription_created', { plan_name: planName }),
  subscriptionCancelled: (planName: string) =>
    trackEvent('subscription_cancelled', { plan_name: planName }),

  // CTA clicks
  ctaClicked: (ctaName: string, location: string) =>
    trackEvent('cta_clicked', { cta_name: ctaName, location }),

  // Course engagement
  courseEnrolled: (courseId: string, courseName: string, isFree: boolean) =>
    trackEvent('course_enrolled', { course_id: courseId, course_name: courseName, is_free: isFree }),
  lessonStarted: (lessonId: string, courseId: string) =>
    trackEvent('lesson_started', { lesson_id: lessonId, course_id: courseId }),
  lessonCompleted: (lessonId: string, courseId: string) =>
    trackEvent('lesson_completed', { lesson_id: lessonId, course_id: courseId }),

  // Page views (for SPA route changes)
  pageViewed: (path: string, title?: string) =>
    trackEvent('page_viewed', { path, title: title || path }),
} as const;
