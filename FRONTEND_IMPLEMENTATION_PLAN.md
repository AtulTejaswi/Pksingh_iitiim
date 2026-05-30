# Tutoring Platform Frontend Implementation Plan

## Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack Summary](#tech-stack-summary)
3. [Admin Dashboard Design](#admin-dashboard-design)
4. [Student Portal Design](#student-portal-design)
5. [Frontend-Backend Integration](#frontend-backend-integration)
6. [Security Implementation](#security-implementation)
7. [Testing Strategy](#testing-strategy)
8. [Deployment & Hosting](#deployment--hosting)
9. [Step-by-Step Implementation Guide](#step-by-step-implementation-guide)

---

## Project Overview

### User Types
1. **Teacher (Admin)**: Non-technical, manages content (courses, lessons, uploads)
2. **Students**: Browse, enroll, learn (Indian students: JEE/NEET/MHT-CET, US students: SAT/AP)

### Platform Goals
- Simple, intuitive admin dashboard for non-technical teacher
- Clean student portal for browsing & learning
- Secure authentication & role-based access
- Seamless API integration with existing backend
- Cost-effective hosting

---

## Tech Stack Summary

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS + Shadcn/ui components
- **State Management**: React Context API + TanStack Query (for API calls)
- **Forms**: React Hook Form + Zod (validation)
- **Authentication**: Supabase Auth SDK

### Backend (Already Built)
- **Runtime**: Node.js
- **Framework**: Express.js
- **ORM**: Prisma
- **Database**: Supabase PostgreSQL
- **Storage**: Supabase Storage
- **Auth**: Supabase Auth

### Hosting
- **Frontend**: Vercel (free tier supports development, upgrade for production)
- **Backend**: Render.com or Railway.app (free tier available)
- **Database & Storage**: Supabase (free tier with 500MB storage)

---

## Admin Dashboard Design

### 1. Navigation Structure

```
Dashboard Home
├── Sidebar Navigation
│   ├── Dashboard (Overview)
│   ├── Courses
│   │   ├── Add Course
│   │   ├── View All Courses
│   │   └── Manage Lessons (per course)
│   ├── Lessons & Content
│   │   ├── Add Lesson
│   │   ├── Upload Notes/Videos
│   │   └── Manage Media
│   ├── Students
│   │   ├── View All Students
│   │   ├── Student Enrollments
│   │   └── Track Progress (future)
│   ├── Settings
│   │   ├── Profile
│   │   └── Course Categories (if needed)
│   └── Logout
```

### 2. Key Pages & Features

#### **Dashboard Home**
- Welcome message with teacher's name
- Quick stats (total courses, total students, total lessons)
- Recent activity log
- Quick action buttons (Add Course, Upload Lesson, View Students)
- Simple charts using recharts (optional, for non-technical teacher)

```
┌─────────────────────────────────────────┐
│ Welcome, Mr. [Teacher Name]              │
├─────────────────────────────────────────┤
│                                         │
│  Total Courses: 5    Total Students: 42 │
│  Total Lessons: 23   Total Videos: 15   │
│                                         │
│  [+ Add Course] [+ Add Lesson]          │
│                                         │
├─────────────────────────────────────────┤
│ Recent Activity                          │
│ ─────────────────────────────────────── │
│ Student John enrolled in Physics       │
│ You uploaded: Wave Theory Notes         │
│ Student Sarah completed Lesson 5        │
└─────────────────────────────────────────┘
```

#### **Add Course Page**
- Form fields:
  - Course Title (e.g., "JEE Mains Physics")
  - Description
  - Category (Physics, Chemistry, Math, SAT, AP)
  - Target Audience (JEE, NEET, MHT-CET, SAT, AP)
  - Course Banner Image (upload to Supabase Storage)
  - Curriculum PDF (optional)
  - Price (free or paid, for future monetization)
- Form validation with Zod
- Success toast notification

```
┌────────────────────────────────────────┐
│ Add New Course                          │
├────────────────────────────────────────┤
│                                        │
│ Course Title                           │
│ [________________________]             │
│                                        │
│ Description                            │
│ [________________________]             │
│ [________________________]             │
│                                        │
│ Category                               │
│ [Select: Physics ▼]                    │
│                                        │
│ Target Audience                        │
│ [☐ JEE] [☐ NEET] [☐ SAT] [☐ AP]     │
│                                        │
│ Course Image                           │
│ [Upload Image]                         │
│                                        │
│ [Cancel]  [Create Course]              │
└────────────────────────────────────────┘
```

#### **View All Courses Page**
- Table/Grid view of all courses
- Columns: Course Title, Category, Students Enrolled, Total Lessons, Actions
- Actions: Edit, Delete, Manage Lessons, View Details
- Search and filter by category
- Pagination

```
┌──────────────────────────────────────────────────────────────┐
│ My Courses                                                   │
│ [Search: ____________] [Filter by Category ▼]               │
├──────────────────────────────────────────────────────────────┤
│ Course Title    │ Category  │ Students │ Lessons │ Actions   │
├──────────────────────────────────────────────────────────────┤
│ JEE Physics     │ Physics   │ 15       │ 8       │ ✎ Manage  │
│ NEET Chemistry  │ Chemistry │ 12       │ 6       │ ✎ Manage  │
│ SAT Math        │ Math      │ 8        │ 5       │ ✎ Manage  │
└──────────────────────────────────────────────────────────────┘
```

#### **Manage Lessons Page (per course)**
- List all lessons for selected course
- Columns: Lesson Number, Title, Content Type, Status, Actions
- Actions: Edit, Delete, Upload Content, View Details
- Add New Lesson button
- Drag-to-reorder lessons (bonus)

```
┌──────────────────────────────────────────────────────────────┐
│ Physics > Manage Lessons                                     │
├──────────────────────────────────────────────────────────────┤
│ [+ Add Lesson]                                               │
├──────────────────────────────────────────────────────────────┤
│ # │ Title           │ Type  │ Status    │ Actions            │
├──────────────────────────────────────────────────────────────┤
│ 1 │ Introduction    │ Video │ Complete  │ Edit | Delete      │
│ 2 │ Wave Theory     │ Video │ Complete  │ Edit | Delete      │
│ 3 │ Quiz            │ Quiz  │ Draft     │ Edit | Delete      │
│ 4 │ Assignment      │ File  │ Complete  │ Edit | Delete      │
└──────────────────────────────────────────────────────────────┘
```

#### **Add/Edit Lesson Page**
- Form fields:
  - Lesson Title
  - Lesson Number (order)
  - Description
  - Content Type (Video, PDF Notes, Quiz, etc.)
  - Duration (for videos)
  - Estimated completion time
- Upload section:
  - Upload video from device (store in Supabase Storage)
  - Upload PDF/notes
  - Add quiz questions (if applicable)
- Preview section to verify before saving

```
┌────────────────────────────────────────┐
│ Add New Lesson                          │
├────────────────────────────────────────┤
│                                        │
│ Lesson Title                           │
│ [________________________]             │
│                                        │
│ Lesson Number                          │
│ [__]                                   │
│                                        │
│ Description                            │
│ [________________________]             │
│                                        │
│ Upload Video                           │
│ [Drag to upload or click]              │
│ ████████████░░░░░ 60%                  │
│                                        │
│ Upload Notes (PDF)                     │
│ [Drag to upload or click]              │
│                                        │
│ [Cancel]  [Save Lesson]                │
└────────────────────────────────────────┘
```

#### **View All Students Page**
- Table: Student Name, Email, Enrolled Courses, Enrollment Date, Status
- Actions: View Profile, Message (future), Remove
- Search and filter by course/enrollment status
- Pagination

```
┌────────────────────────────────────────────────────────────┐
│ Students                                                   │
│ [Search: ____________] [Filter by Course ▼]               │
├────────────────────────────────────────────────────────────┤
│ Name       │ Email          │ Courses    │ Status │ Actions│
├────────────────────────────────────────────────────────────┤
│ John Doe   │ john@email.com │ 2          │ Active │ View   │
│ Jane Smith │ jane@email.com │ 1          │ Active │ View   │
│ Bob Wilson │ bob@email.com  │ 3          │ Active │ View   │
└────────────────────────────────────────────────────────────┘
```

#### **Settings Page**
- Profile information (name, email, phone, qualifications)
- Change password
- Notification preferences (future)
- Export data (future)

### 3. Admin Dashboard Design Principles
- **Simplicity**: Large buttons, clear labels, minimal jargon
- **Consistency**: Same colors, fonts, spacing throughout
- **Feedback**: Toast notifications for all actions (success/error)
- **Safety**: Confirmation dialogs before delete actions
- **Mobile-Responsive**: Works on tablets (teacher might use iPad)

---

## Student Portal Design

### 1. Navigation Structure

```
Homepage
├── Navigation Bar (Top)
│   ├── Logo
│   ├── Browse Courses
│   ├── My Courses
│   ├── Profile
│   └── Logout
├── Footer
│   ├── About
│   ├── Contact
│   └── Social Links
```

### 2. Key Pages & Features

#### **Homepage / Landing Page**
- Hero section with title and CTA button
- Featured courses carousel
- Categories section (Physics, Chemistry, Math, SAT, AP)
- Statistics (if public)
- Teacher bio/introduction
- Call-to-action: "Enroll Now"

```
┌─────────────────────────────────────────┐
│ Learn Physics, Chemistry, Math & More   │
│                    [Get Started]        │
├─────────────────────────────────────────┤
│                                         │
│ Featured Courses                        │
│ [Carousel: Physics | Chemistry | Math]  │
│                                         │
├─────────────────────────────────────────┤
│ Browse by Category                      │
│ [Physics] [Chemistry] [Math] [SAT] [AP] │
│                                         │
└─────────────────────────────────────────┘
```

#### **Browse Courses Page**
- Grid or list view of all courses
- Search by course name
- Filter by:
  - Category (Physics, Chemistry, Math)
  - Target Audience (JEE, NEET, SAT, AP)
  - Price (Free, Paid)
- Course cards showing:
  - Course image/banner
  - Title
  - Description (short)
  - Enrollment count
  - Rating/reviews (optional)
  - [Enroll] or [View Details] button

```
┌──────────────────────────────────────────┐
│ Browse Courses                            │
│ [Search: ____________] [Filters ▼]      │
├──────────────────────────────────────────┤
│                                          │
│ ┌─────────┐  ┌─────────┐  ┌─────────┐  │
│ │ Physics │  │Chemistry│  │ Math    │  │
│ │ Image   │  │ Image   │  │ Image   │  │
│ │ JEE ... │  │ NEET ..│  │ SAT ... │  │
│ │[Enroll] │  │[Enroll] │  │[Enroll] │  │
│ └─────────┘  └─────────┘  └─────────┘  │
│                                          │
└──────────────────────────────────────────┘
```

#### **Course Details Page**
- Large course banner/image
- Course title and description
- Teacher introduction
- Course content overview (list of lessons)
- Enrollment status (if logged in):
  - [Enroll] button (if not enrolled)
  - [Go to Course] button (if enrolled)
- Reviews/ratings (optional)
- FAQ section

```
┌──────────────────────────────────────────┐
│ ← Back to Courses                        │
├──────────────────────────────────────────┤
│ [Large Course Banner Image]              │
│                                          │
│ JEE Mains Physics                        │
│ Complete guide to JEE Physics            │
│                                          │
│ Instructor: Mr. [Teacher Name]           │
│ ⭐ 4.8/5 (150 reviews) • 500+ students  │
│                                          │
│ [Enroll for Free]                        │
│                                          │
│ Course Content                           │
│ ├─ Lesson 1: Introduction (15 min)       │
│ ├─ Lesson 2: Wave Theory (45 min)        │
│ └─ Lesson 3: Mechanics (60 min)          │
│                                          │
│ About This Course                        │
│ This course covers...                    │
│                                          │
└──────────────────────────────────────────┘
```

#### **My Courses Page** (After login)
- Personalized course list for enrolled student
- Progress bar for each course (lessons completed)
- Quick access to continue learning
- Option to unenroll

```
┌──────────────────────────────────────────┐
│ My Courses                                │
├──────────────────────────────────────────┤
│                                          │
│ JEE Physics                               │
│ Progress: ████████░░░░░░░░░░ 40%         │
│ Next: Lesson 5 - Thermodynamics          │
│ [Continue Learning]                      │
│                                          │
│ NEET Chemistry                            │
│ Progress: ██████░░░░░░░░░░░░░░ 30%       │
│ Next: Lesson 3 - Organic Chemistry       │
│ [Continue Learning]                      │
│                                          │
└──────────────────────────────────────────┘
```

#### **Lesson View Page**
- Lesson title and description
- Main content area:
  - Video player (if video lesson)
  - PDF viewer (if PDF notes)
  - Quiz interface (if quiz lesson)
- Sidebar:
  - Course outline (all lessons in course)
  - Current lesson highlighted
  - Navigation: Previous/Next lesson buttons
- Lesson resources:
  - Download notes (PDF)
  - Download resources
- Completion checkbox ("Mark as Complete")

```
┌──────────────────────────────────────────────┐
│ JEE Physics > Lesson 2: Wave Theory          │
├───────────────────────┬──────────────────────┤
│ Course Outline        │                      │
│                       │ [Video Player]       │
│ ✓ Lesson 1           │ 00:00 ━━━━━━━━ 45:30│
│ ► Lesson 2 (Now)     │                      │
│ Lesson 3             │ Lesson Materials     │
│ Lesson 4             │ [📄 Download Notes]  │
│ Lesson 5             │ [📥 Assignments]     │
│                       │                      │
│ [← Prev] [Mark Done]  │ [Next →]             │
└───────────────────────┴──────────────────────┘
```

#### **Authentication Pages**

**Login Page**
- Email input
- Password input
- "Remember me" checkbox
- "Forgot password?" link
- [Sign In] button
- "Don't have an account? Sign up" link
- Social login (Google, optional)

**Sign Up / Registration Page**
- Full name
- Email
- Password (with strength indicator)
- Confirm password
- Select role (Student) - pre-selected
- Select target audience (JEE, NEET, SAT, AP, etc.)
- Terms & conditions checkbox
- [Create Account] button
- Email verification step

**Password Reset Page**
- Email input
- [Send Reset Link] button
- Confirmation message

### 3. Student Portal Design Principles
- **Engagement**: Progress indicators, completion tracking
- **Clarity**: Clear course structure, easy navigation
- **Accessibility**: Large text, high contrast, mobile-friendly
- **Motivation**: Show progress, celebrate milestones

---

## Frontend-Backend Integration

### 1. API Endpoints Reference

Based on your backend, map to these endpoints:

```
Authentication
├── POST /api/auth/register - Register student
├── POST /api/auth/login - Login (via Supabase Auth)
├── POST /api/auth/logout - Logout
├── POST /api/auth/refresh-token - Refresh JWT
└── GET /api/auth/me - Get current user

Courses
├── GET /api/courses - Get all courses
├── GET /api/courses/:id - Get course details
├── POST /api/courses - Create course (admin only)
├── PUT /api/courses/:id - Update course (admin only)
├── DELETE /api/courses/:id - Delete course (admin only)
└── GET /api/courses/:id/lessons - Get lessons in course

Lessons
├── GET /api/lessons/:id - Get lesson details
├── POST /api/lessons - Create lesson (admin only)
├── PUT /api/lessons/:id - Update lesson (admin only)
├── DELETE /api/lessons/:id - Delete lesson (admin only)
└── PATCH /api/lessons/:id/complete - Mark lesson complete

Enrollments
├── GET /api/enrollments - Get student's enrollments
├── GET /api/enrollments/:courseId - Get course enrollments (admin)
├── POST /api/enrollments - Enroll student in course
├── DELETE /api/enrollments/:id - Unenroll from course
└── GET /api/enrollments/progress - Get student progress

Media/Storage
├── POST /api/upload - Upload file to Supabase Storage
├── GET /api/media/:id - Get media details
├── DELETE /api/media/:id - Delete media (admin only)
└── GET /media/:path - Get signed URL for downloads

Users
├── GET /api/users/:id - Get user details
├── PUT /api/users/:id - Update user profile
├── GET /api/users - Get all users (admin only)
└── DELETE /api/users/:id - Delete user (admin only)
```

### 2. Setting Up API Client with TanStack Query

```typescript
// lib/api-client.ts
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
          refreshToken: localStorage.getItem('refresh_token'),
        });
        localStorage.setItem('access_token', data.accessToken);
        apiClient.defaults.headers.Authorization = `Bearer ${data.accessToken}`;
        return apiClient(originalRequest);
      } catch {
        // Redirect to login
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
```

### 3. TanStack Query Hooks

```typescript
// hooks/useAuth.ts
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export const useLogin = () => {
  return useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      apiClient.post('/auth/login', credentials),
    onSuccess: (data) => {
      localStorage.setItem('access_token', data.data.accessToken);
      localStorage.setItem('refresh_token', data.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.data.user));
    },
  });
};

export const useGetCourses = () => {
  return useQuery({
    queryKey: ['courses'],
    queryFn: () => apiClient.get('/courses').then((res) => res.data),
  });
};

export const useCreateCourse = () => {
  return useMutation({
    mutationFn: (data: CourseFormData) => apiClient.post('/courses', data),
  });
};

// hooks/useUpload.ts
export const useUploadFile = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      return apiClient.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
  });
};
```

### 4. Environment Variables Setup

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## Security Implementation

### 1. Supabase Auth Integration

```typescript
// lib/supabase-client.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// lib/auth-context.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from './supabase-client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
```

### 2. Role-Based Access Control (RBAC)

```typescript
// lib/rbac.ts
export enum UserRole {
  ADMIN = 'admin',
  STUDENT = 'student',
}

export const canAccess = (userRole: UserRole, requiredRole: UserRole): boolean => {
  if (requiredRole === UserRole.ADMIN) {
    return userRole === UserRole.ADMIN;
  }
  return true;
};

// middleware.ts (Next.js middleware)
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  // Admin routes
  if (pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    // Verify token and role (implement JWT verification)
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*'],
};
```

### 3. Protected Routes Component

```typescript
// components/ProtectedRoute.tsx
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
import { UserRole, canAccess } from '@/lib/rbac';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: UserRole;
}

export function ProtectedRoute({
  children,
  requiredRole = UserRole.STUDENT,
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Get user role from custom claims or database
  const userRole = user?.user_metadata?.role || UserRole.STUDENT;

  if (!canAccess(userRole, requiredRole)) {
    router.push('/unauthorized');
    return null;
  }

  return <>{children}</>;
}
```

### 4. JWT Token Handling

```typescript
// lib/jwt.ts
export const getAccessToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
};

export const setAccessToken = (token: string): void => {
  localStorage.setItem('access_token', token);
};

export const removeAccessToken = (): void => {
  localStorage.removeItem('access_token');
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = JSON.parse(atob(token.split('.')[1]));
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};
```

### 5. Input Validation with Zod

```typescript
// lib/validators.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signupSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  targetAudience: z.array(z.string()).min(1, 'Select at least one target audience'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const courseSchema = z.object({
  title: z.string().min(3, 'Course title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.enum(['Physics', 'Chemistry', 'Math', 'SAT', 'AP']),
  targetAudience: z.array(z.string()).min(1, 'Select at least one audience'),
  price: z.number().min(0, 'Price must be positive'),
});

export const lessonSchema = z.object({
  title: z.string().min(3, 'Lesson title must be at least 3 characters'),
  lessonNumber: z.number().int().positive('Lesson number must be positive'),
  description: z.string().optional(),
  duration: z.number().positive('Duration must be positive').optional(),
  contentType: z.enum(['video', 'pdf', 'quiz', 'assignment']),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type CourseInput = z.infer<typeof courseSchema>;
export type LessonInput = z.infer<typeof lessonSchema>;
```

### 6. Secure File Upload

```typescript
// lib/upload.ts
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/webm'];
const ALLOWED_DOCUMENT_TYPES = ['application/pdf'];
const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB

export const validateFile = (file: File, type: 'video' | 'document'): boolean => {
  const allowedTypes = type === 'video' ? ALLOWED_VIDEO_TYPES : ALLOWED_DOCUMENT_TYPES;
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`Invalid file type. Allowed: ${allowedTypes.join(', ')}`);
  }
  
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`);
  }
  
  return true;
};

export const uploadToSupabase = async (
  file: File,
  bucket: string,
  path: string
): Promise<string> => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) throw error;
  
  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);
    
  return publicUrl;
};
```

### 7. Content Security Policy

```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'Content-Security-Policy',
          value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'",
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
      ],
    },
  ],
};

