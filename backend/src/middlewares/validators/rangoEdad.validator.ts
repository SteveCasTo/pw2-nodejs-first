import { body, param } from 'express-validator';

export const rangoEdadValidators = {
  create: [
    body('nombre_rango')
      .trim()
      .notEmpty()
      .withMessage('El nombre del rango es requerido')
      .isLength({ min: 1, max: 100 })
      .withMessage('El nombre debe tener entre 1 y 100 caracteres'),

    body('edad_minima')
      .notEmpty()
      .withMessage('La edad mínima es requerida')
      .isInt({ min: 0, max: 100 })
      .withMessage('La edad mínima debe ser un número entre 0 y 100'),

    body('edad_maxima')
      .notEmpty()
      .withMessage('La edad máxima es requerida')
      .isInt({ min: 0, max: 100 })
      .withMessage('La edad máxima debe ser un número entre 0 y 100')
      .custom((value, { req }) => {
        if (value <= req.body.edad_minima) {
          throw new Error('La edad máxima debe ser mayor que la edad mínima');
        }
        return true;
      }),

    body('activo')
      .optional()
      .isBoolean()
      .withMessage('El campo activo debe ser un booleano'),
  ],

  update: [
    param('id')
      .isMongoId()
      .withMessage('ID de rango inválido'),

    body('nombre_rango')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('El nombre del rango no puede estar vacío')
      .isLength({ min: 3, max: 100 })
      .withMessage('El nombre debe tener entre 3 y 100 caracteres'),

    body('edad_minima')
      .optional()
      .isInt({ min: 0, max: 100 })
      .withMessage('La edad mínima debe ser un número entre 0 y 100'),

    body('edad_maxima')
      .optional()
      .isInt({ min: 0, max: 100 })
      .withMessage('La edad máxima debe ser un número entre 0 y 100'),

    body('activo')
      .optional()
      .isBoolean()
      .withMessage('El campo activo debe ser un booleano'),
  ],

  getById: [
    param('id')
      .isMongoId()
      .withMessage('ID de rango inválido'),
  ],

  delete: [
    param('id')
      .isMongoId()
      .withMessage('ID de rango inválido'),
  ],
};