'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export interface PaymentOrder {
  orderId: string;
  amount: number; // paise
  currency: string;
  keyId: string;
  gatewayOrderId: string;
}

export interface VerifyPaymentInput {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

/** POST /payments/create-order — create a payment order at the gateway. */
export function useCreatePaymentOrder() {
  return useMutation({
    mutationFn: async (courseId: string) => {
      const response = await apiClient.post<PaymentOrder>('/payments/create-order', { courseId });
      return response.data;
    },
  });
}

/** POST /payments/verify — confirm the checkout and unlock the enrollment. */
export function useVerifyPayment(courseId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: VerifyPaymentInput) => {
      const response = await apiClient.post('/payments/verify', input);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-enrollments'] });
      queryClient.invalidateQueries({ queryKey: ['course', courseId] });
    },
  });
}
