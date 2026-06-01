const { PrismaClient } = require('@prisma/client');
(async () => {
  const prisma = new PrismaClient();
  try {
    const includeDrafts = true;
    const whereClause = {};
    if (!includeDrafts) whereClause.isPublished = true;
    console.log('whereClause:', whereClause);
    const res = await prisma.course.findMany({ where: whereClause });
    console.log('found', res.length);
    console.log(res.map(r => ({ id: r.id, title: r.title, isPublished: r.isPublished, examTags: r.examTags })));
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
})();