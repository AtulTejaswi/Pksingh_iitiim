import fs from 'fs';
import path from 'path';
import { supabase } from '../config/supabase';

// ─── Abstract Cloud Storage Layer ────────────────────────────────────────────
// Any lesson material (video/PDF/image/doc) uploaded by the owner goes through
// this layer. In production (Supabase env vars set) files go straight to
// Supabase Storage, which is persistent. Without those env vars we fall back
// to local disk so local development keeps working with zero setup — but that
// fallback is NOT safe for production/Render, because the disk is wiped on
// every redeploy/restart, silently deleting all uploaded course material.

export interface UploadResult {
  url: string;
  storagePath: string; // opaque identifier the provider needs to delete the file later
  sizeBytes: number;
  mimeType: string;
}

export interface StorageProvider {
  uploadFile(file: Express.Multer.File, folder: string, baseUrl?: string): Promise<UploadResult>;
  deleteFile(storagePath: string): Promise<boolean>;
}

export const MEDIA_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'media';

export const isCloudStorageConfigured = (): boolean => Boolean(supabase);

// ─── Supabase Storage (production) ───────────────────────────────────────────
class SupabaseStorageProvider implements StorageProvider {
  async uploadFile(file: Express.Multer.File, folder: string): Promise<UploadResult> {
    const cleanFolder = folder.replace(/^\/+|\/+$/g, '');
    const objectPath = `${cleanFolder}/${path.basename(file.filename)}`;

    try {
      const buffer = fs.readFileSync(file.path);
      const { error } = await supabase!.storage.from(MEDIA_BUCKET).upload(objectPath, buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

      if (error) {
        throw new Error(`Cloud storage upload failed: ${error.message}`);
      }

      const { data } = supabase!.storage.from(MEDIA_BUCKET).getPublicUrl(objectPath);

      return {
        url: data.publicUrl,
        storagePath: `${MEDIA_BUCKET}/${objectPath}`,
        sizeBytes: file.size,
        mimeType: file.mimetype,
      };
    } finally {
      // Always clean up the local staging copy multer wrote to disk, whether
      // the cloud upload succeeded or failed — we never want to accumulate
      // temp files on the server's ephemeral disk.
      fs.unlink(file.path, () => {});
    }
  }

  async deleteFile(storagePath: string): Promise<boolean> {
    if (!storagePath) return true;
    const [bucket, ...rest] = storagePath.split('/');
    const objectPath = rest.join('/');
    if (!objectPath) return true;
    try {
      const { error } = await supabase!.storage.from(bucket || MEDIA_BUCKET).remove([objectPath]);
      if (error) {
        console.warn('Supabase media delete failed:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('Supabase media delete error:', err);
      return false;
    }
  }
}

// ─── Local disk (dev-only fallback) ──────────────────────────────────────────
class LocalDiskStorageProvider implements StorageProvider {
  async uploadFile(file: Express.Multer.File, _folder: string, baseUrl = ''): Promise<UploadResult> {
    // multer's disk storage already wrote the file to uploads/lessons; we just
    // need to point a public URL at it (served by the /uploads static route).
    return {
      url: `${baseUrl}/uploads/lessons/${file.filename}`,
      storagePath: file.path,
      sizeBytes: file.size,
      mimeType: file.mimetype,
    };
  }

  async deleteFile(storagePath: string): Promise<boolean> {
    if (!storagePath) return true;
    try {
      if (fs.existsSync(storagePath)) fs.unlinkSync(storagePath);
      return true;
    } catch (err) {
      console.warn('Local media delete error:', err);
      return false;
    }
  }
}

export const storageService: StorageProvider = isCloudStorageConfigured()
  ? new SupabaseStorageProvider()
  : new LocalDiskStorageProvider();

if (!isCloudStorageConfigured()) {
  // eslint-disable-next-line no-console
  console.warn(
    '[storage] SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not set — course material ' +
    '(videos, PDFs, images) will be saved to local disk instead of Supabase Storage. ' +
    'This is fine for local development, but on Render (and most hosts) local disk is ' +
    'WIPED on every redeploy/restart, which will permanently delete uploaded material. ' +
    'Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, and create a public "media" bucket ' +
    'in Supabase Storage, before adding real course content in production.'
  );
}
