import { Request, Response } from 'express';
import { AuthRequest } from '../types/auth.types';
import privilegioService from '@services/privilegio.service';

const privilegioController = {
  getAll: async (req: Request, res: Response): Promise<void> => {
    try {
      const activo =
        req.query.activo !== undefined
          ? req.query.activo === 'true'
          : undefined;
      const privilegios = await privilegioService.getAll(activo);

      res.status(200).json({
        success: true,
        count: privilegios.length,
        data: privilegios,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Error al obtener privilegios',
      });
    }
  },

  getById: async (req: Request, res: Response): Promise<void> => {
    try {
      const privilegio = await privilegioService.getById(
        req.params.id as string
      );

      res.status(200).json({
        success: true,
        data: privilegio,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        error:
          error instanceof Error ? error.message : 'Privilegio no encontrado',
      });
    }
  },

  create: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const privilegio = await privilegioService.create({
        ...req.body,
        creado_por: req.user?.id,
      });

      res.status(201).json({
        success: true,
        data: privilegio,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error:
          error instanceof Error ? error.message : 'Error al crear privilegio',
      });
    }
  },

  update: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const privilegio = await privilegioService.update(
        req.params.id as string,
        {
          ...req.body,
          actualizado_por: req.user?.id,
        }
      );

      res.status(200).json({
        success: true,
        data: privilegio,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Error al actualizar privilegio',
      });
    }
  },

  desactivar: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'No autorizado',
        });
        return;
      }

      const privilegio = await privilegioService.delete(
        req.params.id as string,
        req.user.id
      );

      res.status(200).json({
        success: true,
        data: privilegio,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Error al desactivar privilegio',
      });
    }
  },

  delete: async (req: Request, res: Response): Promise<void> => {
    try {
      await privilegioService.hardDelete(req.params.id as string);

      res.status(200).json({
        success: true,
        data: {},
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Error al eliminar privilegio',
      });
    }
  },
};

export default privilegioController;
