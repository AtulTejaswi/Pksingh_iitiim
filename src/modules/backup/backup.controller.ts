import { Request, Response } from 'express';
import { prisma } from '../../config/db';
import { supabase } from '../../config/supabase';
import fs from 'fs';
import path from 'path';

const BACKUPS_DIR = path.join(process.cwd(), 'backups');
const SUPABASE_BACKUP_BUCKET = 'backups';

function ensureDir() {
  if (!fs.existsSync(BACKUPS_DIR)) {
    fs.mkdirSync(BACKUPS_DIR, { recursive: true });
  }
}

function backupFilePath(name?: string) {
  ensureDir();
  const filename = name || `backup-${Date.now()}.json`;
  return path.join(BACKUPS_DIR, filename);
}

function listBackupFiles(): string[] {
  ensureDir();
  return fs.readdirSync(BACKUPS_DIR)
    .filter(f => f.endsWith('.json'))
    .sort()
    .reverse();
}

interface BackupData {
  exportedAt: string;
  version: string;
  users: any[];
  courses: any[];
  lessons: any[];
  mediaAssets: any[];
  lessonMedia: any[];
  notes: any[];
  enrollments: any[];
  lessonProgress: any[];
  categories: any[];
  tags: any[];
  courseTags: any[];
  pages: any[];
  pageSections: any[];
  blogs: any[];
  blogTags: any[];
  announcements: any[];
  faqs: any[];
  testimonials: any[];
  events: any[];
  studentQueries: any[];
  queryReplies: any[];
  certificates: any[];
  reviews: any[];
  auditLogs: any[];
}

async function exportAllData(): Promise<BackupData> {
  const [
    users, courses, lessons, mediaAssets, lessonMedia, notes,
    enrollments, lessonProgress, categories, tags, courseTags,
    pages, pageSections, blogs, blogTags, announcements, faqs,
    testimonials, events, studentQueries, queryReplies, certificates,
    reviews, auditLogs,
  ] = await Promise.all([
    prisma.user.findMany(),
    prisma.course.findMany(),
    prisma.lesson.findMany(),
    prisma.mediaAsset.findMany(),
    prisma.lessonMedia.findMany(),
    prisma.note.findMany(),
    prisma.enrollment.findMany(),
    prisma.lessonProgress.findMany(),
    prisma.category.findMany(),
    prisma.tag.findMany(),
    prisma.courseTag.findMany(),
    prisma.page.findMany(),
    prisma.pageSection.findMany(),
    prisma.blog.findMany(),
    prisma.blogTag.findMany(),
    prisma.announcement.findMany(),
    prisma.fAQ.findMany(),
    prisma.testimonial.findMany(),
    prisma.event.findMany(),
    prisma.studentQuery.findMany(),
    prisma.queryReply.findMany(),
    prisma.certificate.findMany(),
    prisma.review.findMany(),
    prisma.auditLog.findMany(),
  ]);

  return {
    exportedAt: new Date().toISOString(),
    version: '1.0',
    users, courses, lessons, mediaAssets, lessonMedia, notes,
    enrollments, lessonProgress, categories, tags, courseTags,
    pages, pageSections, blogs, blogTags, announcements, faqs,
    testimonials, events, studentQueries, queryReplies, certificates,
    reviews, auditLogs,
  };
}

async function importAllData(data: BackupData): Promise<void> {
  // Delete existing data in reverse dependency order
  await prisma.auditLog.deleteMany();
  await prisma.queryReply.deleteMany();
  await prisma.studentQuery.deleteMany();
  await prisma.review.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.lessonProgress.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.note.deleteMany();
  await prisma.lessonMedia.deleteMany();
  await prisma.mediaAsset.deleteMany();
  await prisma.blogTag.deleteMany();
  await prisma.blog.deleteMany();
  await prisma.pageSection.deleteMany();
  await prisma.page.deleteMany();
  await prisma.courseTag.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.course.deleteMany();
  await prisma.category.deleteMany();
  await prisma.event.deleteMany();
    await prisma.fAQ.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.user.deleteMany();

  // Re-import all data in dependency order
  const tables: { model: any; name: string }[] = [
    { model: prisma.user, name: 'users' },
    { model: prisma.category, name: 'categories' },
    { model: prisma.tag, name: 'tags' },
    { model: prisma.course, name: 'courses' },
    { model: prisma.courseTag, name: 'courseTags' },
    { model: prisma.lesson, name: 'lessons' },
    { model: prisma.mediaAsset, name: 'mediaAssets' },
    { model: prisma.lessonMedia, name: 'lessonMedia' },
    { model: prisma.note, name: 'notes' },
    { model: prisma.enrollment, name: 'enrollments' },
    { model: prisma.lessonProgress, name: 'lessonProgress' },
    { model: prisma.page, name: 'pages' },
    { model: prisma.pageSection, name: 'pageSections' },
    { model: prisma.blog, name: 'blogs' },
    { model: prisma.blogTag, name: 'blogTags' },
    { model: prisma.announcement, name: 'announcements' },
    { model: prisma.fAQ, name: 'faqs' },
    { model: prisma.testimonial, name: 'testimonials' },
    { model: prisma.event, name: 'events' },
    { model: prisma.studentQuery, name: 'studentQueries' },
    { model: prisma.queryReply, name: 'queryReplies' },
    { model: prisma.certificate, name: 'certificates' },
    { model: prisma.review, name: 'reviews' },
    { model: prisma.auditLog, name: 'auditLogs' },
  ];

  for (const { model, name } of tables) {
    const rows = (data as any)[name];
    if (rows && rows.length > 0) {
      await (model as any).createMany({ data: rows });
    }
  }
}

