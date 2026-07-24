// Comprehensive Seed Script for Tutoring Platform
// This creates realistic courses for Physics, Chemistry, and Math

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding comprehensive demo data...');

  // Clean up any existing test data
  await prisma.lessonProgress.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.note.deleteMany();
  await prisma.lessonMedia.deleteMany();
  await prisma.mediaAsset.deleteMany();
  await prisma.courseTag.deleteMany();
  await prisma.course.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.user.deleteMany();

  // Create default admin user
  const adminPassword = 'adminpassword123';
  const hashPassword = (password: string): string => {
    return crypto.scryptSync(password, 'local-salt', 64).toString('hex');
  };

  const admin = await prisma.user.create({
    data: {
      supabaseId: 'seed-admin-id',
      email: 'admin@pksingh.com',
      fullName: 'PK Singh Admin',
      role: 'SUPER_ADMIN',
      passwordHash: hashPassword(adminPassword),
    }
  });

  async function ensureTag(name: string) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return prisma.tag.upsert({
      where: { slug },
      update: {},
      create: { name, slug }
    });
  }

  // PHYSICS COURSE
  const physics = await prisma.course.create({
    data: {
      title: 'JEE Physics — Complete Mechanics & Electrostatics',
      description: 'Full JEE Physics preparation with Newtonian mechanics, circular motion, electromagnetism, and advanced problem-solving techniques. Perfect for JEE Main, JEE Advanced, and NEET exams.',
      subject: 'PHYSICS',
      isFree: false,
      status: 'PUBLISHED',
      sortOrder: 0,
    }
  });

  for (const tagName of ['JEE_MAINS', 'JEE_ADVANCED', 'NEET']) {
    const tag = await ensureTag(tagName);
    await prisma.courseTag.create({
      data: { courseId: physics.id, tagId: tag.id }
    });
  }

  // Math 1
  const pl1 = await prisma.lesson.create({
    data: {
      courseId: physics.id,
      title: 'Newton\'s Laws & Friction',
      description: 'Fundamental mechanics: F=ma, free-body diagrams, static/dynamic friction, problem solving',
      content: '## Newton\'s Laws & Friction\n\n1. Newton\'s First Law: Objects resist motion changes\n2. Newton\'s Second Law: F=ma\n3. Newton\'s Third Law: Action-reaction pairs\n4. Friction: Static fₛ ≤ μₛN, Kinetic fₖ = μₖN\n\nPractice problems included.',
      sortOrder: 1,
      isFree: false,
      status: 'PUBLISHED',
    }
  });

  await prisma.mediaAsset.create({
    data: {
      title: 'Khan Academy - Newton\'s Laws',
      type: 'YOUTUBE_LINK',
      url: 'https://www.youtube.com/watch?v=0fExEZJEjtI'
    }
  });

  await prisma.mediaAsset.create({
    data: {
      title: 'Friction Problems PDF',
      type: 'PDF',
      url: '/uploads/lessons/friction-problems.pdf'
    }
  });

  const physicsMedia1 = await prisma.mediaAsset.findFirst({ where: { title: 'Khan Academy - Newton\'s Laws' } });
  const physicsMedia2 = await prisma.mediaAsset.findFirst({ where: { title: 'Friction Problems PDF' } });

  await prisma.lessonMedia.create({
    data: { lessonId: pl1.id, mediaAssetId: physicsMedia1.id, sortOrder: 0 }
  });

  await prisma.lessonMedia.create({
    data: { lessonId: pl1.id, mediaAssetId: physicsMedia2.id, sortOrder: 1 }
  });

  console.log(`Created Physics course with ID: ${physics.id}`);
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());