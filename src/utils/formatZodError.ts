import { ZodError } from 'zod';

export function formatZodError(error: ZodError): string {
  const flat = error.flatten() as { formErrors: string[]; fieldErrors: Record<string, string[]> };
  const messages: string[] = [];
  if (flat.formErrors.length > 0) {
    messages.push(...flat.formErrors);
  }
  for (const [field, msgs] of Object.entries(flat.fieldErrors)) {
    if (msgs && msgs.length > 0) {
      messages.push(`${field}: ${msgs.join(', ')}`);
    }
  }
  return messages.join(' | ') || 'Validation failed';
}
