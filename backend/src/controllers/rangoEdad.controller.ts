import { Request, Response, NextFunction } from 'express';
import { rangoEdadService } from '@services/rangoEdad.service';

export class RangoEdadController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { activo } = req.query;
      
      const filtros = activo !== undefined ? { activo: activo === 'true' } : undefined;
      
      const rangos = await rangoEdadService.getAll(filtros);
      
      res.status(200).json({
        success: true,
        data: rangos,
        count: rangos.length,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({
          success: false,
          message: 'ID es requerido',
        });
        return;
      }
      
      const rango = await rangoEdadService.getById(id);
      
      if (!rango) {
        res.status(404).json({
          success: false,
          message: 'Rango de edad no encontrado',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: rango,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { nombre_rango, edad_minima, edad_maxima, activo } = req.body;

      if (!nombre_rango || edad_minima === undefined || edad_maxima === undefined) {
        res.status(400).json({
          success: false,
          message: 'Los campos nombre_rango, edad_minima y edad_maxima son requeridos',
        });
        return;
      }

      const nuevoRango = await rangoEdadService.create({
        nombre_rango,
        edad_minima,
        edad_maxima,
        activo,
      });

      res.status(201).json({
        success: true,
        message: 'Rango de edad creado exitosamente',
        data: nuevoRango,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { nombre_rango, edad_minima, edad_maxima, activo } = req.body;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'ID es requerido',
        });
        return;
      }

      const rangoActualizado = await rangoEdadService.update(id, {
        nombre_rango,
        edad_minima,
        edad_maxima,
        activo,
      });

      if (!rangoActualizado) {
        res.status(404).json({
          success: false,
          message: 'Rango de edad no encontrado',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Rango de edad actualizado exitosamente',
        data: rangoActualizado,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'ID es requerido',
        });
        return;
      }

      const rangoEliminado = await rangoEdadService.delete(id);

      if (!rangoEliminado) {
        res.status(404).json({
          success: false,
          message: 'Rango de edad no encontrado',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Rango de edad desactivado exitosamente',
        data: rangoEliminado,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const rangoEdadController = new RangoEdadController();