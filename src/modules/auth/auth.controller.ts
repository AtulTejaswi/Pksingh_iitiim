import { Request, Response } from 'express';
import { prisma } from '../../config/db';
import { supabase } from '../../config/supabase';
import { AuthRequest } from '../../middleware/auth.middleware';
import { z } from 'zod';
import crypto, { randomUUID } from 'crypto';
import jwt from 'jsonwebtoken';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fullName: z.string().min(2).max(100),
  country: z.enum(['IN', 'US']).optional(),
});

const localJwtSecret = process.env.LOCAL_JWT_SECRET || 'local-secret';

const hashPassword = (password: string): string => {
  return crypto.scryptSync(password, 'local-salt', 64).toString('hex');
};

const verifyPassword = (password: string, hash: string): boolean => {
  return hashPassword(password) === hash;
};

const useSupabase = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.SUPABASE_JWT_SECRET);

export const register = async (req: Request, res: Response): Promise<void> => {
  const result = registerSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.flatten() });
    return;
  }

  const { email, password, fullName, country } = result.data;

  if (useSupabase && supabase) {
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) {
      res.status(400).json({ error: authError.message });
      return;
    }

    const user = await prisma.user.create({
      data: {
        supabaseId: authData.user.id,
        email,
        fullName,
        country: country ?? null,
        role: 'STUDENT',
      },
    });

    res.status(201).json({
      message: 'Registration successful',
      user: { id: user.id, email: user.email, role: user.role },
    });
    return;
  }

  const passwordHash = hashPassword(password);
  const localId = randomUUID();

  const user = await prisma.user.create({
    data: {
      supabaseId: localId,
      passwordHash,
      email,
      fullName,
      country: country ?? null,
      role: 'STUDENT',
    },
  });

  res.status(201).json({
    message: 'Registration successful',
    user: { id: user.id, email: user.email, role: user.role },
  });
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (useSupabase && supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    res.json({
      accessToken: data.session?.access_token,
      refreshToken: data.session?.refresh_token,
      user: { email: data.user?.email },
    });
    return;
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.passwordHash || !verifyPassword(password, user.passwordHash)) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }

  const token = jwt.sign({ sub: user.id, userId: user.id }, localJwtSecret, { expiresIn: '7d' });

  res.json({
    accessToken: token,
    refreshToken: null,
    user: { email: user.email },
  });
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: { id: true, email: true, fullName: true, role: true, country: true, avatarUrl: true },
  });
  res.json(user);
};

export const promoteToAdmin = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.params.userId as string;
  const user = await prisma.user.update({
    where: { id: userId },
    data: { role: 'ADMIN' },
  });
  res.json({ message: `${user.email} is now an admin` });
};
