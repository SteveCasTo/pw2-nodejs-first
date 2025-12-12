import { body } from 'express-validator';

export const cicloValidators = {
  create: [
    body('nombre_ciclo')
      .notEmpty()
      .withMessage('El nombre del ciclo es requerido')
      .isString()
      .trim()
      .matches(/^[1-4]\/\d{4}$/)
      .withMessage('El formato debe ser: ciclo/año (Ejemplo: 1/2025, 2/2025, 3/2025, 4/2025)'),
    body('descripcion').optional().isString().trim(),
    body('fecha_inicio')
      .notEmpty()
      .withMessage('La fecha de inicio es requerida')
      .isISO8601()
      .toDate(),
    body('fecha_fin')
      .notEmpty()
      .withMessage('La fecha de fin es requerida')
      .isISO8601()
      .toDate(),
    body('activo').optional().isBoolean(),
  ],

  update: [
    body('nombre_ciclo')
      .optional()
      .isString()
      .trim()
      .matches(/^[1-4]\/\d{4}$/)
      .withMessage('El formato debe ser: ciclo/año (Ejemplo: 1/2025, 2/2025, 3/2025, 4/2025)'),
    body('descripcion').optional().isString().trim(),
    body('fecha_inicio').optional().isISO8601().toDate(),
    body('fecha_fin').optional().isISO8601().toDate(),
    body('activo').optional().isBoolean(),
  ],
};
