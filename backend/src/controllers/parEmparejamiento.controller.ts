import { Request, Response, NextFunction } from 'express';
import { parEmparejamientoService } from '@services/parEmparejamiento.service';

export const parEmparejamientoController = {
  async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const pares = await parEmparejamientoService.getAll();

      res.status(200).json({
        success: true,
        data: pares,
        count: pares.length,
      });
    } catch (error) {
      next(error);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const par = await parEmparejamientoService.getById(id!);

      if (!par) {
        res.status(404).json({
          success: false,
          message: 'Par no encontrado',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: par,
      });
    } catch (error) {
      next(error);
    }
  },

  async getByPreguntaId(req: Request, res: Response, next: NextFunction) {
    try {
      const { idPregunta } = req.params;

      const pares = await parEmparejamientoService.getByPreguntaId(idPregunta!);

      res.status(200).json({
        success: true,
        data: pares,
        count: pares.length,
      });
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        id_pregunta,
        texto_pregunta,
        id_contenido_pregunta,
        texto_respuesta,
        id_contenido_respuesta,
        orden,
      } = req.body;

      const nuevoPar = await parEmparejamientoService.create({
        id_pregunta,
        texto_pregunta,
        id_contenido_pregunta,
        texto_respuesta,
        id_contenido_respuesta,
        orden,
      });

      res.status(201).json({
        success: true,
        message: 'Par creado exitosamente',
        data: nuevoPar,
      });
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const {
        id_pregunta,
        texto_pregunta,
        id_contenido_pregunta,
        texto_respuesta,
        id_contenido_respuesta,
        orden,
      } = req.body;

      const parActualizado = await parEmparejamientoService.update(id!, {
        id_pregunta,
        texto_pregunta,
        id_contenido_pregunta,
        texto_respuesta,
        id_contenido_respuesta,
        orden,
      });

      if (!parActualizado) {
        res.status(404).json({
          success: false,
          message: 'Par no encontrado',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Par actualizado exitosamente',
        data: parActualizado,
      });
    } catch (error) {
      next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const parEliminado = await parEmparejamientoService.delete(id!);

      if (!parEliminado) {
        res.status(404).json({
          success: false,
          message: 'Par no encontrado',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Par eliminado exitosamente',
        data: parEliminado,
      });
    } catch (error) {
      next(error);
    }
  },
};
