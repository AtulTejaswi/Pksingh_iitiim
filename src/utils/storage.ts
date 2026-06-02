// Abstract Cloud Storage Layer
export interface StorageProvider {
  uploadFile(file: Express.Multer.File, folder: string): Promise<{ url: string; storagePath: string; sizeBytes: number; mimeType: string }>;
  deleteFile(storagePath: string): Promise<boolean>;
}

// Concrete Implementation (e.g., Cloudinary or AWS S3)
// For now, this is a mock implementation that can be easily swapped out.
export class CloudinaryStorageProvider implements StorageProvider {
  async uploadFile(file: Express.Multer.File, folder: string) {
    // TODO: Implement actual Cloudinary SDK logic here
    console.log(`Mock uploading to Cloudinary: ${folder}/${file.originalname}`);
    return {
      url: `https://mock-cloudinary.com/${folder}/${file.filename}`,
      storagePath: `${folder}/${file.filename}`,
      sizeBytes: file.size,
      mimeType: file.mimetype,
    };
  }

  async deleteFile(storagePath: string) {
    // TODO: Implement actual Cloudinary SDK logic here
    console.log(`Mock deleting from Cloudinary: ${storagePath}`);
    return true;
  }
}

// Export a singleton instance of the chosen provider
export const storageService: StorageProvider = new CloudinaryStorageProvider();
