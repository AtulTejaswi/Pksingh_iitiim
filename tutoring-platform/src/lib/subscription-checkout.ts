'use client';

/**
 * Thin wrapper around Razorpay's Subscription Checkout modal.
 * Similar to the one-time checkout but uses subscription_id instead of order_id.
 */

export interface SubscriptionCheckoutResponse {
  razorpay_subscription_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      on: (event: string, cb: (res?: { error?: { description?: string } }) => void) => void;
      open: () => void;
    };
  }
}

function loadRazorpayScript(): Promise<void> {
  const SRC = 'https://checkout.razorpay.com/v1/checkout.js';
  if (document.querySelector(`script[src="${SRC}"]`) || window.Razorpay) {
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Could not load the payment window. Please check your internet connection and try again.'));
    document.head.appendChild(script);
  });
}

export async function openRazorpaySubscriptionCheckout(opts: {
  keyId: string;
  subscriptionId: string; // Razorpay subscription_id (sub_...)
  description: string;
  onSuccess: (response: SubscriptionCheckoutResponse) => void;
  onDismiss: (message: string) => void;
  onFailure: (message: string) => void;
}): Promise<void> {
  await loadRazorpayScript();

  const RazorpayCtor = window.Razorpay;
  if (!RazorpayCtor) {
    opts.onFailure('Could not start the payment window. Please refresh the page and try again.');
    return;
  }

  const rzp = new RazorpayCtor({
    key: opts.keyId,
    subscription_id: opts.subscriptionId,
    name: 'PK Singh',
    description: opts.description,
    theme: { color: '#2563eb' },
    handler: (resp: SubscriptionCheckoutResponse) => opts.onSuccess(resp),
    modal: { ondismiss: () => opts.onDismiss('Payment window was closed — no money was charged.') },
  });

  rzp.on('payment.failed', (res) => {
    opts.onFailure(res?.error?.description || 'Payment failed. No money was charged — please try again.');
  });

  rzp.open();
}
