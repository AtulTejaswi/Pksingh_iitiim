import { Request, Response } from 'express';
import { prisma } from '../../config/db';
import multer from 'multer';

const storage = multer.memoryStorage();
export const upload = multer({ storage });

export const uploadMedia = async (req: Request, res: Response): Promise<void> => {
  res.status(501).json({ error: 'Media upload requires abstract storage integration (Phase 2 completed).' });
};

export const addLink = async (req: Request, res: Response): Promise<void> => {
  const { title, type, url, folder } = req.body;
  const asset = await prisma.mediaAsset.create({
    data: { title, type, url, folder: folder || '/' }
  });
  res.status(201).json({ asset });
};

export const getLessonMedia = async (req: Request, res: Response): Promise<void> => {
  const lessonId = req.params.lessonId as string;
  const media = await prisma.lessonMedia.findMany({
    where: { lessonId },
    include: { mediaAsset: true },
    orderBy: { sortOrder: 'asc' },
  });
  res.json({ media });
};

export const updateMedia = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id as string;
  const media = await prisma.mediaAsset.update({ where: { id }, data: req.body });
  res.json({ media });
};

export const deleteMedia = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id as string;
  await prisma.mediaAsset.delete({ where: { id } });
  res.json({ message: 'Media deleted' });
};

export const reorderMedia = async (req: Request, res: Response): Promise<void> => {
  const { mediaIds } = req.body as { mediaIds: string[] };
  const updates = mediaIds.map((id, index) =>
    prisma.lessonMedia.update({ where: { id }, data: { sortOrder: index } })
  );
  await prisma.$transaction(updates);
  res.json({ message: 'Media reordered' });
};
