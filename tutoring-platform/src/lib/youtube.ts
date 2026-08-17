/**
 * YouTube URL helpers shared across the frontend (admin preview, student
 * player). Mirrors src/utils/youtube.ts on the backend so the "is this a
 * valid video?" check the owner sees in the admin panel matches what the
 * student player actually renders.
 */

const YOUTUBE_ID_PATTERN =
  /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?|shorts|live)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/i;

export function isYouTubeUrl(url: string): boolean {
  const trimmed = url.trim();
  const withoutScheme = trimmed.replace(/^[a-z][a-z0-9+.-]*:\/\//i, '').replace(/^www\./i, '');
  const host = withoutScheme.split(/[/?#]/, 1)[0].toLowerCase();
  return host === 'youtube.com' || host === 'youtu.be' || host.endsWith('.youtube.com') || host.endsWith('.youtu.be');
}

/** Extract the 11-char video ID, or null if the URL isn't a single video. */
export function extractYouTubeVideoId(url: string): string | null {
  if (!isYouTubeUrl(url)) return null;
  const match = url.match(YOUTUBE_ID_PATTERN);
  return match && match[1] ? match[1] : null;
}

/** Embed URL for the student player (preserves an optional start time). */
export function getYouTubeEmbedUrl(url: string): string | null {
  const id = extractYouTubeVideoId(url);
  if (!id) return null;
  let start = '';
  const tMatch = url.match(/[?&](?:t|start)=(\d+)/i);
  if (tMatch && tMatch[1]) start = `?start=${tMatch[1]}`;
  return `https://www.youtube.com/embed/${id}${start}`;
}

/** Thumbnail URL for admin-panel previews. */
export function getYouTubeThumbnailUrl(url: string): string | null {
  const id = extractYouTubeVideoId(url);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
}
