import { body } from 'express-validator';

export const privilegioValidators = {
  create: [
    body('nombre_privilegio')
      .notEmpty()
      .withMessage('El nombre del privilegio es requerido')
      .isString()
      .trim(),
    body('descripcion').optional().isString().trim(),
  ],

  update: [
    body('nombre_privilegio')
      .optional()
      .isString()
      .trim()
      .notEmpty()
      .withMessage('El nombre del privilegio no puede estar vacío'),
    body('descripcion').optional().isString().trim(),
  ],
};
