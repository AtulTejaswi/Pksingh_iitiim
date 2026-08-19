'use client';

import { useState } from 'react';
import { useCreateSubscription, useVerifySubscription } from '@/hooks/useSubscriptions';
import { openRazorpaySubscriptionCheckout } from '@/lib/subscription-checkout';
import { toast } from 'sonner';

interface SubscriptionCheckoutProps {
  planId: string;
  planName: string;
  courseId?: string;
  courseTitle?: string;
  disabled?: boolean;
  className?: string;
}

export default function SubscriptionCheckout({
  planId,
  planName,
  courseTitle,
  disabled = false,
  className = '',
}: SubscriptionCheckoutProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { mutateAsync: createSubscription } = useCreateSubscription();
  const { mutateAsync: verifySubscription } = useVerifySubscription();

  const handleSubscribe = async () => {
    if (disabled || isLoading) return;

    setIsLoading(true);
    try {
      const result = await createSubscription(planId);

      openRazorpaySubscriptionCheckout({
        keyId: result.keyId,
        subscriptionId: result.razorpaySubscriptionId,
        description: `${planName} — ${courseTitle || 'PK Singh Mentorship'}`,
        onSuccess: async (response) => {
          try {
            await verifySubscription(response);
            toast.success('Subscription activated! You now have access.');
          } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Verification failed. Contact support.';
            toast.error(errorMessage);
          }
        },
        onDismiss: (message) => {
          toast.info(message);
        },
        onFailure: (message) => {
          toast.error(message);
        },
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start subscription. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleSubscribe}
      disabled={disabled || isLoading}
      className={`rounded-pill px-6 py-3 font-semibold transition-all ${
        disabled
          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
          : 'bg-brand-600 text-white shadow-warm-md hover:shadow-warm-glow hover:-translate-y-0.5'
      } ${className}`}
    >
      {isLoading ? 'Processing...' : 'Subscribe Now'}
    </button>
  );
}
