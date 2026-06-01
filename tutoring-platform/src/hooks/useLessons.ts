import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { LessonInput } from '@/lib/validators';

export interface Media {
  id: string;
  lessonId: string;
  title: string;
  type: 'PDF' | 'VIDEO' | 'IMAGE' | 'YOUTUBE_LINK' | 'EXTERNAL_LINK';
  url: string;
  sizeBytes: number | null;
  mimeType: string | null;
}

export interface Note {
  id: string;
  lessonId: string;
  title: string;
  content: string;
  fileUrl: string | null;
  createdAt: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description?: string | null;
  content?: string | null;
  sortOrder?: number | null;
  isFree?: boolean;
  isPublished?: boolean;
  media?: Media[];
  notes?: Note[];
}

export function useGetLessons(courseId?: string) {
  return useQuery({
    queryKey: ['lessons', courseId],
    queryFn: async () => {
      const response = await apiClient.get<{ lessons: Lesson[] }>('/lessons', { params: { courseId } });
      return response.data.lessons;
    },
    enabled: !!courseId,
  });
}

export function useGetLesson(id?: string) {
  return useQuery({
    queryKey: ['lesson', id],
    queryFn: async () => {
      const response = await apiClient.get<{ lesson: Lesson }>(`/lessons/${id}`);
      return response.data.lesson;
    },
    enabled: !!id,
  });
}

export function useCreateLesson() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: LessonInput) => {
      const r = await apiClient.post<{ lesson: Lesson }>('/lessons', data);
      return r.data.lesson;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['lessons', (variables as any).courseId] });
      qc.invalidateQueries({ queryKey: ['course', (variables as any).courseId] });
    },
  });
}

export function useUpdateLesson() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<LessonInput> }) => {
      const r = await apiClient.put<{ lesson: Lesson }>(`/lessons/${id}`, data);
      return r.data.lesson;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['lessons'] });
      qc.invalidateQueries({ queryKey: ['lesson', data.id] });
      qc.invalidateQueries({ queryKey: ['course', data.courseId] });
    },
  });
}

export function useDeleteLesson() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, courseId }: { id: string; courseId?: string }) => {
      await apiClient.delete(`/lessons/${id}`);
    },
    onSuccess: (_data, variables: any) => {
      qc.invalidateQueries({ queryKey: ['lessons', variables?.courseId] });
      if (variables?.courseId) qc.invalidateQueries({ queryKey: ['course', variables.courseId] });
    },
  });
}

export function useMarkLessonProgress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (lessonId: string) => {
      const response = await apiClient.post(`/lessons/${lessonId}/progress`);
      return response.data;
    },
    onSuccess: (_, lessonId) => {
      qc.invalidateQueries({ queryKey: ['lesson-progress', lessonId] });
      qc.invalidateQueries({ queryKey: ['my-enrollments'] });
    },
  });
}

export function useAddMediaLink() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: { lessonId: string; title: string; url: string; type: 'YOUTUBE_LINK' | 'EXTERNAL_LINK' }) => {
      const response = await apiClient.post<{ media: Media }>('/media/link', data);
      return response.data.media;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['lesson', data.lessonId] });
    },
  });
}

export function useUploadMediaFile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ lessonId, title, file }: { lessonId: string; title: string; file: File }) => {
      const formData = new FormData();
      formData.append('lessonId', lessonId);
      formData.append('title', title);
      formData.append('file', file);

      const response = await apiClient.post<{ media: Media }>('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.media;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['lesson', data.lessonId] });
    },
  });
}

export function useDeleteMedia() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, lessonId }: { id: string; lessonId: string }) => {
      await apiClient.delete(`/media/${id}`);
    },
    onSuccess: (_data, variables: any) => {
      qc.invalidateQueries({ queryKey: ['lesson', variables.lessonId] });
    },
  });
}

export function useCreateNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: { lessonId: string; title: string; content: string; fileUrl?: string }) => {
      const response = await apiClient.post<{ note: Note }>('/notes', data);
      return response.data.note;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['lesson', data.lessonId] });
    },
  });
}

export function useUpdateNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<{ title: string; content: string; fileUrl: string }> }) => {
      const response = await apiClient.put<{ note: Note }>(`/notes/${id}`, data);
      return response.data.note;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['lesson', data.lessonId] });
    },
  });
}

export function useDeleteNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, lessonId }: { id: string; lessonId: string }) => {
      await apiClient.delete(`/notes/${id}`);
    },
    onSuccess: (_data, variables: any) => {
      qc.invalidateQueries({ queryKey: ['lesson', variables.lessonId] });
    },
  });
}
