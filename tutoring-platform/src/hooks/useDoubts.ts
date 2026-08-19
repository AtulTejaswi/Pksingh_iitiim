import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export interface Doubt {
  id: string;
  userId: string;
  lessonId: string | null;
  courseId: string | null;
  subject: string | null;
  questionText: string;
  questionImageUrl: string | null;
  aiAnswer: string | null;
  aiConfidence: number | null;
  status: 'PENDING' | 'AI_ANSWERED' | 'FLAGGED_FOR_REVIEW' | 'RESOLVED';
  assignedToId: string | null;
  resolutionNote: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AskDoubtResponse {
  doubt: Doubt;
  confidence: number;
  flaggedForReview: boolean;
  message: string;
}

/** Submit a doubt question to the AI tutor. */
export function useAskDoubt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      questionText: string;
      lessonId?: string;
      courseId?: string;
      subject?: string;
      questionImageUrl?: string;
    }) => {
      const response = await apiClient.post<AskDoubtResponse>('/ai/ask', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-doubts'] });
    },
  });
}

/** List the current user's doubts. */
export function useGetMyDoubts(enabled = true) {
  return useQuery({
    queryKey: ['my-doubts'],
    queryFn: async () => {
      const response = await apiClient.get<{ doubts: Doubt[] }>('/ai/doubts');
      return response.data.doubts;
    },
    enabled,
    retry: false,
  });
}

/** List doubts pending human review (TUTOR/ADMIN only). */
export function useGetPendingDoubts(enabled = true) {
  return useQuery({
    queryKey: ['pending-doubts'],
    queryFn: async () => {
      const response = await apiClient.get<{ doubts: (Doubt & { user: { fullName: string; email: string } })[] }>('/ai/doubts/pending');
      return response.data.doubts;
    },
    enabled,
    retry: false,
  });
}

/** Resolve a doubt manually (TUTOR/ADMIN only). */
export function useResolveDoubt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, resolutionNote }: { id: string; resolutionNote: string }) => {
      const response = await apiClient.patch<{ doubt: Doubt }>(`/ai/doubts/${id}/resolve`, { resolutionNote });
      return response.data.doubt;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-doubts'] });
      queryClient.invalidateQueries({ queryKey: ['my-doubts'] });
    },
  });
}
