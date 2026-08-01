import { Request, Response } from 'express';
import { prisma } from '../../config/db';

export const createLead = async (req: Request, res: Response): Promise<void> => {
  const { name, email, whatsapp, source } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    res.status(400).json({ success: false, error: 'Name is required' });
    return;
  }
  const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
  if (!normalizedEmail || !normalizedEmail.includes('@')) {
    res.status(400).json({ success: false, error: 'A valid email address is required' });
    return;
  }

  try {
    const lead = await prisma.lead.upsert({
      where: { email: normalizedEmail },
      update: {
        name: name.trim(),
        ...(whatsapp ? { whatsapp: whatsapp.trim() } : {}),
        source: source || 'newsletter',
        subscribedAt: new Date(),
      },
      create: {
        name: name.trim(),
        email: normalizedEmail,
        whatsapp: whatsapp?.trim() || null,
        source: source || 'newsletter',
      },
    });
    res.status(201).json({ success: true, message: 'Subscribed', lead: { email: lead.email } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const unsubscribe = async (req: Request, res: Response): Promise<void> => {
  const email = String(req.params.email).trim().toLowerCase();
  if (!email.includes('@')) {
    res.status(400).json({ success: false, error: 'A valid email address is required' });
    return;
  }
  try {
    await prisma.lead.deleteMany({ where: { email } });
    res.json({ success: true, message: 'Unsubscribed' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const listLeads = async (req: Request, res: Response): Promise<void> => {
  try {
    const leads = await prisma.lead.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ leads });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
