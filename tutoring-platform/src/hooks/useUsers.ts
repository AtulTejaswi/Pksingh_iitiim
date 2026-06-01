import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export function useGetUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const r = await apiClient.get<{ users: any[] }>('/auth/users');
      return r.data.users;
    },
  });
}

export function usePromoteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) => {
      const r = await apiClient.patch(`/auth/promote/${userId}`);
      return r.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useDemoteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) => {
      const r = await apiClient.patch(`/auth/demote/${userId}`);
      return r.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
