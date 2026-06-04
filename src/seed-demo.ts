import { prisma } from './config/db';
import fs from 'fs';
import path from 'path';

const UPLOADS_DIR = path.join(process.cwd(), 'uploads', 'lessons');

function ensureUploadsDir() {
  try { if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true }); } catch { }
}

function writePdf(filename: string, lines: string[]) {
  const content = `%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>endobj\n4 0 obj<</Length ${lines.join('\n').length + 50}>>stream\nBT /F1 18 Tf 50 700 Td(${lines[0]})Tj${lines.slice(1).map(l => `\n0 -30 Td(${l})Tj`).join('')} ET\nendstream\nendobj\n5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj\nxref\n0 6\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000266 00000 n \n0000000388 00000 n \ntrailer<</Size 6/Root 1 0 R>>\nstartxref\n463\n%%EOF`;
  fs.writeFileSync(path.join(UPLOADS_DIR, filename), content, 'ascii');
}

async function ensureTag(name: string) {
  const slug = name.toLowerCase().replace(/\s+/g, '-');
  return prisma.tag.upsert({ where: { slug }, update: {}, create: { name, slug } });
}

export async function ensureDemoData() {
  const existing = await prisma.course.findFirst({ where: { title: 'JEE Physics: Electrostatics Masterclass' } });
  if (existing) return;

  console.log('Seeding demo course...');
  ensureUploadsDir();

  const course = await prisma.course.create({
    data: {
      title: 'JEE Physics: Electrostatics Masterclass',
      description: 'Complete Electrostatics for JEE Main & Advanced. Covers Coulomb Law, Electric Field, Gauss Law, Potential, Capacitors, Dielectrics.',
      subject: 'PHYSICS',
      isFree: true,
      status: 'PUBLISHED',
      sortOrder: 0,
    },
  });

  for (const tagName of ['JEE_MAINS', 'JEE_ADVANCED']) {
    const tag = await ensureTag(tagName);
    await prisma.courseTag.upsert({ where: { courseId_tagId: { courseId: course.id, tagId: tag.id } }, update: {}, create: { courseId: course.id, tagId: tag.id } });
  }

  const l1 = await prisma.lesson.create({
    data: { courseId: course.id, title: 'Electric Charge & Its Properties', content: '# Electric Charge\n\n## Key Properties\n1. Additivity\n2. Quantization: q=±ne\n3. Conservation\n\n## Example\nSpheres +6μC and -2μC are contacted. Each gets 2μC.', sortOrder: 1, isFree: true, status: 'PUBLISHED' },
  });
  const m1 = await prisma.mediaAsset.create({ data: { title: 'Khan Academy - Electric Charge', type: 'YOUTUBE_LINK', url: 'https://youtube.com/watch?v=N27CvWpM-g0' } });
  await prisma.lessonMedia.create({ data: { lessonId: l1.id, mediaAssetId: m1.id, sortOrder: 0 } });
  writePdf('formulas.pdf', ['Formula Sheet', 'F = k·q1·q2 / r²', 'E = k·q / r²', 'Flux = Q_enc / ε₀', 'V = k·q / r', 'C = ε₀·A / d']);
  const mp1 = await prisma.mediaAsset.create({ data: { title: 'Formula Sheet PDF', type: 'PDF', url: '/uploads/lessons/formulas.pdf' } });
  await prisma.lessonMedia.create({ data: { lessonId: l1.id, mediaAssetId: mp1.id, sortOrder: 1 } });
  await prisma.note.create({ data: { lessonId: l1.id, title: 'Quick Revision', content: 'e=1.6e-19 C, Charge invariant, Like repel unlike attract' } });

  const l2 = await prisma.lesson.create({
    data: { courseId: course.id, title: "Coulomb's Law & Electric Field", content: "## Coulomb's Law\nF=k(q1q2)/r^2\n\n## Electric Field\nE=kq/r^2", sortOrder: 2, isFree: true, status: 'PUBLISHED' },
  });
  const m2 = await prisma.mediaAsset.create({ data: { title: 'Coulomb Law Derivation', type: 'YOUTUBE_LINK', url: 'https://youtube.com/watch?v=BrfGsEEEErQ' } });
  await prisma.lessonMedia.create({ data: { lessonId: l2.id, mediaAssetId: m2.id, sortOrder: 0 } });
  await prisma.note.create({ data: { lessonId: l2.id, title: 'Key Points', content: 'k=9e9, Force along joining line' } });

  const l3 = await prisma.lesson.create({
    data: { courseId: course.id, title: "Gauss's Law & Applications", content: '## Gauss Law\nFlux = Q_enc/e0', sortOrder: 3, isFree: true, status: 'PUBLISHED' },
  });
  const m3 = await prisma.mediaAsset.create({ data: { title: 'Gauss Law Visualized', type: 'YOUTUBE_LINK', url: 'https://youtube.com/watch?v=DM0V1H7VYWo' } });
  await prisma.lessonMedia.create({ data: { lessonId: l3.id, mediaAssetId: m3.id, sortOrder: 0 } });

  const l4 = await prisma.lesson.create({
    data: { courseId: course.id, title: 'Electric Potential', content: '## Electric Potential\nV=kq/r\n\n## E = -∇V', sortOrder: 4, isFree: true, status: 'PUBLISHED' },
  });
  const m4 = await prisma.mediaAsset.create({ data: { title: 'JEE Potential Problems', type: 'YOUTUBE_LINK', url: 'https://youtube.com/watch?v=U9F2GbhzJWc' } });
  await prisma.lessonMedia.create({ data: { lessonId: l4.id, mediaAssetId: m4.id, sortOrder: 0 } });

  const l5 = await prisma.lesson.create({
    data: { courseId: course.id, title: 'Capacitors & Dielectrics', content: '## Capacitance\nC=Q/V\n\n## Energy\nU=½CV^2', sortOrder: 5, isFree: false, status: 'PUBLISHED' },
  });
  const m5 = await prisma.mediaAsset.create({ data: { title: 'Capacitor Circuit Analysis', type: 'YOUTUBE_LINK', url: 'https://youtube.com/watch?v=kTOCVbGvRTs' } });
  await prisma.lessonMedia.create({ data: { lessonId: l5.id, mediaAssetId: m5.id, sortOrder: 0 } });
  writePdf('capacitor-problems.pdf', ['Capacitor Problems', '1. Find equiv capacitance', '2. Energy stored', '3. Force between plates', '4. Dielectric insertion', '5. RC circuits']);
  const mp5 = await prisma.mediaAsset.create({ data: { title: 'Capacitor Problems PDF', type: 'PDF', url: '/uploads/lessons/capacitor-problems.pdf' } });
  await prisma.lessonMedia.create({ data: { lessonId: l5.id, mediaAssetId: mp5.id, sortOrder: 1 } });

  console.log('Demo course seeded:', course.id);
}
