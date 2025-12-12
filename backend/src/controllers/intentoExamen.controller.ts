import { Request, Response, NextFunction } from 'express';
import { IntentoExamen } from '@models/intentoExamen.model';
import { RespuestaSeleccion } from '@models/respuestaSeleccion.model';
import { RespuestaDesarrollo } from '@models/respuestaDesarrollo.model';
import { RespuestaEmparejamiento } from '@models/respuestaEmparejamiento.model';

export const intentoExamenController = {
  getAll: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const intentos = await IntentoExamen.find()
        .populate('id_examen', 'titulo descripcion')
        .populate('id_usuario', 'nombre correo_electronico')
        .sort({ fecha_inicio: -1 });

      res.status(200).json({
        success: true,
        data: intentos,
      });
    } catch (error) {
      next(error);
    }
  },

  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const intento = await IntentoExamen.findById(req.params.id)
        .populate('id_examen')
        .populate('id_usuario', 'nombre correo_electronico');

      if (!intento) {
        res.status(404).json({
          success: false,
          message: 'Intento de examen no encontrado',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: intento,
      });
    } catch (error) {
      next(error);
    }
  },

  getByExamen: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const intentos = await IntentoExamen.find({
        id_examen: req.params.idExamen,
      })
        .populate('id_usuario', 'nombre correo_electronico')
        .sort({ fecha_inicio: -1 });

      res.status(200).json({
        success: true,
        data: intentos,
      });
    } catch (error) {
      next(error);
    }
  },

  getByUsuario: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const intentos = await IntentoExamen.find({
        id_usuario: req.params.idUsuario,
      })
        .populate('id_examen', 'titulo descripcion')
        .sort({ fecha_inicio: -1 });

      res.status(200).json({
        success: true,
        data: intentos,
      });
    } catch (error) {
      next(error);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const nuevoIntento = new IntentoExamen(req.body);
      await nuevoIntento.save();

      res.status(201).json({
        success: true,
        data: nuevoIntento,
        message: 'Intento de examen creado exitosamente',
      });
    } catch (error) {
      next(error);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const intentoActualizado = await IntentoExamen.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );

      if (!intentoActualizado) {
        res.status(404).json({
          success: false,
          message: 'Intento de examen no encontrado',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: intentoActualizado,
        message: 'Intento de examen actualizado exitosamente',
      });
    } catch (error) {
      next(error);
    }
  },

  finalizar: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const intento = await IntentoExamen.findById(req.params.id);

      if (!intento) {
        res.status(404).json({
          success: false,
          message: 'Intento de examen no encontrado',
        });
        return;
      }

      if (intento.completado) {
        res.status(400).json({
          success: false,
          message: 'El intento ya ha sido finalizado',
        });
        return;
      }

      // Marcar como completado
      intento.completado = true;
      intento.fecha_finalizacion = new Date();

      // Calcular puntos totales
      let puntosObtenidos = 0;
      let puntosTotales = 0;

      // Obtener todas las respuestas de selección
      const respuestasSeleccion = await RespuestaSeleccion.find({
        id_intento: intento._id,
      });
      for (const respuesta of respuestasSeleccion) {
        puntosObtenidos += respuesta.puntos_obtenidos || 0;
        puntosTotales += respuesta.puntos_obtenidos || 0; // Aquí deberías obtener los puntos de la pregunta
      }

      // Obtener respuestas de desarrollo calificadas
      const respuestasDesarrollo = await RespuestaDesarrollo.find({
        id_intento: intento._id,
        calificada: true,
      });
      for (const respuesta of respuestasDesarrollo) {
        puntosObtenidos += respuesta.puntos_obtenidos || 0;
      }

      // Verificar si hay respuestas de desarrollo pendientes
      const respuestasDesarrolloPendientes = await RespuestaDesarrollo.find({
        id_intento: intento._id,
        calificada: false,
      });

      if (respuestasDesarrolloPendientes.length > 0) {
        intento.requiere_revision_manual = true;
      }

      intento.puntos_obtenidos = puntosObtenidos;
      intento.puntos_totales = puntosTotales;

      // Calcular calificación (porcentaje)
      if (puntosTotales > 0) {
        intento.calificacion = (puntosObtenidos / puntosTotales) * 100;
      }

      await intento.save();

      res.status(200).json({
        success: true,
        data: intento,
        message: 'Intento de examen finalizado exitosamente',
      });
    } catch (error) {
      next(error);
    }
  },

  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const intentoEliminado = await IntentoExamen.findByIdAndDelete(
        req.params.id
      );

      if (!intentoEliminado) {
        res.status(404).json({
          success: false,
          message: 'Intento de examen no encontrado',
        });
        return;
      }

      // Eliminar todas las respuestas asociadas
      await Promise.all([
        RespuestaSeleccion.deleteMany({ id_intento: req.params.id }),
        RespuestaDesarrollo.deleteMany({ id_intento: req.params.id }),
        RespuestaEmparejamiento.deleteMany({ id_intento: req.params.id }),
      ]);

      res.status(200).json({
        success: true,
        message: 'Intento de examen eliminado exitosamente',
      });
    } catch (error) {
      next(error);
    }
  },
};
