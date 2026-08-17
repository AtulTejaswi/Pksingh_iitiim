/**
 * YouTube channel RSS feed parser.
 *
 * YouTube exposes every channel's latest ~15 videos as a public RSS feed at
 * https://www.youtube.com/feeds/videos.xml?channel_id=UC... — no API key, no
 * auth. The XML structure is small and stable, so we parse it with targeted
 * regexes rather than pulling in an XML dependency for one feed.
 */

export interface YoutubeFeedEntry {
  videoId: string;
  title: string;
  published: string;
  url: string;
}

export function parseYoutubeFeed(xml: string): YoutubeFeedEntry[] {
  const entries: YoutubeFeedEntry[] = [];
  const entryRe = /<entry>([\s\S]*?)<\/entry>/g;
  let match: RegExpExecArray | null;
  while ((match = entryRe.exec(xml)) !== null) {
    const block = match[1];
    const videoId = /<yt:videoId>([^<]+)<\/yt:videoId>/.exec(block)?.[1];
    const title = /<title>([^<]+)<\/title>/.exec(block)?.[1];
    const published = /<published>([^<]+)<\/published>/.exec(block)?.[1];
    if (videoId && title) {
      entries.push({ videoId, title, url: `https://www.youtube.com/watch?v=${videoId}`, published: published || '' });
    }
  }
  return entries;
}

/** Feed URL for a channel ID. */
export function youtubeChannelFeedUrl(channelId: string): string {
  return `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(channelId)}`;
}
