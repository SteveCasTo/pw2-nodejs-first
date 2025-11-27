import { Request, Response, NextFunction } from 'express';
import { subcategoriaService } from '@services/subcategoria.service';

export const subcategoriaController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { activo, id_categoria } = req.query;

      const filtros = {
        activo: activo === 'false' ? false : true,
        ...(id_categoria &&
          typeof id_categoria === 'string' && { id_categoria }),
      };

      const subcategorias = await subcategoriaService.getAll(filtros);

      res.status(200).json({
        success: true,
        data: subcategorias,
        count: subcategorias.length,
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

      const subcategoria = await subcategoriaService.getById(id);

      res.status(200).json({
        success: true,
        data: subcategoria,
      });
    } catch (error) {
      next(error);
    }
  },

  async getByCategoria(req: Request, res: Response, next: NextFunction) {
    try {
      const { id_categoria } = req.params;

      if (!id_categoria) {
        res.status(400).json({
          success: false,
          message: 'El ID de categoría es requerido',
        });
        return;
      }

      const subcategorias =
        await subcategoriaService.getByCategoria(id_categoria);

      res.status(200).json({
        success: true,
        data: subcategorias,
        count: subcategorias.length,
      });
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const nuevaSubcategoria = await subcategoriaService.create(req.body);

      res.status(201).json({
        success: true,
        message: 'Subcategoría creada exitosamente',
        data: nuevaSubcategoria,
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

      const subcategoriaActualizada = await subcategoriaService.update(
        id,
        req.body
      );

      res.status(200).json({
        success: true,
        message: 'Subcategoría actualizada exitosamente',
        data: subcategoriaActualizada,
      });
    } catch (error) {
      next(error);
    }
  },

  async desactivar(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'El ID es requerido',
        });
        return;
      }

      const subcategoriaEliminada = await subcategoriaService.delete(id);

      res.status(200).json({
        success: true,
        message: 'Subcategoría desactivada exitosamente',
        data: subcategoriaEliminada,
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

      const subcategoriaEliminada = await subcategoriaService.hardDelete(id);

      res.status(200).json({
        success: true,
        message: 'Subcategoría eliminada permanentemente',
        data: subcategoriaEliminada,
      });
    } catch (error) {
      next(error);
    }
  },
};
