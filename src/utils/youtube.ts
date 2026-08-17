/**
 * YouTube URL helpers.
 *
 * A single source of truth for turning any YouTube link (watch?v=, youtu.be,
 * shorts, embed, live) into a canonical video URL / video ID. Used by the
 * media controller to VALIDATE links before they're attached, so a
 * non-technical owner can't paste a channel or playlist URL and end up with a
 * broken player on the lesson page.
 */

const YOUTUBE_ID_PATTERN =
  /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?|shorts|live)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/i;

/** True when the URL points at youtube.com or youtu.be at all. */
export function isYouTubeUrl(url: string): boolean {
  const trimmed = url.trim();
  // Strip the scheme (and optional www./m.) so both
  // "https://www.youtube.com/..." and "youtu.be/abc" work.
  const withoutScheme = trimmed.replace(/^[a-z][a-z0-9+.-]*:\/\//i, '').replace(/^www\./i, '');
  const host = withoutScheme.split(/[/?#]/, 1)[0].toLowerCase();
  return host === 'youtube.com' || host === 'youtu.be' || host.endsWith('.youtube.com') || host.endsWith('.youtu.be');
}

/**
 * Extract the 11-character video ID from any common YouTube link form.
 * Returns null when the URL is YouTube-ish but is not a single video
 * (e.g. a channel, playlist, or search page).
 */
export function extractYouTubeVideoId(url: string): string | null {
  if (!isYouTubeUrl(url)) return null;
  const match = url.match(YOUTUBE_ID_PATTERN);
  return match && match[1] ? match[1] : null;
}

/**
 * Canonical "watch" URL for a video ID — the form the student player stores.
 * Preserves an optional start-time (`t=` or `start=` seconds).
 */
export function canonicalYouTubeWatchUrl(url: string): string | null {
  const id = extractYouTubeVideoId(url);
  if (!id) return null;
  let start = '';
  const tMatch = url.match(/[?&](?:t|start)=(\d+)/i);
  if (tMatch && tMatch[1]) start = `?start=${tMatch[1]}`;
  return `https://www.youtube.com/watch?v=${id}${start}`;
}

/**
 * Human-readable reason why a YouTube-ish URL is not a single video, for the
 * friendly 400 response. Only meaningful when isYouTubeUrl(url) is true.
 */
export function youTubeLinkError(url: string): string {
  if (/youtube\.com\/@|youtube\.com\/c\/|youtube\.com\/channel\//i.test(url)) {
    return 'That looks like a YouTube channel, not a single video. Open the video you want, copy its link (Share → Copy link), and paste that here.';
  }
  if (/youtube\.com\/playlist\?/i.test(url)) {
    return 'That looks like a YouTube playlist, not a single video. Open the individual video you want, copy its link, and paste that here.';
  }
  if (/youtube\.com\/results\?/i.test(url)) {
    return 'That looks like a YouTube search page, not a single video. Open the video you want and paste its link here.';
  }
  return 'We couldn\u2019t find a single video in that link. Open the video on YouTube, click Share → Copy link, and paste it here (it looks like https://youtu.be/XXXXXXXXXXX).';
}
