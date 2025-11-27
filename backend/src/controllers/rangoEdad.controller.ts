import { Request, Response, NextFunction } from 'express';
import { rangoEdadService } from '@services/rangoEdad.service';

export const rangoEdadController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { activo } = req.query;

      const filtros = {
        ...(activo !== undefined && { activo: activo === 'true' }),
      };

      const rangos = await rangoEdadService.getAll(filtros);

      res.status(200).json({
        success: true,
        data: rangos,
        count: rangos.length,
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

      const rango = await rangoEdadService.getById(id);

      res.status(200).json({
        success: true,
        data: rango,
      });
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const rango = await rangoEdadService.create(req.body);

      res.status(201).json({
        success: true,
        message: 'Rango de edad creado exitosamente',
        data: rango,
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

      const rango = await rangoEdadService.update(id, req.body);

      res.status(200).json({
        success: true,
        message: 'Rango de edad actualizado exitosamente',
        data: rango,
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

      const rango = await rangoEdadService.delete(id);

      res.status(200).json({
        success: true,
        message: 'Rango de edad desactivado exitosamente',
        data: rango,
      });
    } catch (error) {
      next(error);
    }
  },
};
