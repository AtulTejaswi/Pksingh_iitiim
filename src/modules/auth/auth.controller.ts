import { Request, Response } from 'express';
import { prisma } from '../../config/db';
import { supabase } from '../../config/supabase';
import { AuthRequest } from '../../middleware/auth.middleware';
import { z } from 'zod';
import { formatZodError } from '../../utils/formatZodError';
import crypto, { randomUUID } from 'crypto';
import jwt from 'jsonwebtoken';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fullName: z.string().min(2).max(100),
  country: z.enum(['IN', 'US']).optional(),
});

const resetRequestSchema = z.object({
  email: z.string().email(),
});

const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

const localJwtSecret = process.env.LOCAL_JWT_SECRET || 'local-secret';
const useSupabase = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.SUPABASE_JWT_SECRET);
const jwtSecret = useSupabase ? process.env.SUPABASE_JWT_SECRET! : localJwtSecret;
const resetJwtSecret = process.env.RESET_JWT_SECRET || jwtSecret;

const hashPassword = (password: string): string => {
  return crypto.scryptSync(password, 'local-salt', 64).toString('hex');
};

const verifyPassword = (password: string, hash: string): boolean => {
  return hashPassword(password) === hash;
};

export const register = async (req: Request, res: Response): Promise<void> => {
  const result = registerSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: formatZodError(result.error) });
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
  console.log(`Auth: login attempt for email=${email}`);

  if (useSupabase && supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.warn('Auth: supabase signInWithPassword failed for', email, error);
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });

    res.json({
      accessToken: data.session?.access_token,
      refreshToken: data.session?.refresh_token,
      user: {
        id: user?.id || '',
        email: data.user?.email || email,
        role: user?.role || 'STUDENT',
        fullName: user?.fullName || '',
        country: (user?.country as any) || null,
        avatarUrl: user?.avatarUrl || null,
      },
    });
    return;
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.passwordHash || !verifyPassword(password, user.passwordHash)) {
    console.warn('Auth: local login failed for', email, { userFound: !!user });
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }

  const token = jwt.sign({ sub: user.id, userId: user.id }, jwtSecret, { expiresIn: '7d' });

  res.json({
    accessToken: token,
    refreshToken: null,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
      country: (user.country as any) || null,
      avatarUrl: user.avatarUrl || null,
    },
  });
};

// Development helper: issue a token for the seeded admin without a password.
export const devLogin = async (req: Request, res: Response): Promise<void> => {
  if (process.env.NODE_ENV === 'production') {
    res.status(403).json({ error: 'Not allowed in production' });
    return;
  }

  const remote = req.ip || req.connection.remoteAddress || '';
  // Allow only local requests (127.0.0.1 or ::1)
  if (!remote.includes('127.0.0.1') && !remote.includes('::1') && !req.headers.host?.includes('localhost')) {
    res.status(403).json({ error: 'Dev login allowed only from localhost' });
    return;
  }

  const user = await prisma.user.findFirst({ where: { role: 'SUPER_ADMIN' } });
  if (!user) {
    res.status(404).json({ error: 'No admin user found to impersonate' });
    return;
  }

  const useSupabase = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.SUPABASE_JWT_SECRET);
  const jwtSecret = useSupabase ? process.env.SUPABASE_JWT_SECRET! : process.env.LOCAL_JWT_SECRET || 'local-secret';
  const jwt = require('jsonwebtoken');
  const token = jwt.sign({ sub: user.supabaseId, userId: user.id }, jwtSecret, { expiresIn: '7d' });

  res.json({ accessToken: token, user: { id: user.id, email: user.email, role: user.role, fullName: user.fullName } });
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
    data: { role: 'SUPER_ADMIN' },
  });
  res.json({ message: `${user.email} is now an admin` });
};

export const demoteFromAdmin = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.params.userId as string;
  const user = await prisma.user.update({
    where: { id: userId },
    data: { role: 'STUDENT' },
  });
  res.json({ message: `${user.email} is now a student` });
};

export const exportUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  const { format } = req.query;
  const users = await prisma.user.findMany({ select: { id: true, email: true, fullName: true, role: true, country: true, createdAt: true } });

  if (String(format).toLowerCase() === 'csv') {
    const csvRows = [
      'id,email,fullName,role,country,createdAt',
      ...users.map((user) => `${user.id},"${user.email}","${user.fullName}",${user.role},${user.country ?? ''},${user.createdAt.toISOString()}`),
    ];
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="users-export.csv"');
    res.send(csvRows.join('\n'));
    return;
  }

  res.json({ users });
};

// Temporary one-time admin seeding endpoint.
// Creates an admin user if none exists. Intended for emergency/first-deploy usage only.
export const seedAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const existing = await prisma.user.findFirst({ where: { role: 'SUPER_ADMIN' } });
    if (existing) {
      res.status(409).json({ error: 'Admin user already exists' });
      return;
    }

    const email = 'admin@pksingh.com';
    const password = 'adminpassword123';
    const passwordHash = hashPassword(password);
    const localId = randomUUID();

    const user = await prisma.user.create({
      data: {
        supabaseId: localId,
        passwordHash,
        email,
        fullName: 'PK Singh Admin',
        role: 'SUPER_ADMIN',
      },
    });

    res.json({ message: 'Admin created', user: { id: user.id, email: user.email, password } });
  } catch (err) {
    console.error('seedAdmin error', err);
    res.status(500).json({ error: 'Failed to seed admin' });
  }
};

export const requestPasswordReset = async (req: Request, res: Response): Promise<void> => {
  const result = resetRequestSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: formatZodError(result.error) });
    return;
  }

  const user = await prisma.user.findUnique({ where: { email: result.data.email } });
  if (!user) {
    res.json({ message: 'If that account exists, a reset link will be available shortly.' });
    return;
  }

  const token = jwt.sign({ sub: user.id, type: 'password_reset' }, resetJwtSecret, { expiresIn: '1h' });
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${encodeURIComponent(token)}`;

  const responsePayload: any = {
    message: 'Password reset request received. Use the reset link to continue.',
  };

  if (process.env.NODE_ENV !== 'production') {
    responsePayload.resetUrl = resetUrl;
  }

  res.json(responsePayload);
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const result = resetPasswordSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: formatZodError(result.error) });
    return;
  }

  const { token, password } = result.data;

  let payload: any;
  try {
    payload = jwt.verify(token, resetJwtSecret);
  } catch (error) {
    res.status(400).json({ error: 'Invalid or expired password reset token' });
    return;
  }

  if (!payload || payload.type !== 'password_reset' || !payload.sub) {
    res.status(400).json({ error: 'Invalid password reset token' });
    return;
  }

  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  if (useSupabase && supabase) {
    const updateResult = await (supabase as any).auth.admin.updateUserById(user.supabaseId, { password });
    if (updateResult.error) {
      res.status(500).json({ error: 'Failed to update password' });
      return;
    }

    res.json({ message: 'Password has been reset successfully' });
    return;
  }

  const passwordHash = hashPassword(password);
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });

  res.json({ message: 'Password has been reset successfully' });
};

export const listUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  const users = await prisma.user.findMany({ select: { id: true, email: true, fullName: true, role: true, country: true } });
  res.json({ users });
};
