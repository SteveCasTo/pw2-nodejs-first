import { Request, Response, NextFunction } from 'express';
import { categoriaService } from '@services/categoria.service';

export const categoriaController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { activo } = req.query;

      const filtros = {
        activo: activo === 'false' ? false : true,
      };

      const categorias = await categoriaService.getAll(filtros);

      res.status(200).json({
        success: true,
        data: categorias,
        count: categorias.length,
      });
    } catch (error) {
      next(error);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'El ID es requerido',
        });
        return;
      }

      const categoria = await categoriaService.getById(id);

      res.status(200).json({
        success: true,
        data: categoria,
      });
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const nuevaCategoria = await categoriaService.create(req.body);

      res.status(201).json({
        success: true,
        message: 'Categoría creada exitosamente',
        data: nuevaCategoria,
      });
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'El ID es requerido',
        });
        return;
      }

      const categoriaActualizada = await categoriaService.update(id, req.body);

      res.status(200).json({
        success: true,
        message: 'Categoría actualizada exitosamente',
        data: categoriaActualizada,
      });
    } catch (error) {
      next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'El ID es requerido',
        });
        return;
      }

      const categoriaEliminada = await categoriaService.delete(id);

      res.status(200).json({
        success: true,
        message: 'Categoría desactivada exitosamente',
        data: categoriaEliminada,
      });
    } catch (error) {
      next(error);
    }
  },
};
