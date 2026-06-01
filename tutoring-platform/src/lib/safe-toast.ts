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
    const axiosErr = err as { response?: { data?: { error?: unknown } }; message?: string };
    const raw = axiosErr.response?.data?.error;
    if (typeof raw === 'string') return raw;
    if (raw && typeof raw === 'object') return JSON.stringify(raw);
    if (typeof axiosErr.message === 'string') return axiosErr.message;
  }
  return fallback;
}
