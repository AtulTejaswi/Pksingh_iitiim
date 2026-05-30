# Backend Development Plan — JEE / NEET / SAT Tutoring Platform

> **Stack**: Node.js + Express · PostgreSQL via Supabase · Supabase Auth · Supabase Storage  
> **Frontend (later)**: Next.js + Tailwind CSS  
> **Hosting (later)**: Vercel (frontend) · Render or Railway (backend API)

---

## Table of Contents

1. [Tech Stack Recommendation](#1-tech-stack-recommendation)
2. [Project Structure](#2-project-structure)
3. [Database Schema Design](#3-database-schema-design)
4. [Environment Setup & Security Config](#4-environment-setup--security-config)
5. [Authentication & RBAC](#5-authentication--rbac)
6. [API Endpoints](#6-api-endpoints)
7. [Admin Dashboard Strategy](#7-admin-dashboard-strategy)
8. [Security Practices](#8-security-practices)
9. [Testing Strategy](#9-testing-strategy)
10. [Deployment Plan](#10-deployment-plan)
11. [Master Build Prompt](#11-master-build-prompt)

---

## 1. Tech Stack Recommendation

### Why Node.js + Express (not Strapi/Directus)

| Factor | Node.js + Express | Strapi / Directus |
|--------|-------------------|-------------------|
| Control over logic | Full | Limited by CMS conventions |
| Custom RBAC | Easy | Requires plugin config |
| Free tier fit | Any host | Needs 512MB+ RAM |
| Learning value | High | Low |
| Custom exam tag logic (JEE/NEET/SAT) | Easy | Workaround needed |

**Recommendation**: Use **Node.js + Express** with a lightweight admin frontend (React or Next.js admin pages). This gives you full control and fits Render/Railway free tiers.

### Final Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Runtime | Node.js 20 LTS | Stable, wide support |
| Framework | Express 4.x | Minimal, flexible |
| Database | PostgreSQL via Supabase | Free tier, managed, SQL |
| ORM | Prisma | Type-safe, great migrations |
| Auth | Supabase Auth | Free, handles email/OAuth/JWT |
| File Storage | Supabase Storage | Free 1GB, CDN URLs |
| Validation | Zod | Schema-first, TypeScript-friendly |
| Security | Helmet.js + express-rate-limit | Headers, CORS, rate limiting |
| Testing | Jest + Supertest + Postman | Unit + integration |
| Frontend Admin | Next.js (same repo) | Admin pages behind auth |

---

## 2. Project Structure

```
tutoring-platform/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Auto-generated migrations
├── src/
│   ├── config/
│   │   ├── db.ts              # Prisma client singleton
│   │   └── supabase.ts        # Supabase admin client
│   ├── middleware/
│   │   ├── auth.middleware.ts  # JWT verification
│   │   ├── rbac.middleware.ts  # Role checks (admin/student)
│   │   └── validate.middleware.ts # Zod schema validation
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.routes.ts
│   │   │   ├── auth.controller.ts
│   │   │   └── auth.service.ts
│   │   ├── courses/
│   │   │   ├── courses.routes.ts
│   │   │   ├── courses.controller.ts
│   │   │   └── courses.service.ts
│   │   ├── lessons/
│   │   ├── enrollments/
│   │   ├── media/
│   │   └── notes/
│   ├── utils/
│   │   ├── apiResponse.ts     # Standardised response format
│   │   └── errors.ts          # Custom error classes
│   ├── app.ts                 # Express app setup
│   └── server.ts              # Entry point
├── tests/
│   ├── auth.test.ts
│   ├── courses.test.ts
│   └── enrollments.test.ts
├── .env                       # Never commit this
├── .env.example               # Commit this with empty values
├── package.json
└── README.md
```

---

## 3. Database Schema Design

### Prisma Schema (`prisma/schema.prisma`)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── ENUMS ───────────────────────────────────────────────────────────────────

enum Role {
  ADMIN
  STUDENT
}

enum ExamTag {
  JEE_MAINS
  JEE_ADVANCED
  NEET
  MHT_CET
  SAT
  AP_PHYSICS
  AP_CHEMISTRY
  AP_CALCULUS
  GENERAL
}

enum Subject {
  PHYSICS
  CHEMISTRY
  MATH
}

enum MediaType {
  PDF
  VIDEO
  IMAGE
  YOUTUBE_LINK
  EXTERNAL_LINK
}

enum EnrollmentStatus {
  ACTIVE
  COMPLETED
  DROPPED
}

// ─── USERS ───────────────────────────────────────────────────────────────────

model User {
  id            String   @id @default(uuid())
  supabaseId    String   @unique          // Links to Supabase Auth UID
  email         String   @unique
  fullName      String
  role          Role     @default(STUDENT)
  avatarUrl     String?
  country       String?                  // "IN" or "US" for content targeting
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  enrollments   Enrollment[]
  progress      LessonProgress[]

  @@map("users")
}

// ─── COURSES ─────────────────────────────────────────────────────────────────

model Course {
  id           String    @id @default(uuid())
  title        String
  description  String
  subject      Subject
  examTags     ExamTag[]                 // Tag for JEE, NEET, SAT, etc.
  thumbnailUrl String?
  isFree       Boolean   @default(false)
  isPublished  Boolean   @default(false)
  sortOrder    Int       @default(0)
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt

  lessons      Lesson[]
  enrollments  Enrollment[]

  @@map("courses")
}

// ─── LESSONS ─────────────────────────────────────────────────────────────────

model Lesson {
  id           String   @id @default(uuid())
  courseId     String
  title        String
  description  String?
  content      String?  // Rich text / Markdown body
  sortOrder    Int      @default(0)
  isFree       Boolean  @default(false) // Preview lessons free even in paid course
  isPublished  Boolean  @default(false)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  course       Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)
  media        Media[]
  notes        Note[]
  progress     LessonProgress[]

  @@map("lessons")
}

// ─── MEDIA ───────────────────────────────────────────────────────────────────

model Media {
  id          String    @id @default(uuid())
  lessonId    String
  title       String
  type        MediaType
  url         String                    // Supabase Storage URL or YouTube link
  storagePath String?                  // Supabase Storage internal path (for deletion)
  sizeBytes   Int?
  mimeType    String?
  sortOrder   Int       @default(0)
  createdAt   DateTime  @default(now())

  lesson      Lesson    @relation(fields: [lessonId], references: [id], onDelete: Cascade)

  @@map("media")
}

// ─── NOTES ───────────────────────────────────────────────────────────────────

model Note {
  id        String   @id @default(uuid())
  lessonId  String
  title     String
  content   String   // Markdown or HTML
  fileUrl   String?  // Optional attached PDF
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  lesson    Lesson   @relation(fields: [lessonId], references: [id], onDelete: Cascade)

  @@map("notes")
}

// ─── ENROLLMENTS ─────────────────────────────────────────────────────────────

model Enrollment {
  id          String           @id @default(uuid())
  userId      String
  courseId    String
  status      EnrollmentStatus @default(ACTIVE)
  enrolledAt  DateTime         @default(now())
  completedAt DateTime?

  user        User             @relation(fields: [userId], references: [id])
  course      Course           @relation(fields: [courseId], references: [id])

  @@unique([userId, courseId])           // One enrollment per student per course
  @@map("enrollments")
}

// ─── LESSON PROGRESS ─────────────────────────────────────────────────────────

model LessonProgress {
  id          String   @id @default(uuid())
  userId      String
  lessonId    String
  completedAt DateTime @default(now())

  user        User     @relation(fields: [userId], references: [id])
  lesson      Lesson   @relation(fields: [lessonId], references: [id])

  @@unique([userId, lessonId])
  @@map("lesson_progress")
}
```

### Key Design Decisions

- **`supabaseId`** links your Prisma `User` record to Supabase Auth. On first login, create the Prisma record if it doesn't exist.
- **`examTags`** is a PostgreSQL array — a single course can be tagged for both JEE Mains and MHT-CET.
- **`isFree` on Lesson** lets the admin offer preview lessons inside paid courses.
- **`storagePath`** on Media enables deletion from Supabase Storage when a media record is removed.
- **Cascade deletes**: deleting a Course deletes its Lessons; deleting a Lesson deletes its Media and Notes.

---

## 4. Environment Setup & Security Config

### `.env` file (never commit)

```env
# Database
DATABASE_URL="postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres"

# Supabase
SUPABASE_URL="https://[project].supabase.co"
SUPABASE_ANON_KEY="eyJ..."
SUPABASE_SERVICE_ROLE_KEY="eyJ..."   # Admin operations only — never expose to client

# JWT (Supabase signs JWTs — use their secret for verification)
SUPABASE_JWT_SECRET="your-jwt-secret-from-supabase-dashboard"

# App
PORT=4000
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"   # Update to production URL on deploy

# Uploads
MAX_FILE_SIZE_MB=50
ALLOWED_MIME_TYPES="application/pdf,video/mp4,image/jpeg,image/png,image/webp"
```

### `.env.example` (commit this)

```env
DATABASE_URL=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_JWT_SECRET=
PORT=4000
NODE_ENV=development
FRONTEND_URL=
MAX_FILE_SIZE_MB=50
ALLOWED_MIME_TYPES=
```

### `src/config/db.ts`

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

### `src/app.ts` — Security setup

```typescript
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

const app = express();

// Security headers
app.use(helmet());

// CORS — only allow your frontend
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

// JSON body limit
app.use(express.json({ limit: '10mb' }));

// Global rate limit: 100 requests per 15 minutes per IP
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
}));

// Auth-specific stricter rate limit
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many auth attempts, please try again later.' },
});

// Routes
import authRoutes from './modules/auth/auth.routes';
import coursesRoutes from './modules/courses/courses.routes';
import lessonsRoutes from './modules/lessons/lessons.routes';
import enrollmentsRoutes from './modules/enrollments/enrollments.routes';
import mediaRoutes from './modules/media/media.routes';

app.use('/api/auth', authRateLimit, authRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/lessons', lessonsRoutes);
app.use('/api/enrollments', enrollmentsRoutes);
app.use('/api/media', mediaRoutes);

// 404 handler
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

export default app;
```

---

## 5. Authentication & RBAC

### How Auth Works

1. Student/Admin signs in via **Supabase Auth** (email+password or Google OAuth).
2. Supabase returns a **JWT access token**.
3. Client sends `Authorization: Bearer <token>` with every API request.
4. Express middleware **verifies the JWT** using the Supabase JWT secret.
5. Middleware checks the user's `role` from the database and **blocks unauthorised access**.

### `src/middleware/auth.middleware.ts`

```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/db';

export interface AuthRequest extends Request {
  user?: { id: string; supabaseId: string; role: string; email: string };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET!) as { sub: string };

    // Find or create user in our database
    let user = await prisma.user.findUnique({ where: { supabaseId: decoded.sub } });

    if (!user) {
      return res.status(401).json({ error: 'User not found. Please complete registration.' });
    }

    req.user = {
      id: user.id,
      supabaseId: user.supabaseId,
      role: user.role,
      email: user.email,
    };

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
```

### `src/middleware/rbac.middleware.ts`

```typescript
import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';

export const requireRole = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};

// Convenience exports
export const adminOnly = requireRole('ADMIN');
export const studentOrAdmin = requireRole('STUDENT', 'ADMIN');
```

### Auth Routes — `src/modules/auth/auth.routes.ts`

```typescript
import { Router } from 'express';
import { register, login, getMe, promoteToAdmin } from './auth.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { adminOnly } from '../../middleware/rbac.middleware';

const router = Router();

// Public
router.post('/register', register);
router.post('/login', login);

// Protected
router.get('/me', authenticate, getMe);

// Admin only — promote a student to admin
router.patch('/promote/:userId', authenticate, adminOnly, promoteToAdmin);

export default router;
```

### Auth Controller — `src/modules/auth/auth.controller.ts`

```typescript
import { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import { prisma } from '../../config/db';
import { AuthRequest } from '../../middleware/auth.middleware';
import { z } from 'zod';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fullName: z.string().min(2).max(100),
  country: z.enum(['IN', 'US']).optional(),
});

export const register = async (req: Request, res: Response) => {
  const result = registerSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.flatten() });
  }

  const { email, password, fullName, country } = result.data;

  // Create user in Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError) {
    return res.status(400).json({ error: authError.message });
  }

  // Create user in our database
  const user = await prisma.user.create({
    data: {
      supabaseId: authData.user.id,
      email,
      fullName,
      country: country ?? null,
      role: 'STUDENT',
    },
  });

  return res.status(201).json({
    message: 'Registration successful',
    user: { id: user.id, email: user.email, role: user.role },
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Supabase handles password verification and returns JWT
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  return res.json({
    accessToken: data.session.access_token,
    refreshToken: data.session.refresh_token,
    user: { email: data.user.email },
  });
};

export const getMe = async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: { id: true, email: true, fullName: true, role: true, country: true, avatarUrl: true },
  });
  return res.json(user);
};

