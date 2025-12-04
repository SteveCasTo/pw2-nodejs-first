import { Request, Response } from 'express';
import { AuthRequest } from '../types/auth.types';
import usuarioPrivilegioService from '@services/usuarioPrivilegio.service';

const usuarioPrivilegioController = {
  getAll: async (_req: Request, res: Response): Promise<void> => {
    try {
      const usuarioPrivilegios = await usuarioPrivilegioService.getAll();

      res.status(200).json({
        success: true,
        count: usuarioPrivilegios.length,
        data: usuarioPrivilegios,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Error al obtener asignaciones de privilegios',
      });
    }
  },

  getByUserId: async (req: Request, res: Response): Promise<void> => {
    try {
      const usuarioPrivilegios = await usuarioPrivilegioService.getByUserId(
        req.params.userId as string
      );

      res.status(200).json({
        success: true,
        count: usuarioPrivilegios.length,
        data: usuarioPrivilegios,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Error al obtener privilegios del usuario',
      });
    }
  },

  getById: async (req: Request, res: Response): Promise<void> => {
    try {
      const usuarioPrivilegio = await usuarioPrivilegioService.getById(
        req.params.id as string
      );

      res.status(200).json({
        success: true,
        data: usuarioPrivilegio,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Asignación de privilegio no encontrada',
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

      const usuarioPrivilegio = await usuarioPrivilegioService.create({
        ...req.body,
        asignado_por: req.user.id,
      });

      res.status(201).json({
        success: true,
        data: usuarioPrivilegio,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Error al asignar privilegio',
      });
    }
  },

  delete: async (req: Request, res: Response): Promise<void> => {
    try {
      await usuarioPrivilegioService.delete(req.params.id as string);

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
            : 'Error al eliminar asignación de privilegio',
      });
    }
  },

  deleteByUserAndPrivilege: async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      await usuarioPrivilegioService.deleteByUserAndPrivilege(
        req.params.userId as string,
        req.params.privilegioId as string
      );

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
            : 'Error al eliminar asignación de privilegio',
      });
    }
  },
};

export default usuarioPrivilegioController;
