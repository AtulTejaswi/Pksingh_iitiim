import { prisma } from '../../config/db';
import { parseYoutubeFeed, youtubeChannelFeedUrl } from '../../utils/youtubeRss';
import { autoBackup } from '../backup/backup.controller';

// The course that receives imported videos. Defaults to the "JEE is EASY"
// free series; override with YT_SYNC_COURSE_ID for a different course.
export const DEFAULT_SYNC_COURSE_TITLE = 'JEE is EASY — Free YouTube Series';

// The channel whose feed we watch. Defaults to the PKSir Classes channel.
export const DEFAULT_CHANNEL_ID = 'UCoL6GcVx5mTw6FQE0sY5PrQ';

export interface SyncResult {
  checked: number;
  added: number;
  skipped: number;
  failed: number;
  courseId: string | null;
  channelId: string;
  /** Thumbnail the course was refreshed to (newest channel video). */
  thumbnail: string | null;
  errors: string[];
}

export interface FeedVideo {
  videoId: string;
  title: string;
  url: string;
  published: string;
}

/** Standard YouTube thumbnail URL for a video ID (used by the frontend too). */
export function youtubeThumbnailUrl(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

/** The newest video in a feed, by published date (feeds are newest-first, but don't rely on it). */
export function newestFeedVideo(feed: FeedVideo[]): FeedVideo | null {
  if (feed.length === 0) return null;
  return [...feed].sort((a, b) => b.published.localeCompare(a.published))[0];
}

async function fetchChannelFeed(channelId: string, timeoutMs = 20000): Promise<FeedVideo[]> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(youtubeChannelFeedUrl(channelId), { signal: controller.signal });
    if (!res.ok) {
      throw new Error(`YouTube feed returned HTTP ${res.status}`);
    }
    const xml = await res.text();
    return parseYoutubeFeed(xml);
  } finally {
    clearTimeout(timer);
  }
}

/** Find the target course: by env override, else by title. */
async function findTargetCourse(): Promise<{ id: string; title: string } | null> {
  const override = process.env.YT_SYNC_COURSE_ID;
  if (override) {
    const course = await prisma.course.findUnique({ where: { id: override }, select: { id: true, title: true } });
    return course;
  }
  return prisma.course.findFirst({
    where: { title: DEFAULT_SYNC_COURSE_TITLE },
    select: { id: true, title: true },
  });
}

/**
 * Which videos to import, in INSERTION order. The feed is newest-first, but
 * each import shifts existing lessons down and inserts at sortOrder 0 — so
 * importing oldest-first means every newer video pushes the previous one
 * down and the final syllabus is newest-first (matching the thumbnail).
 */
export function videosToImport(feed: FeedVideo[], existing: Set<string>): FeedVideo[] {
  return feed.filter((v) => !existing.has(v.videoId)).reverse();
}

/** Existing YouTube video IDs already attached anywhere in the course. */
async function existingYouTubeIdsInCourse(courseId: string): Promise<Set<string>> {
  const lessons = await prisma.lesson.findMany({
    where: { courseId },
    select: { media: { include: { mediaAsset: true } } },
  });
  const ids = new Set<string>();
  for (const lesson of lessons) {
    for (const lm of lesson.media) {
      const url = lm.mediaAsset?.url || '';
      const match = /[?&]v=([A-Za-z0-9_-]{11})/.exec(url);
      if (match) ids.add(match[1]);
    }
  }
  return ids;
}

/**
 * Shift every lesson in a course down one slot so the newest video can sit
 * at the top (sortOrder 0), matching the thumbnail which also points at the
 * newest channel video. The shift is atomic per new lesson.
 */
async function shiftLessonsDown(courseId: string): Promise<void> {
  await prisma.lesson.updateMany({
    where: { courseId },
    data: { sortOrder: { increment: 1 } },
  });
}

/**
 * Sync the channel feed into the target course. Idempotent: videos whose ID
 * is already attached to any lesson in the course are skipped. New videos
 * become a free, published lesson with the YouTube link attached, inserted
 * at the TOP of the syllabus (sortOrder 0, everything else shifts down) so
 * the newest lecture is the first thing a student sees.
 */
