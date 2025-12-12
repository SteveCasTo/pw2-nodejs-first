import { body, param } from 'express-validator';

export const respuestaEmparejamientoValidators = {
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

    body('id_par')
      .notEmpty()
      .withMessage('El ID de par es requerido')
      .isMongoId()
      .withMessage('ID de par inválido'),

    body('es_correcto')
      .optional()
      .isBoolean()
      .withMessage('es_correcto debe ser un valor booleano'),

    body('fecha_respuesta')
      .optional()
      .isISO8601()
      .withMessage('La fecha de respuesta debe tener formato ISO 8601 válido'),
  ],

  update: [
    param('id').isMongoId().withMessage('ID de respuesta inválido'),

    body('es_correcto')
      .optional()
      .isBoolean()
      .withMessage('es_correcto debe ser un valor booleano'),
  ],

  getById: [param('id').isMongoId().withMessage('ID de respuesta inválido')],

  getByIntento: [
    param('idIntento').isMongoId().withMessage('ID de intento inválido'),
  ],

  delete: [param('id').isMongoId().withMessage('ID de respuesta inválido')],
};