module.exports = nextConfig;
```

---

## Testing Strategy

### 1. Unit Tests (Jest + React Testing Library)

```typescript
// __tests__/components/CourseCard.test.tsx
import { render, screen } from '@testing-library/react';
import { CourseCard } from '@/components/CourseCard';

describe('CourseCard', () => {
  it('renders course title', () => {
    const course = {
      id: '1',
      title: 'Physics 101',
      description: 'Intro to physics',
      category: 'Physics',
    };

    render(<CourseCard course={course} />);
    expect(screen.getByText('Physics 101')).toBeInTheDocument();
  });

  it('renders enroll button', () => {
    const course = { /* ... */ };
    const mockEnroll = jest.fn();

    render(<CourseCard course={course} onEnroll={mockEnroll} />);
    const button = screen.getByRole('button', { name: /enroll/i });
    
    button.click();
    expect(mockEnroll).toHaveBeenCalled();
  });
});
```

### 2. Integration Tests (Playwright)

```typescript
// e2e/admin-flow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto('/login');
    await page.fill('input[name="email"]', 'teacher@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button:has-text("Sign In")');
    await page.waitForNavigation();
  });

  test('should create a new course', async ({ page }) => {
    await page.goto('/admin/courses');
    await page.click('button:has-text("Add Course")');
    
    // Fill form
    await page.fill('input[name="title"]', 'New Physics Course');
    await page.fill('textarea[name="description"]', 'A comprehensive physics course');
    await page.selectOption('select[name="category"]', 'Physics');
    await page.click('button:has-text("Create Course")');
    
    // Verify success
    await expect(page.locator('text=Course created successfully')).toBeVisible();
    await expect(page.locator('text=New Physics Course')).toBeVisible();
  });

  test('should upload lesson video', async ({ page }) => {
    await page.goto('/admin/courses/1/lessons');
    await page.click('button:has-text("Add Lesson")');
    
    // Fill form
    await page.fill('input[name="title"]', 'Wave Theory');
    await page.fill('input[name="lessonNumber"]', '1');
    
    // Upload file
    const fileInput = await page.locator('input[type="file"]');
    await fileInput.setInputFiles('test-video.mp4');
    
    await page.click('button:has-text("Save Lesson")');
    
    // Verify success
    await expect(page.locator('text=Lesson created successfully')).toBeVisible();
  });
});
```

### 3. Student Portal Tests

```typescript
// e2e/student-flow.spec.ts
test('should allow student to enroll in course', async ({ page }) => {
  await page.goto('/');
  await page.click('button:has-text("Browse Courses")');
  
  // Find and click first course
  const courseCard = page.locator('[data-testid="course-card"]').first();
  await courseCard.click('text=Enroll');
  
  // Verify enrollment
  await expect(page.locator('text=Successfully enrolled')).toBeVisible();
});

