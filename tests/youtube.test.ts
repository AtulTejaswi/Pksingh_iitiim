import {
  isYouTubeUrl,
  extractYouTubeVideoId,
  canonicalYouTubeWatchUrl,
  youTubeLinkError,
} from '../src/utils/youtube';

describe('youtube helpers', () => {
  it('detects YouTube domains', () => {
    expect(isYouTubeUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe(true);
    expect(isYouTubeUrl('https://youtu.be/dQw4w9WgXcQ')).toBe(true);
    expect(isYouTubeUrl('https://example.com/video')).toBe(false);
    expect(isYouTubeUrl('https://notyoutube.com')).toBe(false);
  });

  it('extracts the video id from every common link form', () => {
    expect(extractYouTubeVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
    expect(extractYouTubeVideoId('https://youtu.be/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
    expect(extractYouTubeVideoId('https://youtube.com/shorts/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
    expect(extractYouTubeVideoId('https://www.youtube.com/embed/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
    expect(extractYouTubeVideoId('https://www.youtube.com/live/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
    expect(extractYouTubeVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=42s')).toBe('dQw4w9WgXcQ');
    expect(extractYouTubeVideoId('https://m.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
    expect(extractYouTubeVideoId('https://youtube.com/v/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
  });

  it('returns null for non-video YouTube pages (channel/playlist/search)', () => {
    expect(extractYouTubeVideoId('https://www.youtube.com/@pksir_iitiim')).toBeNull();
    expect(extractYouTubeVideoId('https://www.youtube.com/channel/UC12345')).toBeNull();
    expect(extractYouTubeVideoId('https://www.youtube.com/playlist?list=PL12345')).toBeNull();
    expect(extractYouTubeVideoId('https://www.youtube.com/results?search_query=jee')).toBeNull();
    expect(extractYouTubeVideoId('https://www.youtube.com')).toBeNull();
    expect(extractYouTubeVideoId('https://example.com/watch?v=dQw4w9WgXcQ')).toBeNull();
  });

  it('builds a canonical watch url and preserves start time', () => {
    expect(canonicalYouTubeWatchUrl('https://youtu.be/dQw4w9WgXcQ')).toBe(
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    );
    expect(canonicalYouTubeWatchUrl('https://youtube.com/shorts/dQw4w9WgXcQ')).toBe(
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    );
    expect(canonicalYouTubeWatchUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=90')).toBe(
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ?start=90'
    );
    expect(canonicalYouTubeWatchUrl('https://www.youtube.com/@channel')).toBeNull();
  });

  it('explains non-video links in plain English', () => {
    expect(youTubeLinkError('https://www.youtube.com/@pksir_iitiim')).toMatch(/channel/i);
    expect(youTubeLinkError('https://www.youtube.com/playlist?list=PL1')).toMatch(/playlist/i);
    expect(youTubeLinkError('https://www.youtube.com/results?search_query=x')).toMatch(/search/i);
    expect(youTubeLinkError('https://www.youtube.com/')).toMatch(/single video/i);
  });
});
