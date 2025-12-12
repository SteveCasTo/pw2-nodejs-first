import { Request, Response } from 'express';
import usuarioService from '@services/usuario.service';

const usuarioController = {
  getAll: async (_req: Request, res: Response): Promise<void> => {
    try {
      const usuarios = await usuarioService.getAll();

      res.status(200).json({
        success: true,
        count: usuarios.length,
        data: usuarios,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error:
          error instanceof Error ? error.message : 'Error al obtener usuarios',
      });
    }
  },

  create: async (req: Request, res: Response): Promise<void> => {
    try {
      const usuario = await usuarioService.create(req.body);

      res.status(201).json({
        success: true,
        data: usuario,
        message: 'Usuario creado exitosamente',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error:
          error instanceof Error ? error.message : 'Error al crear usuario',
      });
    }
  },

  getById: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({
          success: false,
          error: 'ID de usuario requerido',
        });
        return;
      }
      const usuario = await usuarioService.getById(id);

      res.status(200).json({
        success: true,
        data: usuario,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        error:
          error instanceof Error ? error.message : 'Error al obtener usuario',
      });
    }
  },

  update: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({
          success: false,
          error: 'ID de usuario requerido',
        });
        return;
      }
      const usuario = await usuarioService.update(id, req.body);

      res.status(200).json({
        success: true,
        data: usuario,
        message: 'Usuario actualizado exitosamente',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Error al actualizar usuario',
      });
    }
  },

  delete: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({
          success: false,
          error: 'ID de usuario requerido',
        });
        return;
      }
      const result = await usuarioService.delete(id);

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error:
          error instanceof Error ? error.message : 'Error al eliminar usuario',
      });
    }
  },
};

export { usuarioController };
