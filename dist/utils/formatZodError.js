"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatZodError = formatZodError;
function formatZodError(error) {
    const flat = error.flatten();
    const messages = [];
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
