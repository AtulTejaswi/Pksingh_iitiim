import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export interface MediaItem {
  id: string;
  lessonId: string;
  title: string;
  url: string;
  type: string;
}

export function useGetLessonMedia(lessonId?: string) {
  return useQuery({
    queryKey: ['media', lessonId],
    queryFn: async () => {
      const r = await apiClient.get<{ media: MediaItem[] }>(`/media/lesson/${lessonId}`);
      return r.data.media;
    },
    enabled: !!lessonId,
  });
}

export function useUploadMedia() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const r = await apiClient.post('/media/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      return r.data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['media'] });
      qc.invalidateQueries({ queryKey: ['lessons'] });
    },
  });
}

export function useDeleteMedia() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/media/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['media'] });
    },
  });
}