test('should display lesson content for enrolled student', async ({ page }) => {
  // Login
  await loginAsStudent(page);
  
  // Navigate to course
  await page.goto('/my-courses');
  await page.click('text=Physics 101');
  
  // Verify lesson content
  const videoPlayer = page.locator('video');
  await expect(videoPlayer).toBeVisible();
});
```

### 4. Performance Tests (Lighthouse)

- Measure Core Web Vitals
- Target: Largest Contentful Paint (LCP) < 2.5s
- Target: Cumulative Layout Shift (CLS) < 0.1
- Target: First Input Delay (FID) < 100ms

### 5. Security Tests

```typescript
// __tests__/security/input-validation.test.ts
import { loginSchema, courseSchema } from '@/lib/validators';

describe('Input Validation', () => {
  it('should reject invalid email', () => {
    const result = loginSchema.safeParse({
      email: 'invalid-email',
      password: 'password123',
    });
    expect(result.success).toBe(false);
  });

  it('should reject XSS attempts', () => {
    const malicious = '<script>alert("XSS")</script>';
    const result = courseSchema.safeParse({
      title: malicious,
      description: 'valid description',
      category: 'Physics',
      targetAudience: ['JEE'],
      price: 0,
    });
    expect(result.success).toBe(false);
  });

  it('should reject SQL injection attempts', () => {
    const sqlInjection = "'; DROP TABLE users; --";
    const result = loginSchema.safeParse({
      email: sqlInjection,
      password: 'password123',
    });
    expect(result.success).toBe(false);
  });
});
```

---

## Deployment & Hosting

### 1. Vercel Deployment (Frontend)

**Setup:**
1. Push code to GitHub
2. Connect GitHub repo to Vercel
3. Add environment variables in Vercel dashboard
4. Automatic deployments on push to main branch

**Environment variables on Vercel:**
```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**Vercel setup:**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel deploy --prod

