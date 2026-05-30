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
  description: string | null;
  content: string | null;
  sortOrder: number;
  isFree: boolean;
  isPublished: boolean;
  media?: Media[];
  notes?: Note[];
}

export function useGetLesson(id: string) {
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
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: LessonInput) => {
      const response = await apiClient.post<{ lesson: Lesson }>('/lessons', data);
      return response.data.lesson;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['course', variables.courseId] });
    },
  });
}

export function useUpdateLesson() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<LessonInput> }) => {
      const response = await apiClient.put<{ lesson: Lesson }>(`/lessons/${id}`, data);
      return response.data.lesson;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['lesson', data.id] });
      queryClient.invalidateQueries({ queryKey: ['course', data.courseId] });
    },
  });
}

export function useDeleteLesson() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, courseId }: { id: string; courseId: string }) => {
      await apiClient.delete(`/lessons/${id}`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['course', variables.courseId] });
    },
  });
}

// Mark lesson complete progress
export function useMarkLessonProgress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (lessonId: string) => {
      const response = await apiClient.post(`/lessons/${lessonId}/progress`);
      return response.data;
    },
    onSuccess: (_, lessonId) => {
      queryClient.invalidateQueries({ queryKey: ['lesson-progress', lessonId] });
      queryClient.invalidateQueries({ queryKey: ['my-enrollments'] }); // Refetches enrollments to update progress percent
    },
  });
}

// Add Media Link (YouTube/External)
export function useAddMediaLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { lessonId: string; title: string; url: string; type: 'YOUTUBE_LINK' | 'EXTERNAL_LINK' }) => {
      const response = await apiClient.post<{ media: Media }>('/media/link', data);
      return response.data.media;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['lesson', data.lessonId] });
    },
  });
}

// Upload Media File (Multipart form data)
export function useUploadMediaFile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ lessonId, title, file }: { lessonId: string; title: string; file: File }) => {
      const formData = new FormData();
      formData.append('lessonId', lessonId);
      formData.append('title', title);
      formData.append('file', file);

      const response = await apiClient.post<{ media: Media }>('/media/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.media;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['lesson', data.lessonId] });
    },
  });
}

// Delete Media
export function useDeleteMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, lessonId }: { id: string; lessonId: string }) => {
      await apiClient.delete(`/media/${id}`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['lesson', variables.lessonId] });
    },
  });
}

// Create Note
export function useCreateNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { lessonId: string; title: string; content: string; fileUrl?: string }) => {
      const response = await apiClient.post<{ note: Note }>('/notes', data);
      return response.data.note;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['lesson', data.lessonId] });
    },
  });
}

// Update Note
export function useUpdateNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<{ title: string; content: string; fileUrl: string }> }) => {
      const response = await apiClient.put<{ note: Note }>(`/notes/${id}`, data);
      return response.data.note;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['lesson', data.lessonId] });
    },
  });
}

// Delete Note
export function useDeleteNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, lessonId }: { id: string; lessonId: string }) => {
      await apiClient.delete(`/notes/${id}`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['lesson', variables.lessonId] });
    },
  });
}
