import { Router } from 'express';
import { isCloudStorageConfigured, MEDIA_BUCKET } from '../../utils/storage';

/**
 * Public, read-only platform configuration. Safe to expose: it contains no
 * secrets — just limits and mode flags the frontend needs to show the owner
 * correct messages ("file too big" thresholds, storage status) without
 * hardcoding values that drift from the backend (see the 50MB-vs-500MB bug
 * this fixes).
 */
const router = Router();

router.get('/', (_req, res) => {
  const maxFileSizeMb = Number.parseInt(process.env.MAX_FILE_SIZE_MB || '500', 10);
  const allowedMimeTypes = (process.env.ALLOWED_MIME_TYPES || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  res.json({
    maxFileSizeMb,
    allowedMimeTypes,
    storage: {
      mode: isCloudStorageConfigured() ? 'supabase' : 'local',
      bucket: MEDIA_BUCKET,
    },
    payments: {
      enabled: Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET),
    },
  });
});

export default router;
