import { Request, Response, NextFunction } from 'express';
import { RespuestaEmparejamiento } from '@models/respuestaEmparejamiento.model';

export const respuestaEmparejamientoController = {
  getAll: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const respuestas = await RespuestaEmparejamiento.find()
        .populate('id_intento')
        .populate('id_examen_pregunta')
        .populate('id_par')
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
      const respuesta = await RespuestaEmparejamiento.findById(req.params.id)
        .populate('id_intento')
        .populate('id_examen_pregunta')
        .populate('id_par');

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
      const respuestas = await RespuestaEmparejamiento.find({
        id_intento: req.params.idIntento,
      })
        .populate('id_examen_pregunta')
        .populate('id_par')
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
      // El frontend puede enviar un array de pares para una pregunta de emparejamiento
      // Cada par tiene id_par y la respuesta_asignada del estudiante
      const nuevaRespuesta = new RespuestaEmparejamiento(req.body);
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

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const respuestaActualizada =
        await RespuestaEmparejamiento.findByIdAndUpdate(
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
      const respuestaEliminada =
        await RespuestaEmparejamiento.findByIdAndDelete(req.params.id);

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
