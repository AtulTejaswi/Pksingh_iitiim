// Generates /public/og/*.jpg social-sharing images for the exam mentorship routes.
// Run: node scripts/generate-og-images.mjs
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const OUT_DIR = path.resolve(process.cwd(), 'public/og');

const EXAMS = [
  { slug: 'jee-mentorship', name: 'JEE Mentorship', tag: 'JEE Main + Advanced' },
  { slug: 'neet-mentorship', name: 'NEET Mentorship', tag: 'NEET UG · MBBS' },
  { slug: 'iit-mentorship', name: 'IIT Mentorship', tag: 'Crack JEE Advanced' },
  { slug: 'cat-mentorship', name: 'CAT Mentorship', tag: 'IIM MBA Guidance' },
  { slug: 'gmat-mentorship', name: 'GMAT Mentorship', tag: 'Score 700+' },
  { slug: 'sat-mentorship', name: 'SAT Mentorship', tag: 'Digital SAT · Top Admissions' },
  { slug: 'pricing', name: 'Pricing & Plans', tag: 'Free · Live Cohort · 1:1' },
];

function svgFor(name, tag) {
  // Escape XML-sensitive characters so SVG text renders literally
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  name = esc(name);
  tag = esc(tag);
  return `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#F97316"/>
      <stop offset="100%" stop-color="#C2410C"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.85" cy="0.15" r="0.8">
      <stop offset="0%" stop-color="#FFB268" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#FFB268" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <circle cx="1050" cy="90" r="180" fill="#FFFDFB" opacity="0.08"/>
  <circle cx="120" cy="580" r="140" fill="#FFFDFB" opacity="0.08"/>
  <text x="90" y="210" font-family="Georgia, 'Times New Roman', serif" font-size="44" font-weight="bold" fill="#FFF4E8" letter-spacing="4">PK SINGH MENTORSHIP</text>
  <rect x="90" y="240" width="72" height="6" rx="3" fill="#FFE4C7"/>
  <text x="90" y="380" font-family="Georgia, 'Times New Roman', serif" font-size="92" font-weight="bold" fill="#FFFFFF">${name}</text>
  <text x="90" y="455" font-family="Arial, Helvetica, sans-serif" font-size="38" font-weight="bold" fill="#FFE4C7">${tag}</text>
  <text x="90" y="560" font-family="Arial, Helvetica, sans-serif" font-size="30" fill="#FFFDFB" opacity="0.85">1-on-1 coaching by an IIT + IIM alumnus</text>
</svg>`;
}

await mkdir(OUT_DIR, { recursive: true });

for (const exam of EXAMS) {
  const svg = Buffer.from(svgFor(exam.name, exam.tag));
  const out = path.join(OUT_DIR, `${exam.slug}.jpg`);
  await sharp(svg).jpeg({ quality: 90 }).toFile(out);
  console.log('wrote', out);
}
