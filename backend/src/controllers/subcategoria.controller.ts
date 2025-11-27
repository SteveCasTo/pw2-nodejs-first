import { Request, Response, NextFunction } from 'express';
import { subcategoriaService } from '@services/subcategoria.service';

export class SubcategoriaController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { activo, id_categoria } = req.query;
      
      const filtros: { activo?: boolean; id_categoria?: string } = {};
      
      if (activo !== undefined) {
        filtros.activo = activo === 'true';
      }
      
      if (id_categoria && typeof id_categoria === 'string') {
        filtros.id_categoria = id_categoria;
      }
      
      const subcategorias = await subcategoriaService.getAll(filtros);
      
      res.status(200).json({
        success: true,
        data: subcategorias,
        count: subcategorias.length,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({
          success: false,
          message: 'ID es requerido',
        });
        return;
      }
      
      const subcategoria = await subcategoriaService.getById(id);
      
      if (!subcategoria) {
        res.status(404).json({
          success: false,
          message: 'Subcategoría no encontrada',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: subcategoria,
      });
    } catch (error) {
      next(error);
    }
  }

  async getByCategoria(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id_categoria } = req.params;
      
      if (!id_categoria) {
        res.status(400).json({
          success: false,
          message: 'ID de categoría es requerido',
        });
        return;
      }
      
      const subcategorias = await subcategoriaService.getByCategoria(id_categoria);
      
      res.status(200).json({
        success: true,
        data: subcategorias,
        count: subcategorias.length,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id_categoria, nombre_subcategoria, descripcion, activo } = req.body;

      if (!id_categoria || !nombre_subcategoria) {
        res.status(400).json({
          success: false,
          message: 'Los campos id_categoria y nombre_subcategoria son requeridos',
        });
        return;
      }

      const nuevaSubcategoria = await subcategoriaService.create({
        id_categoria,
        nombre_subcategoria,
        descripcion,
        activo,
      });

      res.status(201).json({
        success: true,
        message: 'Subcategoría creada exitosamente',
        data: nuevaSubcategoria,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { id_categoria, nombre_subcategoria, descripcion, activo } = req.body;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'ID es requerido',
        });
        return;
      }

      const subcategoriaActualizada = await subcategoriaService.update(id, {
        id_categoria,
        nombre_subcategoria,
        descripcion,
        activo,
      });

      if (!subcategoriaActualizada) {
        res.status(404).json({
          success: false,
          message: 'Subcategoría no encontrada',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Subcategoría actualizada exitosamente',
        data: subcategoriaActualizada,
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

      const subcategoriaEliminada = await subcategoriaService.delete(id);

      if (!subcategoriaEliminada) {
        res.status(404).json({
          success: false,
          message: 'Subcategoría no encontrada',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Subcategoría desactivada exitosamente',
        data: subcategoriaEliminada,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const subcategoriaController = new SubcategoriaController();
