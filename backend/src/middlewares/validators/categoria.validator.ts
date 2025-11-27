import { body, param } from 'express-validator';

export const categoriaValidators = {
  create: [
    body('nombre_categoria')
      .trim()
      .notEmpty()
      .withMessage('El nombre de la categoría es requerido')
      .isLength({ min: 1, max: 100 })
      .withMessage('El nombre debe tener entre 1 y 100 caracteres'),

    body('activo')
      .optional()
      .isBoolean()
      .withMessage('El campo activo debe ser un booleano'),
  ],

  update: [
    param('id').isMongoId().withMessage('ID de categoría inválido'),

    body('nombre_categoria')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('El nombre de la categoría no puede estar vacío')
      .isLength({ min: 1, max: 100 })
      .withMessage('El nombre debe tener entre 1 y 100 caracteres'),

    body('activo')
      .optional()
      .isBoolean()
      .withMessage('El campo activo debe ser un booleano'),
  ],

  getById: [param('id').isMongoId().withMessage('ID de categoría inválido')],

  delete: [param('id').isMongoId().withMessage('ID de categoría inválido')],
};
