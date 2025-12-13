import { body, param } from 'express-validator';

export const respuestaDesarrolloValidators = {
  create: [
    body('id_intento')
      .notEmpty()
      .withMessage('El ID de intento es requerido')
      .isMongoId()
      .withMessage('ID de intento inválido'),

    body('id_examen_pregunta')
      .notEmpty()
      .withMessage('El ID de examen pregunta es requerido')
      .isMongoId()
      .withMessage('ID de examen pregunta inválido'),

    body('respuesta_texto')
      .notEmpty()
      .withMessage('El texto de respuesta es requerido')
      .isLength({ min: 1, max: 10000 })
      .withMessage(
        'El texto de respuesta debe tener entre 1 y 10000 caracteres'
      ),

    body('fecha_respuesta')
      .optional()
      .isISO8601()
      .withMessage('La fecha de respuesta debe tener formato ISO 8601 válido'),
  ],

  update: [
    param('id').isMongoId().withMessage('ID de respuesta inválido'),

    body('respuesta_texto')
      .optional()
      .isLength({ min: 1, max: 10000 })
      .withMessage(
        'El texto de respuesta debe tener entre 1 y 10000 caracteres'
      ),

    body('puntos_obtenidos')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Los puntos obtenidos deben ser mayores o iguales a 0'),

    body('calificada')
      .optional()
      .isBoolean()
      .withMessage('calificada debe ser un valor booleano'),

    body('comentario_calificador')
      .optional()
      .isLength({ max: 1000 })
      .withMessage(
        'El comentario del calificador no puede exceder 1000 caracteres'
      ),
  ],

  calificar: [
    param('id').isMongoId().withMessage('ID de respuesta inválido'),

    body('puntos_obtenidos')
      .notEmpty()
      .withMessage('Los puntos obtenidos son requeridos')
      .isFloat({ min: 0 })
      .withMessage('Los puntos obtenidos deben ser mayores o iguales a 0'),

    body('comentario_calificador')
      .optional()
      .isLength({ max: 1000 })
      .withMessage(
        'El comentario del calificador no puede exceder 1000 caracteres'
      ),
  ],

  getById: [param('id').isMongoId().withMessage('ID de respuesta inválido')],

  getByIntento: [
    param('idIntento').isMongoId().withMessage('ID de intento inválido'),
  ],

  delete: [param('id').isMongoId().withMessage('ID de respuesta inválido')],
};
