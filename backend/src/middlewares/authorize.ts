import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/auth.types';

export const restrictTo = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'No autorizado. Usuario no autenticado',
      });
      return;
    }

    const hasPermission = req.user.privilegios.some(privilegio =>
      roles.includes(privilegio)
    );

    if (!hasPermission) {
      res.status(403).json({
        success: false,
        error: 'No tienes permisos para realizar esta acción',
        requiredRoles: roles,
        yourRoles: req.user.privilegios,
      });
      return;
    }

    next();
  };
};
