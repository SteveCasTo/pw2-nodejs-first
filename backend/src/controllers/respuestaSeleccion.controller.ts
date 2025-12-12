import { Request, Response, NextFunction } from 'express';
import { RespuestaSeleccion } from '@models/respuestaSeleccion.model';
import { OpcionPregunta } from '@models/opcionPregunta.model';
import { ExamenPregunta } from '@models/examenPregunta.model';

export const respuestaSeleccionController = {
  getAll: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const respuestas = await RespuestaSeleccion.find()
        .populate('id_intento')
        .populate('id_examen_pregunta')
        .populate('id_opcion_seleccionada')
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
      const respuesta = await RespuestaSeleccion.findById(req.params.id)
        .populate('id_intento')
        .populate('id_examen_pregunta')
        .populate('id_opcion_seleccionada');

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
      const respuestas = await RespuestaSeleccion.find({ id_intento: req.params.idIntento })
        .populate('id_examen_pregunta')
        .populate('id_opcion_seleccionada')
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
      const { id_opcion_seleccionada, id_examen_pregunta } = req.body;

      // Verificar si la opción es correcta
      const opcion = await OpcionPregunta.findById(id_opcion_seleccionada);
      if (!opcion) {
        res.status(404).json({
          success: false,
          message: 'Opción no encontrada',
        });
        return;
      }

      // Obtener los puntos de la pregunta
      const examenPregunta = await ExamenPregunta.findById(id_examen_pregunta)
        .populate('id_pregunta');
      
      if (!examenPregunta) {
        res.status(404).json({
          success: false,
          message: 'Pregunta del examen no encontrada',
        });
        return;
      }

      const esCorrecta = opcion.es_correcta || false;
      const puntosObtenidos = esCorrecta ? examenPregunta.puntos_asignados : 0;

      const nuevaRespuesta = new RespuestaSeleccion({
        ...req.body,
        es_correcta: esCorrecta,
        puntos_obtenidos: puntosObtenidos,
      });

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
      const respuestaActualizada = await RespuestaSeleccion.findByIdAndUpdate(
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
      const respuestaEliminada = await RespuestaSeleccion.findByIdAndDelete(req.params.id);

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
