import { Request, Response, NextFunction } from 'express';
import { contenidoService } from '@services/contenido.service';

export const contenidoController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { tipo_contenido, subido_por } = req.query;

      const filtros = {
        tipo_contenido: tipo_contenido as
          | 'texto'
          | 'imagen'
          | 'audio'
          | 'video'
          | 'documento'
          | 'otro'
          | undefined,
        subido_por: subido_por as string | undefined,
      };

      const contenidos = await contenidoService.getAll(filtros);

      res.status(200).json({
        success: true,
        data: contenidos,
        count: contenidos.length,
      });
    } catch (error) {
      next(error);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const contenido = await contenidoService.getById(id!);

      if (!contenido) {
        res.status(404).json({
          success: false,
          message: 'Contenido no encontrado',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: contenido,
      });
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const nuevoContenido = await contenidoService.create(req.body);

      res.status(201).json({
        success: true,
        message: 'Contenido registrado exitosamente',
        data: nuevoContenido,
      });
    } catch (error) {
      next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const contenidoEliminado = await contenidoService.delete(id!);

      if (!contenidoEliminado) {
        res.status(404).json({
          success: false,
          message: 'Contenido no encontrado',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Contenido eliminado exitosamente',
        data: contenidoEliminado,
      });
    } catch (error) {
      next(error);
    }
  },
};
