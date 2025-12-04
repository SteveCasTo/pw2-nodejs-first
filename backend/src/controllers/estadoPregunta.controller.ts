import { Request, Response, NextFunction } from 'express';
import { estadoPreguntaService } from '@services/estadoPregunta.service';

export const estadoPreguntaController = {
  async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const estados = await estadoPreguntaService.getAll();

      res.status(200).json({
        success: true,
        data: estados,
        count: estados.length,
      });
    } catch (error) {
      next(error);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const estado = await estadoPreguntaService.getById(id!);

      if (!estado) {
        res.status(404).json({
          success: false,
          message: 'Estado de pregunta no encontrado',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: estado,
      });
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const nuevoEstado = await estadoPreguntaService.create(req.body);

      res.status(201).json({
        success: true,
        message: 'Estado de pregunta creado exitosamente',
        data: nuevoEstado,
      });
    } catch (error) {
      next(error);
    }
  },
};
