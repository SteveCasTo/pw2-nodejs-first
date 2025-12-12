import { Request, Response, NextFunction } from 'express';
import { opcionPreguntaService } from '@services/opcionPregunta.service';

export const opcionPreguntaController = {
  async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const opciones = await opcionPreguntaService.getAll();

      res.status(200).json({
        success: true,
        data: opciones,
        count: opciones.length,
      });
    } catch (error) {
      next(error);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const opcion = await opcionPreguntaService.getById(id!);

      if (!opcion) {
        res.status(404).json({
          success: false,
          message: 'Opción no encontrada',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: opcion,
      });
    } catch (error) {
      next(error);
    }
  },

  async getByPreguntaId(req: Request, res: Response, next: NextFunction) {
    try {
      const { idPregunta } = req.params;

      const opciones = await opcionPreguntaService.getByPreguntaId(idPregunta!);

      res.status(200).json({
        success: true,
        data: opciones,
        count: opciones.length,
      });
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        id_pregunta,
        texto_opcion,
        id_contenido_opcion,
        es_correcta,
        orden,
      } = req.body;

      const nuevaOpcion = await opcionPreguntaService.create({
        id_pregunta,
        texto_opcion,
        id_contenido_opcion,
        es_correcta,
        orden,
      });

      res.status(201).json({
        success: true,
        message: 'Opción creada exitosamente',
        data: nuevaOpcion,
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
        texto_opcion,
        id_contenido_opcion,
        es_correcta,
        orden,
      } = req.body;

      const opcionActualizada = await opcionPreguntaService.update(id!, {
        id_pregunta,
        texto_opcion,
        id_contenido_opcion,
        es_correcta,
        orden,
      });

      if (!opcionActualizada) {
        res.status(404).json({
          success: false,
          message: 'Opción no encontrada',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Opción actualizada exitosamente',
        data: opcionActualizada,
      });
    } catch (error) {
      next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const opcionEliminada = await opcionPreguntaService.delete(id!);

      if (!opcionEliminada) {
        res.status(404).json({
          success: false,
          message: 'Opción no encontrada',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Opción eliminada exitosamente',
        data: opcionEliminada,
      });
    } catch (error) {
      next(error);
    }
  },
};
