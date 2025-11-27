import { body, param } from 'express-validator';

export const nivelDificultadValidators = {
  create: [
    body('nivel')
      .trim()
      .notEmpty()
      .withMessage('El nivel es requerido')
      .isLength({ min: 1, max: 50 })
      .withMessage('El nivel debe tener entre 1 y 50 caracteres'),

    body('descripcion')
      .optional()
      .trim()
      .isLength({ max: 255 })
      .withMessage('La descripción no puede exceder 255 caracteres'),

    body('activo')
      .optional()
      .isBoolean()
      .withMessage('El campo activo debe ser un booleano'),
  ],

  update: [
    param('id').isMongoId().withMessage('ID de nivel inválido'),

    body('nivel')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('El nivel no puede estar vacío')
      .isLength({ min: 1, max: 50 })
      .withMessage('El nivel debe tener entre 1 y 50 caracteres'),

    body('descripcion')
      .optional()
      .trim()
      .isLength({ max: 255 })
      .withMessage('La descripción no puede exceder 255 caracteres'),

    body('activo')
      .optional()
      .isBoolean()
      .withMessage('El campo activo debe ser un booleano'),
  ],

  getById: [param('id').isMongoId().withMessage('ID de nivel inválido')],

  delete: [param('id').isMongoId().withMessage('ID de nivel inválido')],
};