# Set environment variables
vercel env add NEXT_PUBLIC_API_URL
```

### 2. Backend Deployment (Render or Railway)

**Option A: Render.com**

1. Sign up at render.com
2. Connect GitHub repository
3. Create new Web Service
4. Set build command: `npm run build`
5. Set start command: `npm run start`
6. Add environment variables
7. Deploy

**Option B: Railway.app**

1. Sign up at railway.app
2. Connect GitHub repository
3. Add NODE_ENV=production
4. Railway auto-detects Node.js project
5. Deploy

### 3. Database & Storage (Supabase)

**Already configured, ensure:**
- Database backups enabled (Supabase handles automatically)
- Row level security (RLS) policies in place
- Storage bucket permissions configured

### 4. Domain Setup

```
domain.com → Vercel (frontend)
api.domain.com → Render/Railway (backend)
```

Use Cloudflare for DNS management (free tier):
- A record: yourdomain.com → Vercel IP
- CNAME: api → render-app.onrender.com

### 5. SSL/TLS Certificates

- Vercel: Automatic SSL
- Render/Railway: Automatic SSL
- Supabase: Included

### 6. Monitoring & Logging

```typescript
// lib/analytics.ts
import { useEffect } from 'react';

export function usePageView() {
  useEffect(() => {
    // Send page view to analytics
    if (window.gtag) {
      window.gtag('pageview', {
        page_path: window.location.pathname,
      });
    }
  }, []);
}
```

**Add Google Analytics:**
```typescript
// app/layout.tsx
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=GA_ID"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'GA_ID');
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

