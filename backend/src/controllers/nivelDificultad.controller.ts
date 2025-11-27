import { Request, Response, NextFunction } from 'express';
import { nivelDificultadService } from '@services/nivelDificultad.service';

export const nivelDificultadController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { nivel, activo } = req.query;

      const filtros = {
        ...(nivel && { nivel: nivel as string }),
        ...(activo !== undefined && { activo: activo === 'true' }),
      };

      const niveles = await nivelDificultadService.getAll(filtros);

      res.status(200).json({
        success: true,
        data: niveles,
        count: niveles.length,
      });
    } catch (error) {
      next(error);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'El ID es requerido',
        });
        return;
      }

      const nivel = await nivelDificultadService.getById(id);

      res.status(200).json({
        success: true,
        data: nivel,
      });
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const nivel = await nivelDificultadService.create(req.body);

      res.status(201).json({
        success: true,
        message: 'Nivel de dificultad creado exitosamente',
        data: nivel,
      });
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'El ID es requerido',
        });
        return;
      }

      const nivel = await nivelDificultadService.update(id, req.body);

      res.status(200).json({
        success: true,
        message: 'Nivel de dificultad actualizado exitosamente',
        data: nivel,
      });
    } catch (error) {
      next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'El ID es requerido',
        });
        return;
      }

      const nivel = await nivelDificultadService.delete(id);

      res.status(200).json({
        success: true,
        message: 'Nivel de dificultad desactivado exitosamente',
        data: nivel,
      });
    } catch (error) {
      next(error);
    }
  },
};
