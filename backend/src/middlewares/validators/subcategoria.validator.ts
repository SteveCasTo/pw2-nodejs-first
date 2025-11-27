import { body, param } from 'express-validator';

export const subcategoriaValidators = {
  create: [
    body('id_categoria')
      .trim()
      .notEmpty()
      .withMessage('El ID de la categoría es requerido')
      .isMongoId()
      .withMessage('ID de categoría inválido'),

    body('nombre_subcategoria')
      .trim()
      .notEmpty()
      .withMessage('El nombre de la subcategoría es requerido')
      .isLength({ min: 1, max: 100 })
      .withMessage('El nombre debe tener entre 1 y 100 caracteres'),

    body('descripcion')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('La descripción no puede exceder 500 caracteres'),

    body('activo')
      .optional()
      .isBoolean()
      .withMessage('El campo activo debe ser un booleano'),
  ],

  update: [
    param('id').isMongoId().withMessage('ID de subcategoría inválido'),

    body('id_categoria')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('El ID de la categoría no puede estar vacío')
      .isMongoId()
      .withMessage('ID de categoría inválido'),

    body('nombre_subcategoria')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('El nombre de la subcategoría no puede estar vacío')
      .isLength({ min: 1, max: 100 })
      .withMessage('El nombre debe tener entre 1 y 100 caracteres'),

    body('descripcion')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('La descripción no puede exceder 500 caracteres'),

    body('activo')
      .optional()
      .isBoolean()
      .withMessage('El campo activo debe ser un booleano'),
  ],

  getById: [param('id').isMongoId().withMessage('ID de subcategoría inválido')],

  getByCategoria: [
    param('id_categoria').isMongoId().withMessage('ID de categoría inválido'),
  ],

  delete: [param('id').isMongoId().withMessage('ID de subcategoría inválido')],
};
