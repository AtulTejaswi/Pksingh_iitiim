import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';

export const requireRole = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }
    // SUPER_ADMIN has access to everything
    if (req.user.role === 'SUPER_ADMIN') {
      return next();
    }
    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }
    next();
  };
};

export const superAdminOnly = requireRole('SUPER_ADMIN');
export const mentorOrAdmin = requireRole('SUPER_ADMIN', 'MENTOR', 'INSTRUCTOR');
export const instructorOnly = requireRole('INSTRUCTOR');
export const studentOnly = requireRole('STUDENT');
