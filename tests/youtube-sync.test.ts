import { parseYoutubeFeed, youtubeChannelFeedUrl } from '../src/utils/youtubeRss';
import {
  cleanLessonTitle,
  newestFeedVideo,
  youtubeThumbnailUrl,
} from '../src/modules/youtube-sync/youtube-sync.service';

const SAMPLE_FEED = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns:yt="http://www.youtube.com/xml/schemas/2015" xmlns:media="http://search.yahoo.com/mrss/" xmlns="http://www.w3.org/2005/Atom">
  <link rel="self" href="https://www.youtube.com/feeds/videos.xml?channel_id=UCoL6GcVx5mTw6FQE0sY5PrQ"/>
  <title>PKSir Classes</title>
  <entry>
    <id>yt:video:K3SygMtY0qA</id>
    <yt:videoId>K3SygMtY0qA</yt:videoId>
    <title>PKSir_IITIIM_P00019 Gravitation JEE Mains 2026</title>
    <published>2026-08-16T10:00:00+00:00</published>
  </entry>
  <entry>
    <id>yt:video:abcdefgh123</id>
    <yt:videoId>abcdefgh123</yt:videoId>
    <title>PKSir P00020: Electric Charges</title>
    <published>2026-08-17T10:00:00+00:00</published>
  </entry>
</feed>`;

describe('youtubeRss parser', () => {
  it('parses videoId, title and url from a feed', () => {
    const entries = parseYoutubeFeed(SAMPLE_FEED);
    expect(entries).toHaveLength(2);
    expect(entries[0]).toEqual({
      videoId: 'K3SygMtY0qA',
      title: 'PKSir_IITIIM_P00019 Gravitation JEE Mains 2026',
      published: '2026-08-16T10:00:00+00:00',
      url: 'https://www.youtube.com/watch?v=K3SygMtY0qA',
    });
    expect(entries[1].videoId).toBe('abcdefgh123');
  });

  it('returns [] for empty/garbage input', () => {
    expect(parseYoutubeFeed('')).toEqual([]);
    expect(parseYoutubeFeed('<html>no entries</html>')).toEqual([]);
  });

  it('builds the feed URL with the channel id encoded', () => {
    expect(youtubeChannelFeedUrl('UCoL6GcVx5mTw6FQE0sY5PrQ')).toBe(
      'https://www.youtube.com/feeds/videos.xml?channel_id=UCoL6GcVx5mTw6FQE0sY5PrQ'
    );
  });
});

describe('cleanLessonTitle', () => {
  it('strips the PKSir prefix and branding into P000XX — Topic form', () => {
    expect(cleanLessonTitle('PKSir_IITIIM_P00019 Gravitation JEE Mains 2026')).toBe(
      'P00019 — Gravitation JEE Mains 2026'
    );
    expect(cleanLessonTitle('PKSir_P00005: Rotational Dynamics')).toBe('P00005 — Rotational Dynamics');
    expect(cleanLessonTitle('PKSir P00007: Nuclear Physics')).toBe('P00007 — Nuclear Physics');
  });

  it('drops repeated JEE is EASY branding', () => {
    expect(cleanLessonTitle('PKSir_IITIIM_P00015  EM Waves  JEE is EASY Series')).toBe(
      'P00015 — EM Waves'
    );
    expect(cleanLessonTitle('PKSir_IITIIM_P00014 JEE is EASY Series - Electromagnetic Waves')).toBe(
      'P00014 — Electromagnetic Waves'
    );
  });

  it('handles odd orderings (P-number not at the start)', () => {
    expect(cleanLessonTitle('PKSir_IITIIM_JEE is EASY P00012 Electromagnetic Waves')).toBe(
      'P00012 — Electromagnetic Waves'
    );
  });

  it('passes through plain titles unchanged-ish', () => {
    expect(cleanLessonTitle('Introduction to Physics')).toBe('Introduction to Physics');
  });
});

describe('youtubeThumbnailUrl / newestFeedVideo', () => {
  it('builds the standard hqdefault thumbnail URL', () => {
    expect(youtubeThumbnailUrl('riDMZTqqmLk')).toBe('https://i.ytimg.com/vi/riDMZTqqmLk/hqdefault.jpg');
  });

  it('picks the newest video by published date regardless of feed order', () => {
    const feed = [
      { videoId: 'older1', title: 'Old', url: 'u', published: '2026-08-10T10:00:00+00:00' },
      { videoId: 'newest1', title: 'New', url: 'u', published: '2026-08-18T10:00:00+00:00' },
      { videoId: 'mid1', title: 'Mid', url: 'u', published: '2026-08-15T10:00:00+00:00' },
    ];
    expect(newestFeedVideo(feed)?.videoId).toBe('newest1');
  });

  it('returns null for an empty feed', () => {
    expect(newestFeedVideo([])).toBeNull();
  });
});
