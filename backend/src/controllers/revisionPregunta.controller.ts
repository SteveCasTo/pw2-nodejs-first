import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/auth.types';
import { revisionPreguntaService } from '@services/revisionPregunta.service';

export const revisionPreguntaController = {
  async getAll(_req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const revisiones = await revisionPreguntaService.getAll();

      res.status(200).json({
        success: true,
        data: revisiones,
        count: revisiones.length,
      });
    } catch (error) {
      next(error);
    }
  },

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const revision = await revisionPreguntaService.getById(id!);

      if (!revision) {
        res.status(404).json({
          success: false,
          message: 'Revisión no encontrada',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: revision,
      });
    } catch (error) {
      next(error);
    }
  },

  async getByPreguntaId(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { idPregunta } = req.params;

      const revisiones = await revisionPreguntaService.getByPreguntaId(
        idPregunta!
      );

      res.status(200).json({
        success: true,
        data: revisiones,
        count: revisiones.length,
      });
    } catch (error) {
      next(error);
    }
  },

  async getByRevisorId(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { idRevisor } = req.params;

      const revisiones = await revisionPreguntaService.getByRevisorId(
        idRevisor!
      );

      res.status(200).json({
        success: true,
        data: revisiones,
        count: revisiones.length,
      });
    } catch (error) {
      next(error);
    }
  },

  async getPreguntasPendientes(
    _req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const preguntas = await revisionPreguntaService.getPreguntasPendientes();

      res.status(200).json({
        success: true,
        data: preguntas,
        count: preguntas.length,
      });
    } catch (error) {
      next(error);
    }
  },

  async getEstadisticasRevisor(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { idRevisor } = req.params;

      const estadisticas = await revisionPreguntaService.getEstadisticasRevisor(
        idRevisor!
      );

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
      const { id_pregunta, voto, comentario } = req.body;

      // El revisor es el usuario autenticado
      const id_revisor = req.user!.id;

      const nuevaRevision = await revisionPreguntaService.create({
        id_pregunta,
        id_revisor,
        voto,
        comentario,
      });

      res.status(201).json({
        success: true,
        message: 'Revisión creada exitosamente',
        data: nuevaRevision,
      });
    } catch (error) {
      next(error);
    }
  },

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { comentario } = req.body;

      const revisionActualizada = await revisionPreguntaService.update(id!, {
        comentario,
      });

      if (!revisionActualizada) {
        res.status(404).json({
          success: false,
          message: 'Revisión no encontrada',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Revisión actualizada exitosamente',
        data: revisionActualizada,
      });
    } catch (error) {
      next(error);
    }
  },

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const revisionEliminada = await revisionPreguntaService.delete(id!);

      if (!revisionEliminada) {
        res.status(404).json({
          success: false,
          message: 'Revisión no encontrada',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Revisión eliminada exitosamente',
        data: revisionEliminada,
      });
    } catch (error) {
      next(error);
    }
  },

  async cambiarEstadoPregunta(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { idPregunta } = req.params;
      const { estado } = req.body;

      const preguntaActualizada =
        await revisionPreguntaService.cambiarEstadoPregunta(
          idPregunta!,
          estado
        );

      res.status(200).json({
        success: true,
        message: 'Estado de pregunta actualizado exitosamente',
        data: preguntaActualizada,
      });
    } catch (error) {
      next(error);
    }
  },
};
