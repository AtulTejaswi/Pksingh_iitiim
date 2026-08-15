// ─────────────────────────────────────────────────────────────────────────
// Single source of truth for the site-wide FAQ.
// The visible FaqSection accordion and the FAQPage JSON-LD both consume this
// same array, so structured data never drifts from what users see.
// ─────────────────────────────────────────────────────────────────────────

export interface FaqItem {
  q: string;
  a: string;
}

export const faqs: FaqItem[] = [
  { q: 'What is the refund policy?', a: 'We offer a 7-day full refund window for all Live Cohort and 1:1 Mentorship plans. Self-Paced (Free) plans are not eligible for refunds. Contact support@pksingh.com to initiate a refund.' },
  { q: 'What are the live class timings and timezone?', a: 'Live classes are held in the evening (7:00 PM – 9:00 PM IST) on weekdays, with weekend doubt-solving sessions on Saturday and Sunday mornings. All timings are in Indian Standard Time (IST, UTC+5:30).' },
  { q: 'How quickly are doubts resolved?', a: 'For 1:1 Mentorship students, doubts are resolved within 4 hours via WhatsApp/chat. For Live Cohort students, doubts are addressed in the next live session or within 24 hours via the community forum.' },
  { q: 'What is the batch size?', a: 'Live Cohort batches are capped at 25 students to ensure individual attention. 1:1 Mentorship is strictly one student at a time.' },
  { q: 'Is there a free sample available?', a: 'Yes! Grab the free study guide on our homepage to preview the teaching style. For 1:1 Mentorship, contact us through the support page and the team will set up an intro call.' },
  { q: 'What payment methods are accepted?', a: 'We accept all major credit/debit cards, UPI (Google Pay, PhonePe, Paytm), net banking, and bank transfers. EMI options are available for the 1:1 Mentorship plan.' },
  { q: 'Can I switch plans mid-month?', a: 'Yes, you can upgrade from Live Cohort to 1:1 Mentorship at any time. The prorated amount will be adjusted. Downgrades take effect from the next billing cycle.' },
  { q: 'Do you offer courses for exams other than JEE/NEET?', a: 'Yes. We cover SAT, CAT, GMAT, and CBSE board exams. Check our Courses page for the full catalog. If you don\'t see your exam, contact us.' },
];