---

## Step-by-Step Implementation Guide

### Phase 1: Project Setup (Week 1)

#### 1.1 Initialize Next.js Project

```bash
# Create Next.js project with TypeScript and Tailwind
npx create-next-app@latest tutoring-platform \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir

cd tutoring-platform

# Install dependencies
npm install @tanstack/react-query axios zod react-hook-form
npm install -D @tanstack/react-query-devtools
npm install @supabase/supabase-js
npm install lucide-react
npm install -D @types/node @types/react
```

#### 1.2 Setup Project Structure

```
tutoring-platform/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── (auth)/
│   │   ├── login/
│   │   ├── signup/
│   │   └── forgot-password/
│   ├── (student)/
│   │   ├── layout.tsx
│   │   ├── courses/
│   │   ├── my-courses/
│   │   └── lessons/
│   └── (admin)/
│       ├── layout.tsx
│       ├── dashboard/
│       ├── courses/
│       ├── lessons/
│       ├── students/
│       └── settings/
├── components/
│   ├── ui/ (Shadcn components)
│   ├── admin/
│   ├── student/
│   └── common/
├── lib/
│   ├── api-client.ts
│   ├── auth-context.tsx
│   ├── supabase-client.ts
│   ├── validators.ts
│   ├── rbac.ts
│   └── jwt.ts
├── hooks/
│   ├── useAuth.ts
│   ├── useQuery.ts
│   ├── useMutation.ts
│   └── useUpload.ts
├── types/
│   └── index.ts
├── styles/
│   └── globals.css
├── .env.local
└── next.config.js
```

#### 1.3 Configure Environment Variables

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

#### 1.4 Setup Root Layout

```typescript
// app/layout.tsx
import type { Metadata } from 'next';
import { AuthProvider } from '@/lib/auth-context';
import { QueryClientProvider } from '@/lib/query-client';
import './globals.css';

export const metadata: Metadata = {
  title: 'JEE & NEET Tutoring Platform',
  description: 'Online tutoring for JEE, NEET, SAT, and AP students',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
```

#### 1.5 Setup Query Client

```typescript
// lib/query-client.tsx
'use client';

import { QueryClient, QueryClientProvider as Provider } from '@tanstack/react-query';
import { ReactNode } from 'react';

const queryClient = new QueryClient();

export function QueryClientProvider({ children }: { children: ReactNode }) {
  return <Provider client={queryClient}>{children}</Provider>;
}
```

### Phase 2: Authentication (Week 2)

#### 2.1 Implement Login Page

```typescript
// app/(auth)/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginInput } from '@/lib/validators';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [error, setError] = useState('');

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      setError('');
      await signIn(data.email, data.password);
      router.push('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              {...form.register('email')}
              type="email"
              placeholder="you@example.com"
              className="mt-1"
            />
            {form.formState.errors.email && (
              <p className="mt-1 text-sm text-red-500">{form.formState.errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <Input
              {...form.register('password')}
              type="password"
              placeholder="••••••••"
              className="mt-1"
            />
            {form.formState.errors.password && (
              <p className="mt-1 text-sm text-red-500">{form.formState.errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <a href="/signup" className="text-blue-600 hover:text-blue-500">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
```

#### 2.2 Implement Sign Up Page

```typescript
// app/(auth)/signup/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, type SignupInput } from '@/lib/validators';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';

const TARGET_AUDIENCES = [
  { id: 'jee', label: 'JEE Mains/Advanced' },
  { id: 'neet', label: 'NEET' },
  { id: 'mht', label: 'MHT-CET' },
  { id: 'sat', label: 'SAT' },
  { id: 'ap', label: 'AP' },
];

export default function SignupPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [error, setError] = useState('');

  const form = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      targetAudience: [],
    },
  });

  const onSubmit = async (data: SignupInput) => {
    try {
      setError('');
      await signUp(data.email, data.password);
      // Optionally create user profile in your database
      router.push('/verify-email');
    } catch (err) {
      setError('Failed to create account. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Form fields similar to login */}
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <Input
              {...form.register('fullName')}
              placeholder="John Doe"
              className="mt-1"
            />
            {form.formState.errors.fullName && (
              <p className="mt-1 text-sm text-red-500">{form.formState.errors.fullName.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <Input
              {...form.register('email')}
              type="email"
              placeholder="you@example.com"
              className="mt-1"
            />
          </div>

          {/* Target Audience */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What are you preparing for?
            </label>
            <div className="space-y-2">
              {TARGET_AUDIENCES.map((audience) => (
                <div key={audience.id} className="flex items-center">
                  <Checkbox
                    id={audience.id}
                    {...form.register('targetAudience')}
                    value={audience.id}
                  />
                  <label htmlFor={audience.id} className="ml-2 text-sm text-gray-700">
                    {audience.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>
      </div>
    </div>
  );
}
```

