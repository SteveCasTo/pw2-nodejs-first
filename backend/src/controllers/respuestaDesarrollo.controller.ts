import { Request, Response, NextFunction } from 'express';
import { RespuestaDesarrollo } from '@models/respuestaDesarrollo.model';
import { ExamenPregunta } from '@models/examenPregunta.model';
import mongoose from 'mongoose';

export const respuestaDesarrolloController = {
  getAll: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const respuestas = await RespuestaDesarrollo.find()
        .populate('id_intento')
        .populate('id_examen_pregunta')
        .populate('calificada_por', 'nombre correo_electronico')
        .sort({ fecha_respuesta: -1 });

      res.status(200).json({
        success: true,
        data: respuestas,
      });
    } catch (error) {
      next(error);
    }
  },

  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const respuesta = await RespuestaDesarrollo.findById(req.params.id)
        .populate('id_intento')
        .populate('id_examen_pregunta')
        .populate('calificada_por', 'nombre correo_electronico');

      if (!respuesta) {
        res.status(404).json({
          success: false,
          message: 'Respuesta no encontrada',
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

  getByIntento: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const respuestas = await RespuestaDesarrollo.find({
        id_intento: req.params.idIntento,
      })
        .populate('id_examen_pregunta')
        .populate('calificada_por', 'nombre correo_electronico')
        .sort({ fecha_respuesta: 1 });

      res.status(200).json({
        success: true,
        data: respuestas,
      });
    } catch (error) {
      next(error);
    }
  },

  getPendientesCalificacion: async (
    _req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const respuestas = await RespuestaDesarrollo.find({ calificada: false })
        .populate('id_intento')
        .populate('id_examen_pregunta')
        .sort({ fecha_respuesta: 1 });

      res.status(200).json({
        success: true,
        data: respuestas,
      });
    } catch (error) {
      next(error);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const nuevaRespuesta = new RespuestaDesarrollo(req.body);
      await nuevaRespuesta.save();

      res.status(201).json({
        success: true,
        data: nuevaRespuesta,
        message: 'Respuesta registrada exitosamente',
      });
    } catch (error) {
      next(error);
    }
  },

  calificar: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { puntos_obtenidos, comentario_calificador } = req.body;
      const userId = (req as Request & { user?: { _id: string } }).user?._id;

      const respuesta = await RespuestaDesarrollo.findById(req.params.id);

      if (!respuesta) {
        res.status(404).json({
          success: false,
          message: 'Respuesta no encontrada',
        });
        return;
      }

      if (respuesta.calificada) {
        res.status(400).json({
          success: false,
          message: 'Esta respuesta ya ha sido calificada',
        });
        return;
      }

      // Obtener puntos máximos de la pregunta
      const examenPregunta = await ExamenPregunta.findById(
        respuesta.id_examen_pregunta
      );
      if (!examenPregunta) {
        res.status(404).json({
          success: false,
          message: 'Pregunta del examen no encontrada',
        });
        return;
      }

      if (puntos_obtenidos > (examenPregunta.puntos_asignados || 0)) {
        res.status(400).json({
          success: false,
          message: `Los puntos otorgados no pueden exceder ${examenPregunta.puntos_asignados || 0}`,
        });
        return;
      }

      respuesta.puntos_obtenidos = puntos_obtenidos;
      respuesta.comentario_calificador = comentario_calificador;
      respuesta.calificada = true;
      respuesta.calificada_por = userId
        ? new mongoose.Types.ObjectId(userId)
        : undefined;
      respuesta.fecha_calificacion = new Date();

      await respuesta.save();

      res.status(200).json({
        success: true,
        data: respuesta,
        message: 'Respuesta calificada exitosamente',
      });
    } catch (error) {
      next(error);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const respuestaActualizada = await RespuestaDesarrollo.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );

      if (!respuestaActualizada) {
        res.status(404).json({
          success: false,
          message: 'Respuesta no encontrada',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: respuestaActualizada,
        message: 'Respuesta actualizada exitosamente',
      });
    } catch (error) {
      next(error);
    }
  },

  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const respuestaEliminada = await RespuestaDesarrollo.findByIdAndDelete(
        req.params.id
      );

      if (!respuestaEliminada) {
        res.status(404).json({
          success: false,
          message: 'Respuesta no encontrada',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Respuesta eliminada exitosamente',
      });
    } catch (error) {
      next(error);
    }
  },
};