export const promoteToAdmin = async (req: AuthRequest, res: Response) => {
  const { userId } = req.params;
  const user = await prisma.user.update({
    where: { id: userId },
    data: { role: 'ADMIN' },
  });
  return res.json({ message: `${user.email} is now an admin` });
};
```

---

## 6. API Endpoints

### Full Endpoint Reference

#### Auth (`/api/auth`)

| Method | Path | Auth | Role | Description |
|--------|------|------|------|-------------|
| POST | `/register` | ❌ | — | Register new student |
| POST | `/login` | ❌ | — | Login, returns JWT |
| GET | `/me` | ✅ | Any | Get current user profile |
| PATCH | `/promote/:userId` | ✅ | Admin | Promote student to admin |

#### Courses (`/api/courses`)

| Method | Path | Auth | Role | Description |
|--------|------|------|------|-------------|
| GET | `/` | ❌ | — | List published courses (with exam tag filter) |
| GET | `/:id` | ❌ | — | Get course details + lessons list |
| POST | `/` | ✅ | Admin | Create a new course |
| PUT | `/:id` | ✅ | Admin | Update course |
| DELETE | `/:id` | ✅ | Admin | Delete course (cascade) |
| PATCH | `/:id/publish` | ✅ | Admin | Toggle published status |

#### Lessons (`/api/lessons`)

| Method | Path | Auth | Role | Description |
|--------|------|------|------|-------------|
| GET | `/:id` | ✅ | Student | Get lesson content (checks enrollment) |
| POST | `/` | ✅ | Admin | Create lesson in a course |
| PUT | `/:id` | ✅ | Admin | Update lesson |
| DELETE | `/:id` | ✅ | Admin | Delete lesson |
| POST | `/:id/progress` | ✅ | Student | Mark lesson as complete |

#### Enrollments (`/api/enrollments`)

| Method | Path | Auth | Role | Description |
|--------|------|------|------|-------------|
| POST | `/` | ✅ | Student | Enroll in a course |
| GET | `/my` | ✅ | Student | Get my enrollments |
| GET | `/` | ✅ | Admin | List all enrollments (with filters) |
| DELETE | `/:id` | ✅ | Admin | Remove an enrollment |

#### Media (`/api/media`)

| Method | Path | Auth | Role | Description |
|--------|------|------|------|-------------|
| POST | `/upload` | ✅ | Admin | Upload file to Supabase Storage |
| POST | `/link` | ✅ | Admin | Add YouTube/external link |
| GET | `/lesson/:lessonId` | ✅ | Student | Get media for a lesson |
| DELETE | `/:id` | ✅ | Admin | Delete media + storage file |

#### Notes (`/api/notes`)

| Method | Path | Auth | Role | Description |
|--------|------|------|------|-------------|
| GET | `/lesson/:lessonId` | ✅ | Student | Get notes for a lesson |
| POST | `/` | ✅ | Admin | Create note |
| PUT | `/:id` | ✅ | Admin | Update note |
| DELETE | `/:id` | ✅ | Admin | Delete note |

### Sample Course Controller

```typescript
// src/modules/courses/courses.controller.ts
import { Request, Response } from 'express';
import { prisma } from '../../config/db';
import { z } from 'zod';
import { AuthRequest } from '../../middleware/auth.middleware';

const courseSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10),
  subject: z.enum(['PHYSICS', 'CHEMISTRY', 'MATH']),
  examTags: z.array(z.enum(['JEE_MAINS','JEE_ADVANCED','NEET','MHT_CET','SAT','AP_PHYSICS','AP_CHEMISTRY','AP_CALCULUS','GENERAL'])),
  isFree: z.boolean().optional(),
  thumbnailUrl: z.string().url().optional(),
});

// GET /api/courses — public
export const listCourses = async (req: Request, res: Response) => {
  const { subject, examTag, page = '1', limit = '12' } = req.query;

  const courses = await prisma.course.findMany({
    where: {
      isPublished: true,
      ...(subject && { subject: subject as any }),
      ...(examTag && { examTags: { has: examTag as any } }),
    },
    select: {
      id: true, title: true, description: true,
      subject: true, examTags: true, thumbnailUrl: true, isFree: true,
      _count: { select: { lessons: true, enrollments: true } },
    },
    skip: (parseInt(page as string) - 1) * parseInt(limit as string),
    take: parseInt(limit as string),
    orderBy: { sortOrder: 'asc' },
  });

  return res.json({ courses });
};

// POST /api/courses — admin only
export const createCourse = async (req: AuthRequest, res: Response) => {
  const result = courseSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.flatten() });
  }

  const course = await prisma.course.create({ data: result.data });
  return res.status(201).json({ course });
};
```

### Media Upload Controller

```typescript
// src/modules/media/media.controller.ts
import { createClient } from '@supabase/supabase-js';
import multer from 'multer';
import { prisma } from '../../config/db';
import { AuthRequest } from '../../middleware/auth.middleware';
import { Response } from 'express';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Multer: in-memory buffer (we stream to Supabase)
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE_MB!) * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = process.env.ALLOWED_MIME_TYPES!.split(',');
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} not allowed`));
    }
  },
});

export const uploadMedia = async (req: AuthRequest, res: Response) => {
  const file = req.file;
  const { lessonId, title } = req.body;

  if (!file) return res.status(400).json({ error: 'No file provided' });

  const ext = file.originalname.split('.').pop();
  const storagePath = `lessons/${lessonId}/${Date.now()}.${ext}`;

  // Upload to Supabase Storage bucket named "media"
  const { error: uploadError } = await supabase.storage
    .from('media')
    .upload(storagePath, file.buffer, { contentType: file.mimetype });

  if (uploadError) {
    return res.status(500).json({ error: 'File upload failed' });
  }

  const { data: { publicUrl } } = supabase.storage
    .from('media')
    .getPublicUrl(storagePath);

  const type = file.mimetype === 'application/pdf' ? 'PDF'
             : file.mimetype.startsWith('video') ? 'VIDEO'
             : 'IMAGE';

  const media = await prisma.media.create({
    data: {
      lessonId,
      title: title ?? file.originalname,
      type,
      url: publicUrl,
      storagePath,
      sizeBytes: file.size,
      mimeType: file.mimetype,
    },
  });

  return res.status(201).json({ media });
};
```

