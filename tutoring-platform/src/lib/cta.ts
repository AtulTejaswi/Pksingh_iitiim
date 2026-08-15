// ─────────────────────────────────────────────────────────────────────────
// Standardized CTA copy.
// Every button in the codebase consumes these constants so the verb wording
// and capitalization stay identical across Hero, Free Study Guide, Streaks,
// Pricing cards, and Footer.
//
// NEW verbs:
//   - "Start Free"      (replaces ad-hoc: "Enroll Free", "Sign up free",
//                        "Create Free Account", "Start Learning Free")
//   - "Talk to PK Singh" (replaces: "Join Live Cohort", "Contact to Enroll")
// ─────────────────────────────────────────────────────────────────────────
export const CTA = {
  FREE_SIGNUP: "Start Free",
  PAID_ENROLL: "Talk to PK Singh",
} as const;

export type CTAKey = keyof typeof CTA;
