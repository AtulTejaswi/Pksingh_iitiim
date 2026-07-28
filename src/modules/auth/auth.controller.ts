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

const refreshSchema = z.object({
  refreshToken: z.string(),
});

const localJwtSecret = process.env.LOCAL_JWT_SECRET || 'local-secret';
const useSupabase = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.SUPABASE_JWT_SECRET);
const jwtSecret = useSupabase ? process.env.SUPABASE_JWT_SECRET! : localJwtSecret;
const resetJwtSecret = process.env.RESET_JWT_SECRET || jwtSecret;

const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

const hashPassword = (password: string): string => {
  return crypto.scryptSync(password, 'local-salt', 64).toString('hex');
};

const verifyPassword = (password: string, hash: string): boolean => {
  return hashPassword(password) === hash;
};

const signAccessToken = (userId: string): string => {
  return jwt.sign({ sub: userId, userId }, jwtSecret, { expiresIn: ACCESS_TOKEN_EXPIRY });
};

const signRefreshToken = async (userId: string): Promise<string> => {
  const token = randomUUID() + '-' + randomUUID();
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS);
  await prisma.refreshToken.create({ data: { userId, token, expiresAt } });
  return token;
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

  if (useSupabase && supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
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

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash || !verifyPassword(password, user.passwordHash)) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const accessToken = signAccessToken(user.id);
    const refreshToken = await signRefreshToken(user.id);

    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
        country: (user.country as any) || null,
        avatarUrl: user.avatarUrl || null,
      },
    });
  } catch (err) {
    console.error('Auth: login DB error', err);
    res.status(401).json({ error: 'Invalid email or password' });
  }
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

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  const result = refreshSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: 'Refresh token is required' });
    return;
  }

  const { refreshToken: token } = result.data;

  const stored = await prisma.refreshToken.findUnique({ where: { token } });
  if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
    res.status(401).json({ error: 'Invalid or expired refresh token' });
    return;
  }

  // Rotate: revoke old token
  await prisma.refreshToken.update({
    where: { id: stored.id },
    data: { revokedAt: new Date() },
  });

  // Issue new pair
  const accessToken = signAccessToken(stored.userId);
  const newRefreshToken = await signRefreshToken(stored.userId);

  res.json({ accessToken, refreshToken: newRefreshToken });
};

export const logout = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }

  // Revoke all refresh tokens for the user (clean logout = revoke all sessions)
  await prisma.refreshToken.updateMany({
    where: { userId: req.user.id, revokedAt: null },
    data: { revokedAt: new Date() },
  });

  res.json({ message: 'Logged out successfully' });
};

export const listUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  const users = await prisma.user.findMany({ select: { id: true, email: true, fullName: true, role: true, country: true } });
  res.json({ users });
};
