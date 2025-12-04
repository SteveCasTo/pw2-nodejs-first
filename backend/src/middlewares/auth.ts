import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/auth.types';
import { verifyToken } from '@utils/jwt';
import { Usuario } from '@models/usuario.model';
import { UsuarioPrivilegio } from '@models/usuarioPrivilegio.model';

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      res.status(401).json({
        success: false,
        error: 'No autorizado. Token no proporcionado',
      });
      return;
    }

    const decoded = verifyToken(token);

    const usuario = await Usuario.findById(decoded.id).select(
      '+activo +correo_electronico'
    );

    if (!usuario || !usuario.activo) {
      res.status(401).json({
        success: false,
        error: 'Usuario no existe o está inactivo',
      });
      return;
    }

    const privilegios = await UsuarioPrivilegio.find({
      id_usuario: usuario._id,
    })
      .populate('id_privilegio', 'nombre_privilegio')
      .select('id_privilegio');

    const nombrePrivilegios = privilegios
      .map((up: any) => up.id_privilegio?.nombre_privilegio)
      .filter(Boolean);

    req.user = {
      id: usuario._id.toString(),
      email: usuario.correo_electronico,
      privilegios: nombrePrivilegios,
    };

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Token inválido o expirado',
    });
  }
};
