import { Request, Response, NextFunction } from 'express';
import { preguntaService } from '@services/pregunta.service';

export const preguntaController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        tipo_pregunta,
        id_subcategoria,
        id_dificultad,
        id_estado,
        activa,
      } = req.query;

      const filtros = {
        tipo_pregunta: tipo_pregunta as
          | 'seleccion_multiple'
          | 'verdadero_falso'
          | 'desarrollo'
          | 'respuesta_corta'
          | 'emparejamiento'
          | undefined,
        id_subcategoria: id_subcategoria as string | undefined,
        id_dificultad: id_dificultad as string | undefined,
        id_estado: id_estado as string | undefined,
        activa:
          activa === 'false' ? false : activa === 'true' ? true : undefined,
      };

      const preguntas = await preguntaService.getAll(filtros);

      res.status(200).json({
        success: true,
        data: preguntas,
        count: preguntas.length,
      });
    } catch (error) {
      next(error);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const pregunta = await preguntaService.getById(id!);

      if (!pregunta) {
        res.status(404).json({
          success: false,
          message: 'Pregunta no encontrada',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: pregunta,
      });
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const nuevaPregunta = await preguntaService.create(req.body);

      res.status(201).json({
        success: true,
        message: 'Pregunta creada exitosamente',
        data: nuevaPregunta,
      });
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const preguntaActualizada = await preguntaService.update(id!, req.body);

      if (!preguntaActualizada) {
        res.status(404).json({
          success: false,
          message: 'Pregunta no encontrada',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Pregunta actualizada exitosamente',
        data: preguntaActualizada,
      });
    } catch (error) {
      next(error);
    }
  },

  async desactivar(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const preguntaDesactivada = await preguntaService.delete(id!);

      if (!preguntaDesactivada) {
        res.status(404).json({
          success: false,
          message: 'Pregunta no encontrada',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Pregunta desactivada exitosamente',
        data: preguntaDesactivada,
      });
    } catch (error) {
      next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const preguntaEliminada = await preguntaService.hardDelete(id!);

      if (!preguntaEliminada) {
        res.status(404).json({
          success: false,
          message: 'Pregunta no encontrada',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Pregunta eliminada permanentemente',
        data: preguntaEliminada,
      });
    } catch (error) {
      next(error);
    }
  },
};
