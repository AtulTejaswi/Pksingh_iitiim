import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { CourseInput } from '@/lib/validators';

export interface Course {
  id: string;
  title: string;
  description: string;
  subject: 'PHYSICS' | 'CHEMISTRY' | 'MATH';
  examTags: string[];
  thumbnailUrl: string | null;
  isFree: boolean;
  isPublished: boolean;
  _count?: {
    lessons: number;
    enrollments: number;
  };
  lessons?: {
    id: string;
    title: string;
    isFree: boolean;
    sortOrder: number;
    media?: { id: string; title: string; type: string }[];
    notes?: { id: string; title: string }[];
  }[];
}

export function useGetCourses(filters?: { subject?: string; examTag?: string; includeDrafts?: boolean }) {
  return useQuery({
    queryKey: ['courses', filters],
    queryFn: async () => {
      const params: any = {
        ...filters,
        limit: 100, // Fetch all for browsing
      };
      if (filters?.includeDrafts) {
        params.includeDrafts = 1;
      }
      const response = await apiClient.get<{ courses: Course[] }>('/courses', {
        params,
      });
      return response.data.courses;
    },
  });
}

export function useGetCourse(id: string) {
  return useQuery({
    queryKey: ['course', id],
    queryFn: async () => {
      const response = await apiClient.get<{ course: Course }>(`/courses/${id}`);
      return response.data.course;
    },
    enabled: !!id,
  });
}

export function useCreateCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CourseInput) => {
      const response = await apiClient.post<{ course: Course }>('/courses', data);
      return response.data.course;
    },
    onSuccess: () => {
      // Invalidate both the base courses key and the drafts-included variant
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['courses', { includeDrafts: true }] });
    },
  });
}

export function useUpdateCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CourseInput> }) => {
      const response = await apiClient.put<{ course: Course }>(`/courses/${id}`, data);
      return response.data.course;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['courses', { includeDrafts: true }] });
      queryClient.invalidateQueries({ queryKey: ['course', variables.id] });
      // Ensure the single-course cache is updated immediately with returned data
      queryClient.setQueryData(['course', variables.id], data);
    },
  });
}

export function useDeleteCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/courses/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['courses', { includeDrafts: true }] });
    },
  });
}

export function useTogglePublishCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, isPublished }: { id: string; isPublished: boolean }) => {
      const response = await apiClient.patch<{ course: Course }>(`/courses/${id}/publish`, { isPublished });
      return response.data.course;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['courses', { includeDrafts: true }] });
      queryClient.invalidateQueries({ queryKey: ['course', variables.id] });
    },
  });
}

// Enroll student
export function useEnrollCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (courseId: string) => {
      const response = await apiClient.post('/enrollments', { courseId });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-enrollments'] });
    },
  });
}

// Fetch student enrollments
export function useGetMyEnrollments() {
  return useQuery({
    queryKey: ['my-enrollments'],
    queryFn: async () => {
      const response = await apiClient.get<{ enrollments: { id: string; course: { id: string; title: string; thumbnailUrl: string | null } }[] }>('/enrollments/my');
      return response.data.enrollments;
    },
  });
}

// Fetch all enrollments (Admin)
export function useGetAllEnrollments(courseId?: string) {
  return useQuery({
    queryKey: ['all-enrollments', courseId],
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await apiClient.get<{ enrollments: any[] }>('/enrollments', {
        params: { courseId },
      });
      return response.data.enrollments;
    },
  });
}

// Delete student enrollment (Admin)
export function useDeleteEnrollment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/enrollments/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-enrollments'] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
}