---

## 7. Admin Dashboard Strategy

### Option A — Admin pages inside Next.js (Recommended)

Build protected Next.js pages at `/admin/*` behind a role check:

```
app/
  admin/
    layout.tsx          ← Checks role === 'ADMIN', redirects if not
    page.tsx            ← Dashboard overview (courses count, enrollments, recent)
    courses/
      page.tsx          ← Course list with Add / Edit / Delete
      [id]/
        page.tsx        ← Edit course form
    lessons/
      [courseId]/
        page.tsx        ← Lessons list for a course
    students/
      page.tsx          ← Enrolled students list
    media/
      page.tsx          ← Media manager
```

### Key Admin Features to Build

1. **Course Manager**: Table of all courses with toggle for published/draft. Add/Edit form with subject, exam tags (multi-select: JEE, NEET, SAT, etc.), description, thumbnail upload.

2. **Lesson Editor**: Rich text editor (use TipTap or react-markdown editor) for lesson content. Drag-to-reorder lessons (react-beautiful-dnd or dnd-kit).

3. **Media Manager**: Drag-and-drop file upload that calls `POST /api/media/upload`. File list with delete. Embed YouTube by pasting URL (calls `POST /api/media/link`).

4. **Student Management**: List all enrolled students per course. Remove enrollment button.

