# TODO - Backend + Frontend tuning & verification

## Plan Summary
- Focus on UI friendliness first, then backend robustness + contract consistency.

## Steps
- [ ] Locate frontend pages/components that use the existing hooks and verify their loading/error UX.
- [ ] Improve `ProtectedRoute` so unauthenticated users are redirected to login with a clear message (no blank screen).
- [ ] Improve API error handling UX: surface `error.response.data.error` in a user-friendly way (sonner toasts).
- [ ] Harden backend request validation (courses pagination query, lesson/media inputs).
- [ ] Standardize backend error response shapes across all controllers.
- [ ] Run backend tests: `npm test`.
- [ ] Run frontend checks: `npm run lint` and `npm run build` (inside `tutoring-platform`).
- [ ] Perform quick API smoke checks for auth/courses/lessons/enrollments/media/notes.

