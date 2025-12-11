import { body, param } from 'express-validator';

export const respuestaModeloValidators = {
  create: [
    body('id_pregunta')
      .notEmpty()
      .withMessage('El ID de pregunta es requerido')
      .isMongoId()
      .withMessage('ID de pregunta inválido'),

    body('respuesta_texto')
      .optional()
      .trim()
      .isLength({ min: 1 })
      .withMessage('La respuesta texto no puede estar vacía'),

    body('palabras_clave')
      .optional()
      .trim()
      .isLength({ min: 1 })
      .withMessage('Las palabras clave no pueden estar vacías'),

    // Validación personalizada: debe haber al menos respuesta_texto o palabras_clave
    body().custom((value) => {
      if (!value.respuesta_texto && !value.palabras_clave) {
        throw new Error(
          'Debe proporcionar respuesta_texto o palabras_clave (o ambos)'
        );
      }
      return true;
    }),
  ],

  update: [
    param('id').isMongoId().withMessage('ID de respuesta modelo inválido'),

    body('id_pregunta')
      .optional()
      .isMongoId()
      .withMessage('ID de pregunta inválido'),

    body('respuesta_texto')
      .optional()
      .trim()
      .isLength({ min: 1 })
      .withMessage('La respuesta texto no puede estar vacía'),

    body('palabras_clave')
      .optional()
      .trim()
      .isLength({ min: 1 })
      .withMessage('Las palabras clave no pueden estar vacías'),
  ],

  getById: [
    param('id').isMongoId().withMessage('ID de respuesta modelo inválido'),
  ],

  getByPregunta: [
    param('idPregunta').isMongoId().withMessage('ID de pregunta inválido'),
  ],

  delete: [
    param('id').isMongoId().withMessage('ID de respuesta modelo inválido'),
  ],
};
