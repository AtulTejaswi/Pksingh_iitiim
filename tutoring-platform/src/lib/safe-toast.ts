import { toast } from 'sonner';

/**
 * Safe wrapper around toast.error that ensures the message is always a string.
 * Prevents React crash when an object (e.g. Zod validation result) is passed.
 */
export function safeToastError(error: unknown, fallback = 'Something went wrong') {
  if (typeof error === 'string') {
    toast.error(error);
  } else if (error && typeof error === 'object') {
    // Handle Zod-style { formErrors, fieldErrors } objects
    const errObj = error as Record<string, unknown>;
    if (errObj.formErrors || errObj.fieldErrors) {
      const msgs: string[] = [];
      if (Array.isArray(errObj.formErrors) && errObj.formErrors.length > 0) {
        msgs.push(...errObj.formErrors.map(String));
      }
      if (errObj.fieldErrors && typeof errObj.fieldErrors === 'object') {
        for (const [field, fieldMsgs] of Object.entries(errObj.fieldErrors as Record<string, string[]>)) {
          if (Array.isArray(fieldMsgs) && fieldMsgs.length > 0) {
            msgs.push(`${field}: ${fieldMsgs.join(', ')}`);
          }
        }
      }
      toast.error(msgs.join(' | ') || fallback);
    } else if ('message' in errObj && typeof errObj.message === 'string') {
      toast.error(errObj.message);
    } else {
      toast.error(JSON.stringify(error));
    }
  } else {
    toast.error(fallback);
  }
}

/**
 * Extract a string error message from an axios-style caught error.
 * Usage: safeToastError(getErrorMessage(err, 'Failed to do X'))
 */
export function getErrorMessage(err: unknown, fallback = 'Something went wrong'): string {
  if (err && typeof err === 'object') {
    const axiosErr = err as {
      response?: { data?: { error?: unknown; message?: unknown } };
      message?: string;
    };
    const data = axiosErr.response?.data;
    // Backend handlers use either `error` (Zod/route handlers) or `message`
    // (upload/Multer errors). Prefer whichever is a real, readable string so
    // the owner never sees a generic "Request failed with status code 400".
    const raw = data?.error ?? data?.message;
    if (typeof raw === 'string') return raw;
    if (raw && typeof raw === 'object') return JSON.stringify(raw);
    if (typeof axiosErr.message === 'string' && !axiosErr.message.startsWith('Request failed')) {
      return axiosErr.message;
    }
  }
  return fallback;
}
