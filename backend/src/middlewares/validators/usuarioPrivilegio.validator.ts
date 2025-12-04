import { body } from 'express-validator';

export const usuarioPrivilegioValidators = {
  create: [
    body('id_usuario')
      .notEmpty()
      .withMessage('El ID del usuario es requerido')
      .isMongoId()
      .withMessage('ID de usuario inválido'),
    body('id_privilegio')
      .notEmpty()
      .withMessage('El ID del privilegio es requerido')
      .isMongoId()
      .withMessage('ID de privilegio inválido'),
  ],
};