### Phase 3: Student Portal (Week 3-4)

#### 3.1 Homepage

```typescript
// app/page.tsx
'use client';

import { useGetCourses } from '@/hooks/useCourses';
import { CourseCard } from '@/components/student/CourseCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HomePage() {
  const { data: courses, isLoading } = useGetCourses();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Master Physics, Chemistry & Math
          </h1>
          <p className="text-xl mb-8">
            Prepare for JEE, NEET, SAT, AP and ace your exams with expert guidance
          </p>
          <Link href="/courses">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Browse Courses
            </Button>
          </Link>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Featured Courses</h2>
          {isLoading ? (
            <div className="text-center py-12">Loading courses...</div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {courses?.slice(0, 3).map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-50 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Browse by Subject</h2>
          <div className="grid md:grid-cols-5 gap-4">
            {['Physics', 'Chemistry', 'Math', 'SAT', 'AP'].map((category) => (
              <Link
                key={category}
                href={`/courses?category=${category}`}
                className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition text-center"
              >
                <h3 className="text-lg font-semibold">{category}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
```

#### 3.2 Browse Courses Page

```typescript
// app/(student)/courses/page.tsx
'use client';

import { useState } from 'react';
import { useGetCourses } from '@/hooks/useCourses';
import { CourseCard } from '@/components/student/CourseCard';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function CoursesPage() {
  const { data: courses = [], isLoading } = useGetCourses();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const filtered = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(search.toLowerCase()) &&
      (!category || course.category === category)
  );

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8">Browse Courses</h1>

      {/* Search and Filter */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <Input
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            <SelectItem value="Physics">Physics</SelectItem>
            <SelectItem value="Chemistry">Chemistry</SelectItem>
            <SelectItem value="Math">Math</SelectItem>
            <SelectItem value="SAT">SAT</SelectItem>
            <SelectItem value="AP">AP</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Courses Grid */}
      {isLoading ? (
        <div className="text-center py-12">Loading courses...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No courses found. Try adjusting your filters.
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {filtered.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
```

#### 3.3 Course Details Page

```typescript
// app/(student)/courses/[id]/page.tsx
'use client';

import { useGetCourse } from '@/hooks/useCourses';
import { useEnrollCourse } from '@/hooks/useEnrollments';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const { data: course, isLoading } = useGetCourse(params.id);
  const { mutate: enroll, isPending } = useEnrollCourse();
  const { user } = useAuth();

  if (isLoading) return <div className="text-center py-12">Loading course...</div>;
  if (!course) return <div className="text-center py-12">Course not found</div>;

  const handleEnroll = () => {
    if (!user) {
      // Redirect to login
      window.location.href = '/login';
      return;
    }
    enroll({ courseId: course.id });
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      {/* Banner */}
      <div className="relative h-96 w-full rounded-lg overflow-hidden mb-8">
        <Image
          src={course.bannerUrl || '/placeholder.jpg'}
          alt={course.title}
          fill
          className="object-cover"
        />
      </div>

      {/* Course Info */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
          <p className="text-lg text-gray-700 mb-6">{course.description}</p>

          <div className="space-y-4 mb-8">
            <h2 className="text-2xl font-bold">Course Content</h2>
            {course.lessons?.map((lesson, index) => (
              <div key={lesson.id} className="p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold">{lesson.title}</h3>
                    <p className="text-sm text-gray-500">{lesson.duration} minutes</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="bg-gray-50 p-6 rounded-lg h-fit">
          <Button
            onClick={handleEnroll}
            disabled={isPending}
            className="w-full mb-4"
            size="lg"
          >
            {isPending ? 'Enrolling...' : 'Enroll for Free'}
          </Button>

          <div className="space-y-4 text-sm">
            <div>
              <p className="text-gray-600">Students Enrolled</p>
              <p className="font-semibold text-lg">{course.enrollmentCount}</p>
            </div>
            <div>
              <p className="text-gray-600">Lessons</p>
              <p className="font-semibold text-lg">{course.lessonCount}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

#### 3.4 Lesson View Page

```typescript
// app/(student)/my-courses/[courseId]/lessons/[lessonId]/page.tsx
'use client';

import { useGetLesson } from '@/hooks/useLessons';
import { useMarkLessonComplete } from '@/hooks/useLessons';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';

