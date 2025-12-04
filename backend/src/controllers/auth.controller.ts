import { Request, Response } from 'express';
import { AuthRequest } from '../types/auth.types';
import authService from '@services/auth.service';

const authController = {
  login: async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await authService.login(req.body);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        error:
          error instanceof Error ? error.message : 'Error al iniciar sesión',
      });
    }
  },

  register: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'No autorizado',
        });
        return;
      }

      const result = await authService.register(req.body, req.user.id);

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error:
          error instanceof Error ? error.message : 'Error al registrar usuario',
      });
    }
  },

  getMe: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'No autorizado',
        });
        return;
      }

      const result = await authService.getMe(req.user.id);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Error al obtener información del usuario',
      });
    }
  },

  changePassword: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'No autorizado',
        });
        return;
      }

      const result = await authService.changePassword(req.user.id, req.body);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Error al cambiar contraseña',
      });
    }
  },
};

export default authController;
