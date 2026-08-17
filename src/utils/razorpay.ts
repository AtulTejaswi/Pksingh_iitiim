/**
 * Razorpay payment-gateway client.
 *
 * Kept dependency-free (native fetch, Node >= 18) and behind a small pure
 * module so the payment flow can be unit tested without a live gateway and so
 * the base URL can be overridden (RAZORPAY_API_BASE) for local/CI testing
 * against a mock gateway. All errors are thrown as human-readable messages
 * the frontend can show the owner/student directly.
 */

import crypto from 'crypto';

/** Gateway base URL — overridable (RAZORPAY_API_BASE) for local/CI mocks. */
export const razorpayApiBase = (): string => process.env.RAZORPAY_API_BASE || 'https://api.razorpay.com';

export const razorpayKeyId = (): string => process.env.RAZORPAY_KEY_ID || '';
export const razorpayKeySecret = (): string => process.env.RAZORPAY_KEY_SECRET || '';
export const razorpayWebhookSecret = (): string => process.env.RAZORPAY_WEBHOOK_SECRET || '';

/** True when the full key pair is present (payments can be initiated). */
export const isPaymentsConfigured = (): boolean =>
  Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);

export interface RazorpayOrderParams {
  amount: number; // smallest currency unit (paise for INR)
  currency: string;
  receipt: string; // our order id — lets webhooks map back to our DB
  notes?: Record<string, string>;
}

export interface RazorpayOrderResult {
  id: string; // e.g. "order_N2f..."
  amount: number;
  currency: string;
  receipt: string;
  status: string;
}

/** Build the HTTP Basic auth header value from the API key pair. */
export const buildAuthHeader = (keyId: string, keySecret: string): string =>
  'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64');

/**
 * Create an order on Razorpay's Orders API.
 * Throws an Error with a plain-English message on any failure.
 */
export async function createRazorpayOrder(params: RazorpayOrderParams): Promise<RazorpayOrderResult> {
  const keyId = razorpayKeyId();
  const keySecret = razorpayKeySecret();

  if (!keyId || !keySecret) {
    throw new Error('Payments are not configured on this site yet. Please contact the site owner.');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    const response = await fetch(`${razorpayApiBase()}/v1/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: buildAuthHeader(keyId, keySecret),
      },
      body: JSON.stringify({
        amount: params.amount,
        currency: params.currency,
        receipt: params.receipt,
        ...(params.notes ? { notes: params.notes } : {}),
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      throw new Error(
        `The payment gateway could not create your order (${response.status}). ` +
          `Please try again in a moment — no money was charged.${detail ? ' Detail: ' + detail.slice(0, 200) : ''}`
      );
    }

    return (await response.json()) as RazorpayOrderResult;
  } catch (err: any) {
    if (err?.name === 'AbortError') {
      throw new Error('The payment gateway took too long to respond. Please try again — no money was charged.');
    }
    // Already a friendly message from above; otherwise wrap network errors.
    if (typeof err?.message === 'string' && err.message.includes('payment gateway')) {
      throw err;
    }
    throw new Error(
      `Could not reach the payment gateway. Please check your internet connection and try again — no money was charged.`
    );
  } finally {
    clearTimeout(timeout);
  }
}

/** Compute the Razorpay signature for client-side verification. */
export const computePaymentSignature = (orderId: string, paymentId: string, secret: string): string =>
  crypto.createHmac('sha256', secret).update(`${orderId}|${paymentId}`).digest('hex');

/** Compute the webhook signature over the raw request body. */
export const computeWebhookSignature = (rawBody: string, secret: string): string =>
  crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
