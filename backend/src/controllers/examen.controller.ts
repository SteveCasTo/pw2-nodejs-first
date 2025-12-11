import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/auth.types';
import { examenService } from '@services/examen.service';

export const examenController = {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id_ciclo, activo, creado_por } = req.query;

      const filtros = {
        id_ciclo: id_ciclo as string | undefined,
        activo:
          activo === 'false' ? false : activo === 'true' ? true : undefined,
        creado_por: creado_por as string | undefined,
      };

      const examenes = await examenService.getAll(filtros);

      res.status(200).json({
        success: true,
        data: examenes,
        count: examenes.length,
      });
    } catch (error) {
      next(error);
    }
  },

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const examen = await examenService.getById(id!);

      if (!examen) {
        res.status(404).json({
          success: false,
          message: 'Examen no encontrado',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: examen,
      });
    } catch (error) {
      next(error);
    }
  },

  async getExamenesDisponibles(
    _req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const examenes = await examenService.getExamenesDisponibles();

      res.status(200).json({
        success: true,
        data: examenes,
        count: examenes.length,
      });
    } catch (error) {
      next(error);
    }
  },

  async getExamenesProximos(
    _req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const examenes = await examenService.getExamenesProximos();

      res.status(200).json({
        success: true,
        data: examenes,
        count: examenes.length,
      });
    } catch (error) {
      next(error);
    }
  },

  async getExamenesFinalizados(
    _req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const examenes = await examenService.getExamenesFinalizados();

      res.status(200).json({
        success: true,
        data: examenes,
        count: examenes.length,
      });
    } catch (error) {
      next(error);
    }
  },

  async getEstadisticas(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const estadisticas = await examenService.getEstadisticas(id!);

      res.status(200).json({
        success: true,
        data: estadisticas,
      });
    } catch (error) {
      next(error);
    }
  },

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const {
        titulo,
        descripcion,
        id_ciclo,
        fecha_inicio,
        fecha_fin,
        duracion_minutos,
        intentos_permitidos,
        calificacion_minima,
        mostrar_resultados,
        aleatorizar_preguntas,
        aleatorizar_opciones,
      } = req.body;

      // El creador es el usuario autenticado
      const creado_por = req.user!.id;

      const nuevoExamen = await examenService.create({
        titulo,
        descripcion,
        id_ciclo,
        fecha_inicio,
        fecha_fin,
        duracion_minutos,
        intentos_permitidos,
        calificacion_minima,
        mostrar_resultados,
        aleatorizar_preguntas,
        aleatorizar_opciones,
        creado_por,
      });

      res.status(201).json({
        success: true,
        message: 'Examen creado exitosamente',
        data: nuevoExamen,
      });
    } catch (error) {
      next(error);
    }
  },

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const {
        titulo,
        descripcion,
        id_ciclo,
        fecha_inicio,
        fecha_fin,
        duracion_minutos,
        intentos_permitidos,
        calificacion_minima,
        mostrar_resultados,
        aleatorizar_preguntas,
        aleatorizar_opciones,
      } = req.body;

      const examenActualizado = await examenService.update(id!, {
        titulo,
        descripcion,
        id_ciclo,
        fecha_inicio,
        fecha_fin,
        duracion_minutos,
        intentos_permitidos,
        calificacion_minima,
        mostrar_resultados,
        aleatorizar_preguntas,
        aleatorizar_opciones,
      });

      if (!examenActualizado) {
        res.status(404).json({
          success: false,
          message: 'Examen no encontrado',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Examen actualizado exitosamente',
        data: examenActualizado,
      });
    } catch (error) {
      next(error);
    }
  },

  async desactivar(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const examenDesactivado = await examenService.desactivar(id!);

      if (!examenDesactivado) {
        res.status(404).json({
          success: false,
          message: 'Examen no encontrado',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Examen desactivado exitosamente',
        data: examenDesactivado,
      });
    } catch (error) {
      next(error);
    }
  },

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const examenEliminado = await examenService.delete(id!);

      if (!examenEliminado) {
        res.status(404).json({
          success: false,
          message: 'Examen no encontrado',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Examen eliminado exitosamente',
        data: examenEliminado,
      });
    } catch (error) {
      next(error);
    }
  },
};