async function uploadToSupabaseStorage(filename: string, content: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.storage
      .from(SUPABASE_BACKUP_BUCKET)
      .upload(filename, content, {
        contentType: 'application/json',
        upsert: true,
      });
    if (error) {
      console.warn('Supabase backup upload failed:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase backup upload error:', err);
    return false;
  }
}

async function downloadFromSupabaseStorage(filename: string): Promise<string | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.storage
      .from(SUPABASE_BACKUP_BUCKET)
      .download(filename);
    if (error || !data) return null;
    return await data.text();
  } catch {
    return null;
  }
}

async function listSupabaseBackups(): Promise<string[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase.storage
      .from(SUPABASE_BACKUP_BUCKET)
      .list('', { limit: 1000 });
    if (error || !data) return [];
    return data.map(f => f.name).filter(n => n.endsWith('.json')).sort().reverse();
  } catch {
    return [];
  }
}

export async function autoBackup(): Promise<string | null> {
  try {
    const count = await prisma.course.count();
    if (count === 0) return null;
    const data = await exportAllData();
    const json = JSON.stringify(data, null, 2);
    const filename = path.basename(backupFilePath());
    fs.writeFileSync(path.join(BACKUPS_DIR, filename), json, 'utf-8');
    await uploadToSupabaseStorage(filename, json);
    return path.join(BACKUPS_DIR, filename);
  } catch {
    return null;
  }
}

export async function tryAutoRestore(): Promise<boolean> {
  const existingCourses = await prisma.course.count();
  if (existingCourses > 0) return false;

  // Try Supabase Storage first (persistent)
  const remoteFiles = await listSupabaseBackups();
  if (remoteFiles.length > 0) {
    const content = await downloadFromSupabaseStorage(remoteFiles[0]);
    if (content) {
      try {
        const data = JSON.parse(content) as BackupData;
        if (data.courses && data.courses.length > 0) {
          await importAllData(data);
          console.log(`Auto-restored from Supabase backup: ${remoteFiles[0]} (${data.courses.length} courses)`);
          return true;
        }
      } catch (err) {
        console.error('Supabase auto-restore failed:', err);
      }
    }
  }

  // Fallback to local file (only useful on same container instance)
  const files = listBackupFiles();
  if (files.length === 0) return false;

  const latest = files[0];
  try {
    const raw = fs.readFileSync(path.join(BACKUPS_DIR, latest), 'utf-8');
    const data = JSON.parse(raw) as BackupData;
    if (!data.courses || data.courses.length === 0) return false;

    await importAllData(data);
    console.log(`Auto-restored from local backup: ${latest} (${data.courses.length} courses)`);
    return true;
  } catch (err) {
    console.error('Auto-restore failed:', err);
    return false;
  }
}

export const exportBackup = async (_req: Request, res: Response) => {
  try {
    const data = await exportAllData();
    const json = JSON.stringify(data, null, 2);
    const filename = path.basename(backupFilePath());
    fs.writeFileSync(path.join(BACKUPS_DIR, filename), json, 'utf-8');
    const uploaded = await uploadToSupabaseStorage(filename, json);
    res.json({
      success: true,
      message: uploaded ? 'Backup exported (local + Supabase Storage)' : 'Backup exported (local only)',
      file: filename,
      cloud: uploaded,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Export failed' });
  }
};

export const importBackup = async (req: Request, res: Response) => {
  try {
    const { filename } = req.body;
    if (!filename) {
      return res.status(400).json({ error: 'filename is required' });
    }
    const filePath = path.join(BACKUPS_DIR, path.basename(filename));
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Backup file not found' });
    }
    const raw = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(raw) as BackupData;
    await importAllData(data);
    res.json({ success: true, message: `Restored from ${filename}` });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Import failed' });
  }
};

export const listBackups = async (_req: Request, res: Response) => {
  try {
    const files = listBackupFiles();
    const backups = files.map(f => {
      const filePath = path.join(BACKUPS_DIR, f);
      const stat = fs.statSync(filePath);
      return { filename: f, size: stat.size, createdAt: stat.birthtime.toISOString() };
    });
    res.json({ success: true, backups });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to list backups' });
  }
};

export const downloadBackup = async (req: Request, res: Response) => {
  const filename = req.params.filename;
  if (!filename) {
    return res.status(400).json({ error: 'filename is required' });
  }
  const safeName = path.basename(filename as string);
  const filePath = path.join(BACKUPS_DIR, safeName);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Backup not found' });
  }
  res.download(filePath);
};
