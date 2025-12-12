import { Request, Response, NextFunction } from 'express';
import { respuestaModeloService } from '@services/respuestaModelo.service';

export const respuestaModeloController = {
  async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const respuestas = await respuestaModeloService.getAll();

      res.status(200).json({
        success: true,
        data: respuestas,
        count: respuestas.length,
      });
    } catch (error) {
      next(error);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const respuesta = await respuestaModeloService.getById(id!);

      if (!respuesta) {
        res.status(404).json({
          success: false,
          message: 'Respuesta modelo no encontrada',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: respuesta,
      });
    } catch (error) {
      next(error);
    }
  },

  async getByPreguntaId(req: Request, res: Response, next: NextFunction) {
    try {
      const { idPregunta } = req.params;

      const respuesta = await respuestaModeloService.getByPreguntaId(
        idPregunta!
      );

      if (!respuesta) {
        res.status(404).json({
          success: false,
          message: 'No se encontró respuesta modelo para esta pregunta',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: respuesta,
      });
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { id_pregunta, respuesta_texto, palabras_clave } = req.body;

      const nuevaRespuesta = await respuestaModeloService.create({
        id_pregunta,
        respuesta_texto,
        palabras_clave,
      });

      res.status(201).json({
        success: true,
        message: 'Respuesta modelo creada exitosamente',
        data: nuevaRespuesta,
      });
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { id_pregunta, respuesta_texto, palabras_clave } = req.body;

      const respuestaActualizada = await respuestaModeloService.update(id!, {
        id_pregunta,
        respuesta_texto,
        palabras_clave,
      });

      if (!respuestaActualizada) {
        res.status(404).json({
          success: false,
          message: 'Respuesta modelo no encontrada',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Respuesta modelo actualizada exitosamente',
        data: respuestaActualizada,
      });
    } catch (error) {
      next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const respuestaEliminada = await respuestaModeloService.delete(id!);

      if (!respuestaEliminada) {
        res.status(404).json({
          success: false,
          message: 'Respuesta modelo no encontrada',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Respuesta modelo eliminada exitosamente',
        data: respuestaEliminada,
      });
    } catch (error) {
      next(error);
    }
  },
};
