/**
 * End-to-end access-gating tests for lesson study material (notes + media).
 *
 * These need a real PostgreSQL. CI provides one via the postgres service in
 * ci.yml (and runs `prisma db push` first); locally start it with
 * `docker compose up -d` (then `npx prisma db push`) and run with
 * DATABASE_URL set. Without a DATABASE_URL they skip, so a bare `npm test`
 * still works.
 *
 * The matrix this locks in (mirrors getLesson/getLessonMedia/getLessonNotes):
 *  - no token                          → 401
 *  - paid lesson, enrolled student     → 200
 *  - paid lesson, unenrolled student   → 403
 *  - free lesson, any logged-in user   → 200 (free preview)
 *  - draft lesson, student             → 404
 *  - draft lesson, admin               → 200
 */
import request from 'supertest';
import crypto from 'crypto';
import app from '../../src/app';
import { prisma } from '../../src/config/db';
import { hashPassword } from '../../src/modules/auth/auth.controller';

const hasDb = Boolean(process.env.DATABASE_URL);
const describeDb = hasDb ? describe : describe.skip;

describeDb('E2E — notes and media stay gated for unenrolled students', () => {
  const suffix = crypto.randomUUID().slice(0, 8);
  const adminEmail = `admin-${suffix}@test.local`;
  const enrolledEmail = `enrolled-${suffix}@test.local`;
  const strangerEmail = `stranger-${suffix}@test.local`;
  const password = 'TestPass123!';

  let adminToken = '';
  let enrolledToken = '';
  let strangerToken = '';
  let courseId = '';
  let paidLessonId = '';
  let freeLessonId = '';
  let draftLessonId = '';
  let paidNoteId = '';
  const userIds: string[] = [];
  const mediaAssetIds: string[] = [];

  const login = async (email: string): Promise<string> => {
    const res = await request(app).post('/api/auth/login').send({ email, password });
    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
    return res.body.accessToken as string;
  };

  beforeAll(async () => {
    // ── Seed users: an admin and two students ─────────────────────────────
    const admin = await prisma.user.create({
      data: {
        supabaseId: crypto.randomUUID(),
        email: adminEmail,
        fullName: 'E2E Admin',
        role: 'SUPER_ADMIN',
        passwordHash: hashPassword(password),
      },
    });
    const enrolled = await prisma.user.create({
      data: {
        supabaseId: crypto.randomUUID(),
        email: enrolledEmail,
        fullName: 'Enrolled Student',
        role: 'STUDENT',
        passwordHash: hashPassword(password),
      },
    });
    const stranger = await prisma.user.create({
      data: {
        supabaseId: crypto.randomUUID(),
        email: strangerEmail,
        fullName: 'Stranger Student',
        role: 'STUDENT',
        passwordHash: hashPassword(password),
      },
    });
    userIds.push(admin.id, enrolled.id, stranger.id);

    // ── Seed a paid course with three lessons ─────────────────────────────
    const course = await prisma.course.create({
      data: {
        title: `E2E Gated Course ${suffix}`,
        description: 'Created by the access-gating e2e test.',
        subject: 'MATH',
        status: 'PUBLISHED',
        isFree: false,
        price: 999,
      },
    });
    courseId = course.id;

    const paidLesson = await prisma.lesson.create({
      data: { courseId, title: 'Paid lesson', status: 'PUBLISHED', isFree: false, sortOrder: 0 },
    });
    const freeLesson = await prisma.lesson.create({
      data: { courseId, title: 'Free preview lesson', status: 'PUBLISHED', isFree: true, sortOrder: 1 },
    });
    const draftLesson = await prisma.lesson.create({
      data: { courseId, title: 'Draft lesson', status: 'DRAFT', isFree: true, sortOrder: 2 },
    });
    paidLessonId = paidLesson.id;
    freeLessonId = freeLesson.id;
    draftLessonId = draftLesson.id;

    // ── Seed notes + media on each lesson ─────────────────────────────────
    const paidNote = await prisma.note.create({
      data: { lessonId: paidLessonId, title: 'Paid notes PDF', content: 'top-secret-paid-material' },
    });
    paidNoteId = paidNote.id;
    await prisma.note.create({ data: { lessonId: freeLessonId, title: 'Free notes', content: 'free-material' } });
    await prisma.note.create({ data: { lessonId: draftLessonId, title: 'Draft notes', content: 'draft-material' } });

    const makeYtMedia = async (lessonId: string): Promise<string> => {
      const videoId = crypto.randomUUID().slice(0, 11);
      const asset = await prisma.mediaAsset.create({
        data: { title: `E2E video ${suffix}`, type: 'YOUTUBE_LINK', url: `https://www.youtube.com/watch?v=${videoId}` },
      });
      await prisma.lessonMedia.create({ data: { lessonId, mediaAssetId: asset.id, sortOrder: 0 } });
      return asset.id;
    };
    mediaAssetIds.push(await makeYtMedia(paidLessonId));
    mediaAssetIds.push(await makeYtMedia(freeLessonId));
    mediaAssetIds.push(await makeYtMedia(draftLessonId));

    // ── Enroll only the first student ─────────────────────────────────────
    await prisma.enrollment.create({ data: { userId: enrolled.id, courseId, status: 'ACTIVE' } });

    // ── Log in through the real API to get tokens ─────────────────────────
    adminToken = await login(adminEmail);
    enrolledToken = await login(enrolledEmail);
    strangerToken = await login(strangerEmail);
  }, 30000);

  afterAll(async () => {
    // MediaAsset rows don't cascade from course deletion (the controllers
    // clean them up explicitly), so remove them first, then the course
    // (cascades lessons, notes, enrollments), then the users.
    await prisma.mediaAsset.deleteMany({ where: { id: { in: mediaAssetIds } } }).catch(() => {});
    await prisma.course.delete({ where: { id: courseId } }).catch(() => {});
    await prisma.user.deleteMany({ where: { id: { in: userIds } } }).catch(() => {});
  });

  // ── Unauthenticated ─────────────────────────────────────────────────────
  it('rejects unauthenticated access to lesson notes', async () => {
    const res = await request(app).get(`/api/notes/lesson/${paidLessonId}`);
    expect(res.status).toBe(401);
  });

  it('rejects unauthenticated access to lesson media', async () => {
    const res = await request(app).get(`/api/media/lesson/${paidLessonId}`);
    expect(res.status).toBe(401);
  });

  // ── Paid lesson: enrolled vs stranger ───────────────────────────────────
  it('lets an ENROLLED student read the paid lesson notes', async () => {
    const res = await request(app)
      .get(`/api/notes/lesson/${paidLessonId}`)
      .set('Authorization', `Bearer ${enrolledToken}`);
    expect(res.status).toBe(200);
    expect(res.body.notes.some((n: { id: string }) => n.id === paidNoteId)).toBe(true);
  });

  it('lets an ENROLLED student read the paid lesson media', async () => {
    const res = await request(app)
      .get(`/api/media/lesson/${paidLessonId}`)
      .set('Authorization', `Bearer ${enrolledToken}`);
    expect(res.status).toBe(200);
    expect(res.body.media.some((m: { mediaAsset?: { type?: string } }) => m.mediaAsset?.type === 'YOUTUBE_LINK')).toBe(true);
  });

  it('BLOCKS an unenrolled student from the paid lesson notes (403)', async () => {
    const res = await request(app)
      .get(`/api/notes/lesson/${paidLessonId}`)
      .set('Authorization', `Bearer ${strangerToken}`);
    expect(res.status).toBe(403);
  });

  it('BLOCKS an unenrolled student from the paid lesson media (403)', async () => {
    const res = await request(app)
      .get(`/api/media/lesson/${paidLessonId}`)
      .set('Authorization', `Bearer ${strangerToken}`);
    expect(res.status).toBe(403);
  });

  // ── Free lesson: open to any authenticated student ──────────────────────
  it('lets ANY authenticated student read the free lesson notes', async () => {
    const res = await request(app)
      .get(`/api/notes/lesson/${freeLessonId}`)
      .set('Authorization', `Bearer ${strangerToken}`);
    expect(res.status).toBe(200);
  });

  it('lets ANY authenticated student read the free lesson media', async () => {
    const res = await request(app)
      .get(`/api/media/lesson/${freeLessonId}`)
      .set('Authorization', `Bearer ${strangerToken}`);
    expect(res.status).toBe(200);
  });

  // ── Draft lesson: hidden from students, visible to staff ────────────────
  it('hides DRAFT lesson notes from students (404)', async () => {
    const res = await request(app)
      .get(`/api/notes/lesson/${draftLessonId}`)
      .set('Authorization', `Bearer ${strangerToken}`);
    expect(res.status).toBe(404);
  });

  it('hides DRAFT lesson media from students (404)', async () => {
    const res = await request(app)
      .get(`/api/media/lesson/${draftLessonId}`)
      .set('Authorization', `Bearer ${strangerToken}`);
    expect(res.status).toBe(404);
  });

  it('lets the admin read DRAFT lesson notes', async () => {
    const res = await request(app)
      .get(`/api/notes/lesson/${draftLessonId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
  });

  it('lets the admin read DRAFT lesson media', async () => {
    const res = await request(app)
      .get(`/api/media/lesson/${draftLessonId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
  });
});
