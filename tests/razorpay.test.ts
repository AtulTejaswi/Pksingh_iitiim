import {
  buildAuthHeader,
  computePaymentSignature,
  computeWebhookSignature,
  createRazorpayOrder,
  isPaymentsConfigured,
  razorpayApiBase,
} from '../src/utils/razorpay';

const ORIGINAL_ENV = { ...process.env };

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
});

describe('razorpay helper', () => {
  it('builds the Basic auth header correctly', () => {
    expect(buildAuthHeader('rzp_test_abc', 'secret123')).toBe(
      'Basic ' + Buffer.from('rzp_test_abc:secret123').toString('base64')
    );
  });

  it('isPaymentsConfigured is false without keys and true with both', () => {
    delete process.env.RAZORPAY_KEY_ID;
    delete process.env.RAZORPAY_KEY_SECRET;
    expect(isPaymentsConfigured()).toBe(false);

    process.env.RAZORPAY_KEY_ID = 'rzp_test_abc';
    process.env.RAZORPAY_KEY_SECRET = 'secret';
    expect(isPaymentsConfigured()).toBe(true);

    delete process.env.RAZORPAY_KEY_SECRET;
    expect(isPaymentsConfigured()).toBe(false);
  });

  it('computes the known payment signature vector', () => {
    expect(computePaymentSignature('order_1', 'pay_1', 'test-secret')).toBe(
      'ba2a3986f33d5a6e148e445a747b407633361cc2fbc1d2faadd70ca5e101984e'
    );
    expect(computeWebhookSignature('{"event":"x"}', 'whsec')).toBe(
      '5ef27bae4e87e034e466c6dc8381723789e6ff205e46b80fcc748cef9b9ebcbf'
    );
  });

  it('createRazorpayOrder calls the Orders API with auth and returns the gateway id', async () => {
    process.env.RAZORPAY_KEY_ID = 'rzp_test_abc';
    process.env.RAZORPAY_KEY_SECRET = 'secret123';
    process.env.RAZORPAY_API_BASE = 'https://mock.razorpay.test';

    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: 'order_N2f', amount: 149900, currency: 'INR', receipt: 'ord-1', status: 'created' }),
    });
    (global as any).fetch = fetchMock;

    const result = await createRazorpayOrder({ amount: 149900, currency: 'INR', receipt: 'ord-1', notes: { courseId: 'c1' } });

    expect(result.id).toBe('order_N2f');
    expect(fetchMock).toHaveBeenCalledWith(
      'https://mock.razorpay.test/v1/orders',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Basic ' + Buffer.from('rzp_test_abc:secret123').toString('base64'),
        }),
        body: JSON.stringify({ amount: 149900, currency: 'INR', receipt: 'ord-1', notes: { courseId: 'c1' } }),
      })
    );
  });

  it('throws a friendly message when the gateway rejects the order', async () => {
    process.env.RAZORPAY_KEY_ID = 'rzp_test_abc';
    process.env.RAZORPAY_KEY_SECRET = 'secret123';
    (global as any).fetch = jest.fn().mockResolvedValue({ ok: false, status: 400, text: async () => '{"error":{"description":"bad"}}' });

    await expect(createRazorpayOrder({ amount: 100, currency: 'INR', receipt: 'r' })).rejects.toThrow(
      /payment gateway could not create your order/
    );
  });

  it('throws a friendly message on a network failure (no money charged)', async () => {
    process.env.RAZORPAY_KEY_ID = 'rzp_test_abc';
    process.env.RAZORPAY_KEY_SECRET = 'secret123';
    (global as any).fetch = jest.fn().mockRejectedValue(new TypeError('fetch failed'));

    await expect(createRazorpayOrder({ amount: 100, currency: 'INR', receipt: 'r' })).rejects.toThrow(
      /Could not reach the payment gateway/
    );
  });

  it('throws when payments are not configured', async () => {
    delete process.env.RAZORPAY_KEY_ID;
    delete process.env.RAZORPAY_KEY_SECRET;
    await expect(createRazorpayOrder({ amount: 100, currency: 'INR', receipt: 'r' })).rejects.toThrow(
      /Payments are not configured/
    );
  });

  it('uses the real gateway by default when RAZORPAY_API_BASE is unset', async () => {
    delete process.env.RAZORPAY_API_BASE;
    expect(razorpayApiBase()).toBe('https://api.razorpay.com');
    process.env.RAZORPAY_KEY_ID = 'rzp_test_abc';
    process.env.RAZORPAY_KEY_SECRET = 'secret123';
    const fetchMock = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ id: 'order_x' }) });
    (global as any).fetch = fetchMock;
    await createRazorpayOrder({ amount: 100, currency: 'INR', receipt: 'r' });
    expect(fetchMock).toHaveBeenCalledWith('https://api.razorpay.com/v1/orders', expect.anything());
  });
});
