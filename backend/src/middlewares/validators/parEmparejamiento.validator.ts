import { body, param } from 'express-validator';

export const parEmparejamientoValidators = {
  create: [
    body('id_pregunta')
      .notEmpty()
      .withMessage('El ID de pregunta es requerido')
      .isMongoId()
      .withMessage('ID de pregunta inválido'),

    body('texto_pregunta')
      .optional()
      .trim()
      .isLength({ max: 255 })
      .withMessage('El texto de pregunta no puede exceder 255 caracteres'),

    body('id_contenido_pregunta')
      .optional()
      .isMongoId()
      .withMessage('ID de contenido de pregunta inválido'),

    body('texto_respuesta')
      .optional()
      .trim()
      .isLength({ max: 255 })
      .withMessage('El texto de respuesta no puede exceder 255 caracteres'),

    body('id_contenido_respuesta')
      .optional()
      .isMongoId()
      .withMessage('ID de contenido de respuesta inválido'),

    body('orden')
      .notEmpty()
      .withMessage('El orden es requerido')
      .isInt({ min: 1 })
      .withMessage('El orden debe ser un número entero mayor a 0'),

    // Validación personalizada: debe haber texto O contenido para pregunta
    body().custom(value => {
      if (!value.texto_pregunta && !value.id_contenido_pregunta) {
        throw new Error(
          'Debe proporcionar texto_pregunta o id_contenido_pregunta'
        );
      }
      return true;
    }),

    // Validación personalizada: debe haber texto O contenido para respuesta
    body().custom(value => {
      if (!value.texto_respuesta && !value.id_contenido_respuesta) {
        throw new Error(
          'Debe proporcionar texto_respuesta o id_contenido_respuesta'
        );
      }
      return true;
    }),
  ],

  update: [
    param('id').isMongoId().withMessage('ID de par inválido'),

    body('id_pregunta')
      .optional()
      .isMongoId()
      .withMessage('ID de pregunta inválido'),

    body('texto_pregunta')
      .optional()
      .trim()
      .isLength({ max: 255 })
      .withMessage('El texto de pregunta no puede exceder 255 caracteres'),

    body('id_contenido_pregunta')
      .optional()
      .isMongoId()
      .withMessage('ID de contenido de pregunta inválido'),

    body('texto_respuesta')
      .optional()
      .trim()
      .isLength({ max: 255 })
      .withMessage('El texto de respuesta no puede exceder 255 caracteres'),

    body('id_contenido_respuesta')
      .optional()
      .isMongoId()
      .withMessage('ID de contenido de respuesta inválido'),

    body('orden')
      .optional()
      .isInt({ min: 1 })
      .withMessage('El orden debe ser un número entero mayor a 0'),
  ],

  getById: [param('id').isMongoId().withMessage('ID de par inválido')],

  getByPregunta: [
    param('idPregunta').isMongoId().withMessage('ID de pregunta inválido'),
  ],

  delete: [param('id').isMongoId().withMessage('ID de par inválido')],
};
