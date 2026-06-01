/**
 * Seeds a sample published Physics course with lessons, YouTube link, and notes.
 * Run: npx ts-node seed_sample_course.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.course.findFirst({
    where: { title: 'JEE Physics — Electrostatics (Sample)' },
  });
  if (existing) {
    console.log('Sample course already exists:', existing.id);
    return;
  }

  const course = await prisma.course.create({
    data: {
      title: 'JEE Physics — Electrostatics (Sample)',
      description:
        'A sample course demonstrating lessons with YouTube videos, instructor notes, and free preview. Use the admin content manager to add PDF uploads.',
      subject: 'PHYSICS',
      examTags: JSON.stringify(['JEE_MAINS', 'JEE_ADVANCED']),
      isFree: true,
      isPublished: true,
      sortOrder: 0,
    },
  });

  const lesson1 = await prisma.lesson.create({
    data: {
      courseId: course.id,
      title: 'Introduction to Electric Charge',
      description: 'Coulomb law and superposition — free preview lesson.',
      content: 'Key ideas:\n- Charge is quantized\n- Like charges repel\n- SI unit: Coulomb (C)',
      sortOrder: 0,
      isFree: true,
      isPublished: true,
    },
  });

  const lesson2 = await prisma.lesson.create({
    data: {
      courseId: course.id,
      title: 'Electric Field and Lines of Force',
      description: 'Field due to point charge and continuous distributions.',
      content: 'Practice problems on E-field symmetry.',
      sortOrder: 1,
      isFree: false,
      isPublished: true,
    },
  });

  await prisma.media.create({
    data: {
      lessonId: lesson1.id,
      title: 'Intro lecture (YouTube)',
      type: 'YOUTUBE_LINK',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    },
  });

  await prisma.note.create({
    data: {
      lessonId: lesson1.id,
      title: 'Formula sheet',
      content: 'F = k q1 q2 / r^2\nE = F / q',
    },
  });

  await prisma.media.create({
    data: {
      lessonId: lesson2.id,
      title: 'Electric field visualization',
      type: 'YOUTUBE_LINK',
      url: 'https://www.youtube.com/watch?v=9vQZT2igXN4',
    },
  });

  console.log('Created sample course:', course.id);
  console.log('  Lessons:', lesson1.id, lesson2.id);
  console.log('Manage at: /admin/courses/' + course.id + '/lessons');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
