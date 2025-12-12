import { body, param } from 'express-validator';

export const examenValidators = {
  create: [
    body('titulo')
      .trim()
      .notEmpty()
      .withMessage('El título es requerido')
      .isLength({ min: 3, max: 255 })
      .withMessage('El título debe tener entre 3 y 255 caracteres'),

    body('descripcion')
      .optional()
      .trim()
      .isLength({ max: 255 })
      .withMessage('La descripción no puede exceder 255 caracteres'),

    body('id_ciclo')
      .notEmpty()
      .withMessage('El ciclo es requerido')
      .isMongoId()
      .withMessage('ID de ciclo inválido'),

    body('fecha_inicio')
      .notEmpty()
      .withMessage('La fecha de inicio es requerida')
      .isISO8601()
      .withMessage('Fecha de inicio inválida'),

    body('fecha_fin')
      .notEmpty()
      .withMessage('La fecha de fin es requerida')
      .isISO8601()
      .withMessage('Fecha de fin inválida'),

    body('duracion_minutos')
      .optional()
      .isInt({ min: 0 })
      .withMessage('La duración debe ser un número entero mayor o igual a 0'),

    body('intentos_permitidos')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Debe permitir al menos 1 intento'),

    body('calificacion_minima')
      .optional()
      .isFloat({ min: 0, max: 100 })
      .withMessage('La calificación mínima debe estar entre 0 y 100'),

    body('mostrar_resultados')
      .optional()
      .isBoolean()
      .withMessage('mostrar_resultados debe ser un valor booleano'),

    body('aleatorizar_preguntas')
      .optional()
      .isBoolean()
      .withMessage('aleatorizar_preguntas debe ser un valor booleano'),

    body('aleatorizar_opciones')
      .optional()
      .isBoolean()
      .withMessage('aleatorizar_opciones debe ser un valor booleano'),

    // Validación personalizada: fecha_inicio < fecha_fin
    body('fecha_fin').custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.fecha_inicio)) {
        throw new Error(
          'La fecha de fin debe ser posterior a la fecha de inicio'
        );
      }
      return true;
    }),
  ],

  update: [
    param('id').isMongoId().withMessage('ID de examen inválido'),

    body('titulo')
      .optional()
      .trim()
      .isLength({ min: 3, max: 255 })
      .withMessage('El título debe tener entre 3 y 255 caracteres'),

    body('descripcion')
      .optional()
      .trim()
      .isLength({ max: 255 })
      .withMessage('La descripción no puede exceder 255 caracteres'),

    body('id_ciclo').optional().isMongoId().withMessage('ID de ciclo inválido'),

    body('fecha_inicio')
      .optional()
      .isISO8601()
      .withMessage('Fecha de inicio inválida'),

    body('fecha_fin')
      .optional()
      .isISO8601()
      .withMessage('Fecha de fin inválida'),

    body('duracion_minutos')
      .optional()
      .isInt({ min: 0 })
      .withMessage('La duración debe ser un número entero mayor o igual a 0'),

    body('intentos_permitidos')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Debe permitir al menos 1 intento'),

    body('calificacion_minima')
      .optional()
      .isFloat({ min: 0, max: 100 })
      .withMessage('La calificación mínima debe estar entre 0 y 100'),

    body('mostrar_resultados')
      .optional()
      .isBoolean()
      .withMessage('mostrar_resultados debe ser un valor booleano'),

    body('aleatorizar_preguntas')
      .optional()
      .isBoolean()
      .withMessage('aleatorizar_preguntas debe ser un valor booleano'),

    body('aleatorizar_opciones')
      .optional()
      .isBoolean()
      .withMessage('aleatorizar_opciones debe ser un valor booleano'),
  ],

  getById: [param('id').isMongoId().withMessage('ID de examen inválido')],

  desactivar: [param('id').isMongoId().withMessage('ID de examen inválido')],

  delete: [param('id').isMongoId().withMessage('ID de examen inválido')],
};
