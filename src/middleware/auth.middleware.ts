import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/db';
import { resolveJwtSecret } from '../utils/jwtSecret';

export interface AuthRequest extends Request {
  user?: { id: string; supabaseId: string; role: string; email: string };
}

const attachUserFromToken = async (req: AuthRequest, token: string): Promise<boolean> => {
  const secret = resolveJwtSecret();
  if (!secret) {
    return false;
  }

  const decoded = jwt.verify(token, secret) as { sub: string; userId?: string };
  const user = await prisma.user.findUnique({
    where: decoded.userId ? { id: decoded.userId } : { supabaseId: decoded.sub },
  });

  if (!user) {
    return false;
  }

  req.user = {
    id: user.id,
    supabaseId: user.supabaseId,
    role: user.role,
    email: user.email,
  };
  return true;
};

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
    if (!resolveJwtSecret()) {
      res.status(500).json({ error: 'Server misconfiguration: JWT secret is missing' });
      return;
    }

    const ok = await attachUserFromToken(req, token);
    if (!ok) {
      res.status(401).json({ error: 'User not found. Please complete registration.' });
      return;
    }

    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

/** Sets req.user when a valid token is present; continues without user otherwise. */
export const optionalAuthenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    next();
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    await attachUserFromToken(req, token);
  } catch {
    // Invalid token on optional routes — treat as guest
  }
  next();
};
