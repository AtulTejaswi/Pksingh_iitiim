'use client';

/**
 * Thin wrapper around Razorpay's official Checkout modal. Loads their script
 * on demand (free service — no SDK dependency) and surfaces every outcome as
 * plain-English strings for the toast layer.
 */

export interface RazorpayOrderResponse {
  razorpay_order_id: string;
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

export async function openRazorpayCheckout(opts: {
  keyId: string;
  orderId: string; // gateway order id (order_...)
  amount: number; // paise
  currency: string;
  description: string;
  onSuccess: (response: RazorpayOrderResponse) => void;
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
    amount: opts.amount,
    currency: opts.currency,
    name: 'PK Singh',
    description: opts.description,
    order_id: opts.orderId,
    theme: { color: '#2563eb' },
    handler: (resp: RazorpayOrderResponse) => opts.onSuccess(resp),
    modal: { ondismiss: () => opts.onDismiss('Payment window was closed — no money was charged.') },
  });

  rzp.on('payment.failed', (res) => {
    opts.onFailure(res?.error?.description || 'Payment failed. No money was charged — please try again.');
  });

  rzp.open();
}
