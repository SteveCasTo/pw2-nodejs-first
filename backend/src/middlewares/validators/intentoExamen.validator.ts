import { body, param } from 'express-validator';

export const intentoExamenValidators = {
  create: [
    body('id_examen')
      .notEmpty()
      .withMessage('El ID de examen es requerido')
      .isMongoId()
      .withMessage('ID de examen inválido'),

    body('id_usuario')
      .notEmpty()
      .withMessage('El ID de usuario es requerido')
      .isMongoId()
      .withMessage('ID de usuario inválido'),

    body('numero_intento')
      .notEmpty()
      .withMessage('El número de intento es requerido')
      .isInt({ min: 1 })
      .withMessage('El número de intento debe ser mayor o igual a 1'),

    body('fecha_inicio')
      .optional()
      .isISO8601()
      .withMessage('La fecha de inicio debe tener formato ISO 8601 válido'),

    body('puntos_obtenidos')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Los puntos obtenidos deben ser mayores o iguales a 0'),

    body('puntos_totales')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Los puntos totales deben ser mayores o iguales a 0'),

    body('calificacion')
      .optional()
      .isFloat({ min: 0, max: 100 })
      .withMessage('La calificación debe estar entre 0 y 100'),

    body('completado')
      .optional()
      .isBoolean()
      .withMessage('completado debe ser un valor booleano'),

    body('requiere_revision_manual')
      .optional()
      .isBoolean()
      .withMessage('requiere_revision_manual debe ser un valor booleano'),
  ],

  update: [
    param('id').isMongoId().withMessage('ID de intento inválido'),

    body('calificacion')
      .optional()
      .isFloat({ min: 0, max: 100 })
      .withMessage('La calificación debe estar entre 0 y 100'),

    body('puntos_obtenidos')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Los puntos obtenidos deben ser mayores o iguales a 0'),

    body('puntos_totales')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Los puntos totales deben ser mayores o iguales a 0'),

    body('fecha_finalizacion')
      .optional()
      .isISO8601()
      .withMessage(
        'La fecha de finalización debe tener formato ISO 8601 válido'
      ),

    body('completado')
      .optional()
      .isBoolean()
      .withMessage('completado debe ser un valor booleano'),

    body('requiere_revision_manual')
      .optional()
      .isBoolean()
      .withMessage('requiere_revision_manual debe ser un valor booleano'),
  ],

  getById: [param('id').isMongoId().withMessage('ID de intento inválido')],

  getByExamen: [
    param('idExamen').isMongoId().withMessage('ID de examen inválido'),
  ],

  getByUsuario: [
    param('idUsuario').isMongoId().withMessage('ID de usuario inválido'),
  ],

  delete: [param('id').isMongoId().withMessage('ID de intento inválido')],

  finalizar: [param('id').isMongoId().withMessage('ID de intento inválido')],
};
