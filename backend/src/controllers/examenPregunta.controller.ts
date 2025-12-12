import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/auth.types';
import { examenPreguntaService } from '@services/examenPregunta.service';

export const examenPreguntaController = {
  async getAll(_req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const examenesPreguntas = await examenPreguntaService.getAll();

      res.status(200).json({
        success: true,
        data: examenesPreguntas,
        count: examenesPreguntas.length,
      });
    } catch (error) {
      next(error);
    }
  },

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const examenPregunta = await examenPreguntaService.getById(id!);

      if (!examenPregunta) {
        res.status(404).json({
          success: false,
          message: 'Asociación examen-pregunta no encontrada',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: examenPregunta,
      });
    } catch (error) {
      next(error);
    }
  },

  async getByExamenId(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { idExamen } = req.params;

      const preguntas = await examenPreguntaService.getByExamenId(idExamen!);

      res.status(200).json({
        success: true,
        data: preguntas,
        count: preguntas.length,
      });
    } catch (error) {
      next(error);
    }
  },

  async getPuntajeTotalExamen(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { idExamen } = req.params;

      const puntajeTotal = await examenPreguntaService.getPuntajeTotalExamen(
        idExamen!
      );

      res.status(200).json({
        success: true,
        data: {
          id_examen: idExamen,
          puntaje_total: puntajeTotal,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const {
        id_examen,
        id_pregunta,
        orden_definido,
        puntos_asignados,
        usar_puntos_recomendados,
        obligatoria,
      } = req.body;

      // El usuario que agrega es el usuario autenticado
      const agregada_por = req.user!.id;

      const nuevaExamenPregunta = await examenPreguntaService.create({
        id_examen,
        id_pregunta,
        orden_definido,
        puntos_asignados,
        usar_puntos_recomendados,
        obligatoria,
        agregada_por,
      });

      res.status(201).json({
        success: true,
        message: 'Pregunta agregada al examen exitosamente',
        data: nuevaExamenPregunta,
      });
    } catch (error) {
      next(error);
    }
  },

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const {
        orden_definido,
        puntos_asignados,
        usar_puntos_recomendados,
        obligatoria,
      } = req.body;

      const examenPreguntaActualizada = await examenPreguntaService.update(
        id!,
        {
          orden_definido,
          puntos_asignados,
          usar_puntos_recomendados,
          obligatoria,
        }
      );

      if (!examenPreguntaActualizada) {
        res.status(404).json({
          success: false,
          message: 'Asociación examen-pregunta no encontrada',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Asociación examen-pregunta actualizada exitosamente',
        data: examenPreguntaActualizada,
      });
    } catch (error) {
      next(error);
    }
  },

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const examenPreguntaEliminada = await examenPreguntaService.delete(id!);

      if (!examenPreguntaEliminada) {
        res.status(404).json({
          success: false,
          message: 'Asociación examen-pregunta no encontrada',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Pregunta eliminada del examen exitosamente',
        data: examenPreguntaEliminada,
      });
    } catch (error) {
      next(error);
    }
  },

  async reordenarPreguntas(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { idExamen } = req.params;
      const { ordenamiento } = req.body;

      if (!Array.isArray(ordenamiento) || ordenamiento.length === 0) {
        res.status(400).json({
          success: false,
          message:
            'El campo ordenamiento debe ser un array con al menos un elemento',
        });
        return;
      }

      const resultado = await examenPreguntaService.reordenarPreguntas(
        idExamen!,
        ordenamiento
      );

      res.status(200).json({
        success: true,
        data: resultado,
      });
    } catch (error) {
      next(error);
    }
  },
};