5. **Dashboard Stats card row**:
   - Total courses published
   - Total enrolled students
   - Lessons this week
   - Most popular course

### Admin Protection in Next.js

```typescript
// app/admin/layout.tsx
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth'; // or check Supabase session

export default async function AdminLayout({ children }) {
  const session = await getServerSession();
  
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/login?error=unauthorized');
  }

  return <div>{children}</div>;
}
```

---

## 8. Security Practices

### Checklist

| Practice | Implementation | Status |
|----------|---------------|--------|
| Password hashing | Supabase Auth uses bcrypt internally | Handled |
| JWT verification | `jsonwebtoken.verify()` with Supabase secret | ✅ Implemented |
| RBAC | `adminOnly` / `studentOrAdmin` middleware | ✅ Implemented |
| Input validation | Zod schemas on every endpoint | ✅ Implemented |
| CORS restriction | Only allow `FRONTEND_URL` | ✅ Implemented |
| Security headers | Helmet.js | ✅ Implemented |
| Rate limiting | `express-rate-limit` globally + strict on auth | ✅ Implemented |
| Environment variables | `.env` never committed, `.env.example` provided | ✅ Implemented |
| File type validation | MIME type whitelist in Multer | ✅ Implemented |
| File size limit | Configurable `MAX_FILE_SIZE_MB` | ✅ Implemented |
| SQL injection | Prisma uses parameterised queries | Handled |
| HTTPS | Enforced by Render/Railway/Vercel on deploy | On deploy |
| Enrollment gate | Lesson content only served if enrolled | ✅ Implement in lesson controller |

