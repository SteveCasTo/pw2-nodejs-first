import { Request, Response } from 'express';
import { AuthRequest } from '../types/auth.types';
import cicloService from '@services/ciclo.service';

const cicloController = {
  getAll: async (req: Request, res: Response): Promise<void> => {
    try {
      const activo =
        req.query.activo !== undefined
          ? req.query.activo === 'true'
          : undefined;
      const ciclos = await cicloService.getAll(activo);

      res.status(200).json({
        success: true,
        count: ciclos.length,
        data: ciclos,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error:
          error instanceof Error ? error.message : 'Error al obtener ciclos',
      });
    }
  },

  getById: async (req: Request, res: Response): Promise<void> => {
    try {
      const ciclo = await cicloService.getById(req.params.id as string);

      res.status(200).json({
        success: true,
        data: ciclo,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error instanceof Error ? error.message : 'Ciclo no encontrado',
      });
    }
  },

  create: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'No autorizado',
        });
        return;
      }

      const ciclo = await cicloService.create({
        ...req.body,
        creado_por: req.user.id,
      });

      res.status(201).json({
        success: true,
        data: ciclo,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error al crear ciclo',
      });
    }
  },

  update: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const ciclo = await cicloService.update(req.params.id as string, {
        ...req.body,
        actualizado_por: req.user?.id,
      });

      res.status(200).json({
        success: true,
        data: ciclo,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error:
          error instanceof Error ? error.message : 'Error al actualizar ciclo',
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

      const ciclo = await cicloService.delete(
        req.params.id as string,
        req.user.id
      );

      res.status(200).json({
        success: true,
        data: ciclo,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error:
          error instanceof Error ? error.message : 'Error al desactivar ciclo',
      });
    }
  },

  delete: async (req: Request, res: Response): Promise<void> => {
    try {
      await cicloService.hardDelete(req.params.id as string);

      res.status(200).json({
        success: true,
        data: {},
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error:
          error instanceof Error ? error.message : 'Error al eliminar ciclo',
      });
    }
  },
};

export default cicloController;