export async function syncYouTubeChannel(): Promise<SyncResult> {
  const channelId = process.env.YT_SYNC_CHANNEL_ID || DEFAULT_CHANNEL_ID;
  const result: SyncResult = { checked: 0, added: 0, skipped: 0, failed: 0, courseId: null, channelId, thumbnail: null, errors: [] };

  const feed = await fetchChannelFeed(channelId);
  result.checked = feed.length;
  if (feed.length === 0) {
    result.errors.push('The channel feed returned no videos — is the channel ID correct?');
    return result;
  }

  const course = await findTargetCourse();
  if (!course) {
    result.errors.push(
      `No target course found (looking for "${DEFAULT_SYNC_COURSE_TITLE}", or set YT_SYNC_COURSE_ID).`
    );
    return result;
  }
  result.courseId = course.id;

  const existing = await existingYouTubeIdsInCourse(course.id);

  // Oldest new video first: each newer video shifts the previous down, so
  // the syllabus ends up newest-first throughout.
  const toImport = videosToImport(feed, existing);
  result.skipped = feed.length - toImport.length;
  for (const video of toImport) {
    try {
      const title = cleanLessonTitle(video.title);
      // Newest first: shift every existing lesson down so the new video sits
      // at the top of the syllabus.
      await shiftLessonsDown(course.id);
      const lesson = await prisma.lesson.create({
        data: {
          courseId: course.id,
          title,
          description: 'YouTube lecture from the JEE is EASY series (PKSir Classes). Press play to watch — free for everyone.',
          isFree: true,
          status: 'PUBLISHED',
          sortOrder: 0,
        },
      });
      const asset = await prisma.mediaAsset.create({
        data: {
          title: `Watch on YouTube — ${title}`,
          type: 'YOUTUBE_LINK',
          url: video.url,
          folder: '/',
        },
      });
      await prisma.lessonMedia.create({
        data: { lessonId: lesson.id, mediaAssetId: asset.id, sortOrder: 0 },
      });
      result.added++;
      existing.add(video.videoId); // avoid re-processing within the same run
    } catch (err: any) {
      result.failed++;
      result.errors.push(`${video.videoId}: ${err.message || 'unknown error'}`);
    }
  }

  // Always refresh the course thumbnail to the newest channel video, so the
  // homepage/catalog cards show the latest lecture even when nothing new was
  // imported this run.
  const newest = newestFeedVideo(feed);
  if (newest) {
    try {
      const thumb = youtubeThumbnailUrl(newest.videoId);
      await prisma.course.update({
        where: { id: course.id },
        data: { thumbnailUrl: thumb },
      });
      result.thumbnail = thumb;
    } catch (err: any) {
      result.errors.push(`thumbnail update failed: ${err.message || 'unknown error'}`);
    }
  }

  if (result.added > 0) autoBackup();
  return result;
}

/**
 * Make a lesson title in the same style as the existing course lessons:
 * "P00012 — Electromagnetic Waves". Extracts the series number if present,
 * strips the "PKSir..." / "JEE is EASY" branding, and collapses whitespace.
 */
export function cleanLessonTitle(raw: string): string {
  const trimmed = raw.trim().replace(/\s+/g, ' ');
  const numberMatch = /P(\d{2,})/i.exec(trimmed);
  const num = numberMatch ? `P${numberMatch[1]}` : null;
  // Remove the leading brand prefix, whatever form it takes.
  let core = trimmed.replace(/^PKSir(?:_IITIIM)?[ _]?/i, '');
  // Drop the series number wherever it appears (start or middle).
  core = core.replace(/P\d{2,}/gi, '');
  // Drop repeated "JEE is EASY" branding and series labels.
  core = core
    .replace(/JEE is EASY Series\s*[:–-]?\s*/gi, '')
    .replace(/JEE is EASY\s*[:–-]?\s*/gi, '')
    .replace(/[\s:–-]+/g, ' ')
    .trim();
  if (!core) core = trimmed.replace(/^PKSir(?:_IITIIM)?[ _]?/i, '').replace(/P\d{2,}/gi, '').trim();
  return num ? `${num} — ${core}` : core;
}
