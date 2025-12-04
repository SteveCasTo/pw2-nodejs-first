import { body } from 'express-validator';

export const cicloValidators = {
  create: [
    body('nombre_ciclo')
      .notEmpty()
      .withMessage('El nombre del ciclo es requerido')
      .isString()
      .trim()
      .matches(/^(\d{4}\/[12]|[IVX]+\/\d{4})$/)
      .withMessage(
        'El formato debe ser YYYY/1, YYYY/2, I/YYYY, II/YYYY, III/YYYY o IV/YYYY'
      ),
    body('descripcion').optional().isString().trim(),
    body('fecha_inicio').optional().isISO8601().toDate(),
    body('fecha_fin').optional().isISO8601().toDate(),
  ],

  update: [
    body('nombre_ciclo')
      .optional()
      .isString()
      .trim()
      .matches(/^(\d{4}\/[12]|[IVX]+\/\d{4})$/)
      .withMessage(
        'El formato debe ser YYYY/1, YYYY/2, I/YYYY, II/YYYY, III/YYYY o IV/YYYY'
      ),
    body('descripcion').optional().isString().trim(),
    body('fecha_inicio').optional().isISO8601().toDate(),
    body('fecha_fin').optional().isISO8601().toDate(),
  ],
};