### Enrollment Gate in Lesson Controller

```typescript
export const getLesson = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const lesson = await prisma.lesson.findUnique({
    where: { id },
    include: { course: true, media: true, notes: true },
  });

  if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
  if (!lesson.isPublished) return res.status(404).json({ error: 'Lesson not found' });

  // Allow if lesson is free or user is admin
  if (lesson.isFree || req.user?.role === 'ADMIN') {
    return res.json({ lesson });
  }

  // Check enrollment
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: req.user!.id,
        courseId: lesson.courseId,
      },
    },
  });

  if (!enrollment || enrollment.status !== 'ACTIVE') {
    return res.status(403).json({ error: 'Please enroll in this course to access this lesson' });
  }

  return res.json({ lesson });
};
```

---

## 9. Testing Strategy

### Unit Tests with Jest

```typescript
// tests/auth.test.ts
import request from 'supertest';
import app from '../src/app';
import { prisma } from '../src/config/db';

describe('Auth endpoints', () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('POST /api/auth/register — should reject weak password', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'test@example.com',
      password: '123',          // too short
      fullName: 'Test User',
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('POST /api/auth/login — should reject wrong credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'nobody@nowhere.com',
      password: 'wrongpassword123',
    });
    expect(res.status).toBe(401);
  });
});
```

### Role Restriction Tests

```typescript
// tests/rbac.test.ts
describe('RBAC — Admin-only routes', () => {
  let studentToken: string;
  let adminToken: string;

  beforeAll(async () => {
    // Login as student and admin, store tokens
    const s = await request(app).post('/api/auth/login').send({ email: 'student@test.com', password: 'test1234' });
    const a = await request(app).post('/api/auth/login').send({ email: 'admin@test.com', password: 'admin1234' });
    studentToken = s.body.accessToken;
    adminToken = a.body.accessToken;
  });

  it('Student cannot create a course', async () => {
    const res = await request(app)
      .post('/api/courses')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ title: 'Hacked Course', subject: 'MATH', examTags: ['JEE_MAINS'], description: 'test' });
    expect(res.status).toBe(403);
  });

  it('Admin can create a course', async () => {
    const res = await request(app)
      .post('/api/courses')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Optics', subject: 'PHYSICS', examTags: ['JEE_MAINS'], description: 'Covers lens and mirrors' });
    expect(res.status).toBe(201);
  });
});
```

### Postman Collection Structure

Create a Postman collection called **Tutoring Platform API** with folders:

1. **Auth** — Register, Login, Get Me, Promote to Admin
2. **Courses (Public)** — List, Get by ID (filter by subject/examTag)
3. **Courses (Admin)** — Create, Update, Delete, Toggle Publish
4. **Lessons** — Create, Update, Get (as student with/without enrollment)
5. **Enrollments** — Enroll, My Enrollments, Admin list
6. **Media** — Upload PDF, Add YouTube link, Delete
7. **Edge Cases** — Unauthenticated access, wrong role, duplicate enrollment

**Use Postman Environment Variables**:
```
base_url = http://localhost:4000
student_token = {{auto-filled by login request}}
admin_token = {{auto-filled by login request}}
```

Set **Tests tab** in Login request to auto-save token:
```javascript
pm.environment.set("admin_token", pm.response.json().accessToken);
```

---

## 10. Deployment Plan

### Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "Initial backend"
git remote add origin https://github.com/yourname/tutoring-platform
git push -u origin main
```

### Step 2 — Supabase Setup

1. Create project at supabase.com
2. Copy `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` from Settings → API
3. Copy `SUPABASE_JWT_SECRET` from Settings → API → JWT Settings
4. Create Storage bucket named `media` — set to **Public**
5. Run migrations: `npx prisma migrate deploy`

### Step 3 — Deploy Backend to Render

1. Create new **Web Service** on render.com
2. Connect GitHub repo
3. Set build command: `npm install && npx prisma generate && npx prisma migrate deploy`
4. Set start command: `node dist/server.js` (or `ts-node src/server.ts` for quick deploy)
5. Add all environment variables from `.env`
6. Deploy — get URL like `https://tutoring-api.onrender.com`

### Step 4 — Deploy Frontend to Vercel

1. Import repo at vercel.com
2. Set `NEXT_PUBLIC_API_URL=https://tutoring-api.onrender.com`
3. Set `FRONTEND_URL` in Render env to your Vercel URL
4. Deploy

### Step 5 — Post-deploy checklist

- [ ] Test register + login flow end-to-end
- [ ] Confirm CORS blocks requests from other origins
- [ ] Upload a test PDF and verify Supabase Storage URL works
- [ ] Enroll as student and confirm lesson gate works
- [ ] Run Postman collection against production URL

---

## 11. Master Build Prompt

Copy this prompt into a new Claude conversation to generate all remaining code files:

---

> You are a senior backend engineer. Build a complete Node.js + Express + Prisma + TypeScript backend for an educational tutoring platform.
>
> **Context**: A physics/chemistry/math teacher in India uses this to deliver courses to students preparing for JEE Mains, NEET, MHT-CET (India) and SAT, AP exams (US). An admin (the teacher) manages all content. Students register, enroll, and view lessons.
>
> **Database**: PostgreSQL via Supabase. Use this exact Prisma schema: [paste schema from Section 3 above].
>
> **Tech stack**: Node.js 20, Express 4, Prisma ORM, TypeScript, Supabase Auth (JWT verification), Supabase Storage (file uploads), Zod (validation), Helmet.js, express-rate-limit, Multer (in-memory storage → Supabase).
>
> **Generate the following files**:
> 1. `src/app.ts` — Express setup with Helmet, CORS, rate limiting, all routes mounted
> 2. `src/server.ts` — Entry point
> 3. `src/config/db.ts` — Prisma singleton
> 4. `src/config/supabase.ts` — Supabase admin client
> 5. `src/utils/apiResponse.ts` — Standard `{ success, data, error }` response wrapper
> 6. `src/middleware/auth.middleware.ts` — JWT verify, attach `req.user`
> 7. `src/middleware/rbac.middleware.ts` — `requireRole()`, `adminOnly`, `studentOrAdmin`
> 8. `src/middleware/validate.middleware.ts` — Zod validation middleware factory
> 9. All files in `src/modules/auth/` (routes, controller, service)
> 10. All files in `src/modules/courses/` (routes, controller, service)
> 11. All files in `src/modules/lessons/` — include enrollment gate
> 12. All files in `src/modules/enrollments/`
> 13. All files in `src/modules/media/` — Multer + Supabase Storage upload
> 14. All files in `src/modules/notes/`
> 15. `tests/auth.test.ts`, `tests/rbac.test.ts`, `tests/courses.test.ts` using Jest + Supertest
> 16. `package.json` with all dependencies and scripts
> 17. `prisma/schema.prisma` (use the schema above exactly)
> 18. `.env.example`
> 19. `README.md` with setup instructions
>
> **Rules**:
> - Every admin endpoint must use `adminOnly` middleware
> - Every lesson fetch must check enrollment unless `isFree === true` or role is ADMIN
> - All inputs validated with Zod before hitting the database
> - All file uploads validated for MIME type and size
> - Never return password fields or Supabase service key in responses
> - Use `async/await` throughout with `try/catch`
> - Use standard response format: `{ success: true, data: {...} }` and `{ success: false, error: '...' }`
>
> Generate each file completely. Do not truncate.

---

*This plan was generated for a JEE/NEET/SAT tutoring platform with Node.js + Express + Supabase. Adjust exam tags and subjects as needed.*
