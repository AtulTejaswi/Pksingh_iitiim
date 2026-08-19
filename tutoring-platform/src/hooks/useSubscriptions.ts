'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface SubscriptionPlan {
  id: string;
  courseId: string | null;
  razorpayPlanId: string;
  name: string;
  amount: number;
  currency: string;
  interval: number;
  intervalUnit: string;
  course?: {
    id: string;
    title: string;
    thumbnailUrl: string | null;
  } | null;
}

export interface Subscription {
  id: string;
  userId: string;
  courseId: string;
  planId: string;
  razorpaySubscriptionId: string;
  status: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  course: {
    id: string;
    title: string;
    thumbnailUrl: string | null;
  };
  plan: {
    name: string;
    amount: number;
    interval: number;
    intervalUnit: string;
  };
}

export interface CreateSubscriptionResponse {
  subscriptionId: string;
  razorpaySubscriptionId: string;
  keyId: string;
  status: string;
}

// ─── Hooks ───────────────────────────────────────────────────────────────────

/** GET /subscriptions/plans — list available subscription plans (public) */
export function useSubscriptionPlans() {
  return useQuery({
    queryKey: ['subscription-plans'],
    queryFn: async () => {
      const response = await apiClient.get<{ plans: SubscriptionPlan[] }>('/subscriptions/plans');
      return response.data.plans;
    },
    staleTime: 60_000,
  });
}

/** POST /subscriptions/create — initiate a subscription */
export function useCreateSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (planId: string) => {
      const response = await apiClient.post<CreateSubscriptionResponse>('/subscriptions/create', { planId });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-subscriptions'] });
    },
  });
}

/** POST /subscriptions/verify — confirm subscription payment */
export function useVerifySubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      razorpay_subscription_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    }) => {
      const response = await apiClient.post('/subscriptions/verify', input);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['my-enrollments'] });
    },
  });
}

/** POST /subscriptions/:id/cancel — cancel a subscription */
export function useCancelSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (subscriptionId: string) => {
      const response = await apiClient.post(`/subscriptions/${subscriptionId}/cancel`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-subscriptions'] });
    },
  });
}

/** GET /subscriptions/my — get user's subscriptions */
export function useMySubscriptions() {
  return useQuery({
    queryKey: ['my-subscriptions'],
    queryFn: async () => {
      const response = await apiClient.get<{ subscriptions: Subscription[] }>('/subscriptions/my');
      return response.data.subscriptions;
    },
  });
}
