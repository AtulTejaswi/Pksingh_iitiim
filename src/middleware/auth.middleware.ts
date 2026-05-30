import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/db';

export interface AuthRequest extends Request {
  user?: { id: string; supabaseId: string; role: string; email: string };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const secret = process.env.SUPABASE_JWT_SECRET || process.env.LOCAL_JWT_SECRET;
    if (!secret) {
      res.status(500).json({ error: 'Server misconfiguration: JWT secret is missing' });
      return;
    }

    const decoded = jwt.verify(token, secret) as { sub: string; userId?: string };

    const user = await prisma.user.findUnique({
      where: decoded.userId ? { id: decoded.userId } : { supabaseId: decoded.sub },
    });

    if (!user) {
      res.status(401).json({ error: 'User not found. Please complete registration.' });
      return;
    }

    req.user = {
      id: user.id,
      supabaseId: user.supabaseId,
      role: user.role,
      email: user.email,
    };

    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
    return;
  }
};
