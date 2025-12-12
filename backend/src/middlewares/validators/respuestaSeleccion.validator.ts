import { body, param } from 'express-validator';

export const respuestaSeleccionValidators = {
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

    body('id_opcion_seleccionada')
      .notEmpty()
      .withMessage('La opción seleccionada es requerida')
      .isMongoId()
      .withMessage('ID de opción inválido'),

    body('fecha_respuesta')
      .optional()
      .isISO8601()
      .withMessage('La fecha de respuesta debe tener formato ISO 8601 válido'),
  ],

  update: [
    param('id').isMongoId().withMessage('ID de respuesta inválido'),

    body('id_opcion_seleccionada')
      .optional()
      .isMongoId()
      .withMessage('ID de opción inválido'),

    body('es_correcta')
      .optional()
      .isBoolean()
      .withMessage('es_correcta debe ser un valor booleano'),

    body('puntos_obtenidos')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Los puntos obtenidos deben ser mayores o iguales a 0'),
  ],

  getById: [
    param('id').isMongoId().withMessage('ID de respuesta inválido'),
  ],

  getByIntento: [
    param('idIntento').isMongoId().withMessage('ID de intento inválido'),
  ],

  delete: [
    param('id').isMongoId().withMessage('ID de respuesta inválido'),
  ],
};
