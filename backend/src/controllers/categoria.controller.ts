import { Request, Response, NextFunction } from 'express';
import { categoriaService } from '@services/categoria.service';

export class CategoriaController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { activo } = req.query;

      const filtros =
        activo !== undefined ? { activo: activo === 'true' } : undefined;

      const categorias = await categoriaService.getAll(filtros);

      res.status(200).json({
        success: true,
        data: categorias,
        count: categorias.length,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'ID es requerido',
        });
        return;
      }

      const categoria = await categoriaService.getById(id);

      if (!categoria) {
        res.status(404).json({
          success: false,
          message: 'Categoría no encontrada',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: categoria,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { nombre_categoria, activo } = req.body;

      if (!nombre_categoria) {
        res.status(400).json({
          success: false,
          message: 'El campo nombre_categoria es requerido',
        });
        return;
      }

      const nuevaCategoria = await categoriaService.create({
        nombre_categoria,
        activo,
      });

      res.status(201).json({
        success: true,
        message: 'Categoría creada exitosamente',
        data: nuevaCategoria,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { nombre_categoria, activo } = req.body;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'ID es requerido',
        });
        return;
      }

      const categoriaActualizada = await categoriaService.update(id, {
        nombre_categoria,
        activo,
      });

      if (!categoriaActualizada) {
        res.status(404).json({
          success: false,
          message: 'Categoría no encontrada',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Categoría actualizada exitosamente',
        data: categoriaActualizada,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'ID es requerido',
        });
        return;
      }

      const categoriaEliminada = await categoriaService.delete(id);

      if (!categoriaEliminada) {
        res.status(404).json({
          success: false,
          message: 'Categoría no encontrada',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Categoría desactivada exitosamente',
        data: categoriaEliminada,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const categoriaController = new CategoriaController();
