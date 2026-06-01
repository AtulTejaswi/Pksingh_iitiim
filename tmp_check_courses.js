const { PrismaClient } = require('@prisma/client');
(async () => {
  const prisma = new PrismaClient();
  const courses = await prisma.course.findMany();
  console.log('count', courses.length);
  console.log(courses.map(c => ({ id: c.id, title: c.title, isPublished: c.isPublished, examTags: c.examTags })));
  await prisma.$disconnect();
})().catch(e => { console.error(e); process.exit(1); });