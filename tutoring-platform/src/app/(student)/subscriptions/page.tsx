'use client';

import { useMySubscriptions, useCancelSubscription } from '@/hooks/useSubscriptions';
import { toast } from 'sonner';
import Link from 'next/link';
import Image from 'next/image';

export default function SubscriptionsPage() {
  const { data: subscriptions, isLoading } = useMySubscriptions();
  const { mutateAsync: cancelSubscription, isPending: isCancelling } = useCancelSubscription();

  const handleCancel = async (subscriptionId: string, courseName: string) => {
    if (!confirm(`Are you sure you want to cancel your subscription for "${courseName}"? It will remain active until the end of the current billing period.`)) {
      return;
    }

    try {
      await cancelSubscription(subscriptionId);
      toast.success('Subscription will be cancelled at the end of the billing period');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to cancel subscription';
      toast.error(errorMessage);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount / 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'text-green-600 bg-green-50';
      case 'PAUSED': return 'text-yellow-600 bg-yellow-50';
      case 'CANCELLED': return 'text-red-600 bg-red-50';
      case 'PAST_DUE': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <div className="text-ink-muted">Loading subscriptions...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-base py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-ink">My Subscriptions</h1>
          <p className="mt-2 text-ink-muted">Manage your recurring subscriptions and billing.</p>
        </div>

        {!subscriptions || subscriptions.length === 0 ? (
          <div className="bg-bg-card rounded-card border border-border-subtle p-12 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-xl font-semibold text-ink mb-2">No Active Subscriptions</h2>
            <p className="text-ink-muted mb-6">
              You don&apos;t have any active subscriptions yet. Explore our plans to get started!
            </p>
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 rounded-pill bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700 transition-colors"
            >
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {subscriptions.map((sub) => (
              <div
                key={sub.id}
                className="bg-bg-card rounded-card border border-border-subtle p-6 shadow-warm-sm"
              >
                <div className="flex items-start gap-4">
                  {sub.course.thumbnailUrl && (
                    <Image
                      src={sub.course.thumbnailUrl}
                      alt={sub.course.title}
                      width={80}
                      height={60}
                      className="rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-ink">{sub.course.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(sub.status)}`}>
                        {sub.status}
                      </span>
                    </div>
                    <p className="text-sm text-ink-muted mb-3">
                      {sub.plan.name} — {formatCurrency(sub.plan.amount)}/{sub.plan.intervalUnit}
                    </p>
                    <div className="flex items-center gap-6 text-sm text-ink-muted">
                      <span>Current period: {formatDate(sub.currentPeriodStart)} – {formatDate(sub.currentPeriodEnd)}</span>
                      {sub.cancelAtPeriodEnd && (
                        <span className="text-orange-600 font-medium">Cancels at period end</span>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {sub.status === 'ACTIVE' && !sub.cancelAtPeriodEnd && (
                      <button
                        onClick={() => handleCancel(sub.id, sub.course.title)}
                        disabled={isCancelling}
                        className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        {isCancelling ? 'Cancelling...' : 'Cancel'}
                      </button>
                    )}
                    <Link
                      href={`/courses/${sub.courseId}`}
                      className="ml-2 px-4 py-2 text-sm font-medium text-brand-600 hover:text-brand-700 hover:bg-brand-50 rounded-lg transition-colors"
                    >
                      View Course
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