export default function LessonPage({
  params,
}: {
  params: { courseId: string; lessonId: string };
}) {
  const { data: lesson, isLoading } = useGetLesson(params.lessonId);
  const { mutate: markComplete } = useMarkLessonComplete();

  if (isLoading) return <div className="text-center py-12">Loading lesson...</div>;
  if (!lesson) return <div className="text-center py-12">Lesson not found</div>;

  const handleComplete = () => {
    markComplete({ lessonId: params.lessonId });
  };

  return (
    <div className="grid md:grid-cols-4 gap-8 max-w-7xl mx-auto py-12 px-4">
      {/* Main Content */}
      <div className="md:col-span-3">
        <h1 className="text-3xl font-bold mb-6">{lesson.title}</h1>

        {/* Video Player */}
        {lesson.contentType === 'video' && lesson.videoUrl && (
          <div className="aspect-video bg-black rounded-lg mb-8 overflow-hidden">
            <video
              controls
              className="w-full h-full"
              src={lesson.videoUrl}
            />
          </div>
        )}

        {/* Description */}
        <div className="prose max-w-none mb-8">
          <p>{lesson.description}</p>
        </div>

        {/* Resources */}
        {lesson.resources && lesson.resources.length > 0 && (
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-bold mb-4">Resources</h2>
            <div className="space-y-2">
              {lesson.resources.map((resource) => (
                <a
                  key={resource.id}
                  href={resource.url}
                  download
                  className="block p-3 bg-white border rounded hover:bg-gray-100"
                >
                  📥 {resource.name}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Mark Complete */}
        <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
          <Checkbox id="complete" onChange={handleComplete} />
          <label htmlFor="complete" className="text-lg">
            Mark as complete
          </label>
        </div>
      </div>

      {/* Sidebar - Course Outline */}
      <div className="bg-gray-50 p-6 rounded-lg h-fit sticky top-4">
        <h2 className="text-xl font-bold mb-4">Course Outline</h2>
        <div className="space-y-2">
          {/* Render all lessons in course */}
        </div>

        <div className="mt-8 flex gap-2">
          <Button variant="outline" className="flex-1">
            ← Previous
          </Button>
          <Button className="flex-1">
            Next →
          </Button>
        </div>
      </div>
    </div>
  );
}
```

### Phase 4: Admin Dashboard (Week 5-6)

#### 4.1 Admin Dashboard Home

```typescript
// app/(admin)/dashboard/page.tsx
'use client';

import { useGetDashboardStats } from '@/hooks/useAdmin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = useGetDashboardStats();

  if (isLoading) return <div className="text-center py-12">Loading dashboard...</div>;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-lg">
        <h1 className="text-3xl font-bold mb-2">Welcome, {stats?.teacherName}</h1>
        <p className="text-blue-100">Manage your courses and students from here</p>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <StatCard label="Total Courses" value={stats?.totalCourses} />
        <StatCard label="Total Students" value={stats?.totalStudents} />
        <StatCard label="Total Lessons" value={stats?.totalLessons} />
        <StatCard label="Total Videos" value={stats?.totalVideos} />
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-4">
        <Link href="/admin/courses/new">
          <Button className="w-full" size="lg">
            + Add New Course
          </Button>
        </Link>
        <Link href="/admin/lessons/new">
          <Button className="w-full" size="lg">
            + Add New Lesson
          </Button>
        </Link>
      </div>

      {/* Charts */}
      <Card>
        <CardHeader>
          <CardTitle>Enrollment Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats?.enrollmentTrend || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="enrollments" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Display recent activities */}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value?: number }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <p className="text-gray-600 text-sm font-medium">{label}</p>
        <p className="text-3xl font-bold mt-2">{value || 0}</p>
      </CardContent>
    </Card>
  );
}
```

#### 4.2 Add Course Page

```typescript
// app/(admin)/courses/new/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { courseSchema, type CourseInput } from '@/lib/validators';
import { useCreateCourse } from '@/hooks/useCourses';
import { useUploadFile } from '@/hooks/useUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';

const CATEGORIES = ['Physics', 'Chemistry', 'Math', 'SAT', 'AP'];
const AUDIENCES = ['JEE', 'NEET', 'MHT-CET', 'SAT', 'AP'];

