import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { getYouTubeThumbnailUrl } from '@/lib/youtube';

export interface CourseVideo {
  lessonId: string;
  title: string;
  isFree: boolean;
  sortOrder: number;
  videoId: string | null;
  url: string | null;
}

export interface CourseVideosResponse {
  course: { id: string; title: string; isFree: boolean };
  videos: CourseVideo[];
}

/** Videos with a thumbnail derived from the YouTube video ID. */
export interface GridVideo extends CourseVideo {
  thumbnail: string | null;
}

/**
 * Fetch a course's videos for a grid page (one request, no auth needed).
 * Derives the YouTube thumbnail from each video ID.
 */
export function useGetCourseVideos(courseId: string) {
  return useQuery({
    queryKey: ['course-videos', courseId],
    queryFn: async () => {
      const response = await apiClient.get<CourseVideosResponse>(`/courses/${courseId}/videos`, {
        timeout: 25000,
      });
      const { course, videos } = response.data;
      const gridVideos: GridVideo[] = videos.map((v) => ({
        ...v,
        thumbnail: v.videoId ? getYouTubeThumbnailUrl(`https://www.youtube.com/watch?v=${v.videoId}`) : null,
      }));
      return { course, videos: gridVideos };
    },
    enabled: !!courseId,
    retry: (failureCount, error) => {
      const status = (error as { response?: { status?: number } })?.response?.status;
      if (status === 404) return false;
      return failureCount < 2;
    },
  });
}