export default function NewCoursePage() {
  const router = useRouter();
  const { mutate: createCourse, isPending } = useCreateCourse();
  const { mutate: uploadFile, isPending: isUploading } = useUploadFile();
  const [error, setError] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');

  const form = useForm<CourseInput>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      targetAudience: [],
      price: 0,
    },
  });

  const onSubmit = async (data: CourseInput) => {
    try {
      setError('');
      createCourse(
        {
          ...data,
          bannerUrl,
        },
        {
          onSuccess: () => {
            router.push('/admin/courses');
          },
        }
      );
    } catch (err) {
      setError('Failed to create course. Please try again.');
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      uploadFile(file, {
        onSuccess: (data) => {
          setBannerUrl(data.data.url);
        },
      });
    } catch (err) {
      setError('Failed to upload banner image');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Create New Course</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Course Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Title *
              </label>
              <Input
                {...form.register('title')}
                placeholder="e.g., JEE Mains Physics"
              />
              {form.formState.errors.title && (
                <p className="mt-1 text-sm text-red-500">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <Textarea
                {...form.register('description')}
                placeholder="Describe your course"
                rows={4}
              />
              {form.formState.errors.description && (
                <p className="mt-1 text-sm text-red-500">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <Select
                value={form.watch('category')}
                onValueChange={(value) =>
                  form.setValue('category', value as any)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.category && (
                <p className="mt-1 text-sm text-red-500">
                  {form.formState.errors.category.message}
                </p>
              )}
            </div>

            {/* Target Audience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Audience *
              </label>
              <div className="space-y-2">
                {AUDIENCES.map((audience) => (
                  <div key={audience} className="flex items-center">
                    <Checkbox
                      id={audience}
                      onChange={(checked) => {
                        const current = form.getValues('targetAudience');
                        if (checked) {
                          form.setValue('targetAudience', [...current, audience]);
                        } else {
                          form.setValue(
                            'targetAudience',
                            current.filter((a) => a !== audience)
                          );
                        }
                      }}
                    />
                    <label htmlFor={audience} className="ml-2 text-sm">
                      {audience}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Banner Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Banner Image
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBannerUpload}
                  disabled={isUploading}
                  className="w-full"
                />
                {isUploading && <p className="text-sm text-gray-500 mt-2">Uploading...</p>}
                {bannerUrl && <p className="text-sm text-green-600 mt-2">✓ Image uploaded</p>}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending || isUploading}>
                {isPending ? 'Creating...' : 'Create Course'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
```

#### 4.3 Manage Courses Page

```typescript
// app/(admin)/courses/page.tsx
'use client';

import { useGetCourses } from '@/hooks/useCourses';
import { useDeleteCourse } from '@/hooks/useCourses';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function CoursesPage() {
  const { data: courses = [], isLoading } = useGetCourses();
  const { mutate: deleteCourse } = useDeleteCourse();
  const [search, setSearch] = useState('');

  const filtered = courses.filter((course) =>
    course.title.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      header: 'Title',
      accessorKey: 'title',
    },
    {
      header: 'Category',
      accessorKey: 'category',
    },
    {
      header: 'Students',
      accessorKey: 'enrollmentCount',
    },
    {
      header: 'Lessons',
      accessorKey: 'lessonCount',
    },
    {
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Link href={`/admin/courses/${row.original.id}/lessons`}>
            <Button size="sm" variant="outline">
              Manage
            </Button>
          </Link>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" variant="destructive">
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the course and all its lessons.
              </AlertDialogDescription>
              <div className="flex gap-2 justify-end">
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => deleteCourse(row.original.id)}
                  className="bg-red-600"
                >
                  Delete
                </AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Courses</h1>
        <Link href="/admin/courses/new">
          <Button>+ Add Course</Button>
        </Link>
      </div>

      <Input
        placeholder="Search courses..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      {isLoading ? (
        <div className="text-center py-12">Loading courses...</div>
      ) : (
        <DataTable columns={columns} data={filtered} />
      )}
    </div>
  );
}
```

#### 4.4 Manage Lessons Page

```typescript
// app/(admin)/courses/[id]/lessons/page.tsx
'use client';

import { useGetCourseLessons, useCreateLesson, useDeleteLesson } from '@/hooks/useLessons';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ManageLessonsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: lessons = [], isLoading } = useGetCourseLessons(params.id);
  const { mutate: deleteLesson } = useDeleteLesson();

  if (isLoading) return <div className="text-center py-12">Loading lessons...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manage Lessons</h1>
        <Link href={`/admin/courses/${params.id}/lessons/new`}>
          <Button>+ Add Lesson</Button>
        </Link>
      </div>

      {lessons.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No lessons yet. Create your first lesson!
        </div>
      ) : (
        <div className="space-y-2">
          {lessons.map((lesson, index) => (
            <div key={lesson.id} className="p-4 border rounded-lg flex justify-between items-center">
              <div>
                <p className="font-semibold">{index + 1}. {lesson.title}</p>
                <p className="text-sm text-gray-500">{lesson.contentType}</p>
              </div>
              <div className="flex gap-2">
                <Link href={`/admin/courses/${params.id}/lessons/${lesson.id}/edit`}>
                  <Button size="sm" variant="outline">
                    Edit
                  </Button>
                </Link>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteLesson(lesson.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### Phase 5: Advanced Features & Polish (Week 7-8)

#### 5.1 Add Reusable Components Library

Create a components library using Shadcn/UI:

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add card
npx shadcn-ui@latest add alert
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add select
npx shadcn-ui@latest add data-table
```

#### 5.2 Add Toast Notifications

```bash
npm install sonner
```

```typescript
// app/layout.tsx
import { Toaster } from 'sonner';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
```

#### 5.3 Implement File Upload Progress

```typescript
// components/FileUpload.tsx
'use client';

import { useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { useUploadFile } from '@/hooks/useUpload';

export function FileUpload() {
  const [progress, setProgress] = useState(0);
  const { mutate: upload } = useUploadFile();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + Math.random() * 30;
      });
    }, 200);

    upload(file, {
      onSuccess: () => {
        setProgress(100);
        setTimeout(() => setProgress(0), 1000);
      },
    });
  };

  return (
    <div>
      <input type="file" onChange={handleFileSelect} />
      {progress > 0 && <Progress value={progress} className="mt-2" />}
    </div>
  );
}
```

---

## Key Integration Points Checklist

- [x] **Authentication**
  - [x] Supabase Auth setup complete
  - [x] JWT token handling working
  - [x] Login/Signup pages functional
  - [x] Protected routes implemented

- [x] **API Integration**
  - [x] API client configured with axios
  - [x] TanStack Query hooks set up for all endpoints
  - [x] Request interceptors (JWT token injection)
  - [x] Response interceptors (token refresh)

- [x] **Admin Dashboard**
  - [x] Dashboard home with stats
  - [x] Add/Edit/Delete courses
  - [x] Add/Edit/Delete lessons
  - [x] Upload videos and notes
  - [x] View students and enrollments

- [x] **Student Portal**
  - [x] Homepage with featured courses
  - [x] Browse and search courses
  - [x] Course enrollment
  - [x] Lesson viewing with video player
  - [x] Download materials
  - [x] Progress tracking

- [x] **Security**
  - [x] Input validation with Zod
  - [x] Role-based access control
  - [x] Protected API routes
  - [x] HTTPS enforcement
  - [x] CORS configured

- [x] **Testing**
  - [x] Unit tests for components
  - [x] Integration tests for flows
  - [x] E2E tests for critical paths
  - [x] Security tests for inputs

- [x] **Deployment**
  - [x] Frontend deployed to Vercel
  - [x] Backend deployed to Render/Railway
  - [x] Environment variables configured
  - [x] Database migrations run
  - [x] DNS configured

---

## Common Pitfalls & Solutions

### 1. **CORS Errors**
**Problem**: Frontend can't access backend API
**Solution**: 
```typescript
// Backend: Configure CORS in Express
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
```

### 2. **JWT Token Expiration**
**Problem**: Users get logged out unexpectedly
**Solution**: Implement token refresh before expiration
```typescript
// Check token expiration on app load
if (isTokenExpired(token)) {
  await refreshToken();
}
```

### 3. **Large File Uploads Timeout**
**Problem**: Video uploads fail for large files
**Solution**: Implement chunked upload or use Supabase Storage directly

### 4. **Mobile Responsiveness Issues**
**Problem**: Admin dashboard not working on tablets
**Solution**: Test on actual devices and use Tailwind's responsive classes

### 5. **SEO for Student Portal**
**Problem**: Courses not indexed by search engines
**Solution**: Add metadata and sitemap
```typescript
// app/layout.tsx
export const metadata: Metadata = {
  title: 'JEE & NEET Tutoring Platform',
  description: 'Learn Physics, Chemistry, Math for JEE, NEET, SAT',
  openGraph: {
    title: 'JEE & NEET Tutoring Platform',
    description: 'Online tutoring for competitive exams',
  },
};
```

---

## Next Steps

1. **Week 1-2**: Set up project, authentication, basic API integration
2. **Week 3-4**: Build student portal (courses, lessons, enrollment)
3. **Week 5-6**: Build admin dashboard (course management, uploads)
4. **Week 7-8**: Polish, testing, security hardening, deployment
5. **Week 9+**: Monitor, gather feedback, plan Phase 2 features (messaging, progress tracking, analytics)

---

## Future Enhancements (Phase 2)

- [ ] Real-time notifications (new course, quiz results)
- [ ] Student messaging system (students can ask doubts)
- [ ] Quiz/test functionality with auto-grading
- [ ] Progress tracking and certificates
- [ ] Payment integration for premium courses
- [ ] Mobile app (React Native)
- [ ] AI-powered Q&A chatbot
- [ ] Leaderboards and gamification
- [ ] Analytics dashboard for teacher
- [ ] Batch operations (bulk upload, bulk enrollment)

---

## Conclusion

This comprehensive plan provides a complete roadmap for building your tutoring platform. Follow the phases sequentially, and you'll have a production-ready, secure, and user-friendly platform by Week 8. The focus on simplicity ensures your non-technical teacher can manage the platform with minimal friction, while the student portal provides an engaging learning experience.

Good luck! 🚀
