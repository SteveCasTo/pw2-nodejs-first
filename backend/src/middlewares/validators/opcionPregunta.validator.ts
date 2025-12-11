import { body, param } from 'express-validator';

export const opcionPreguntaValidators = {
  create: [
    body('id_pregunta')
      .notEmpty()
      .withMessage('El ID de pregunta es requerido')
      .isMongoId()
      .withMessage('ID de pregunta inválido'),

    body('texto_opcion')
      .optional()
      .trim()
      .isLength({ max: 255 })
      .withMessage('El texto no puede exceder 255 caracteres'),

    body('id_contenido_opcion')
      .optional()
      .isMongoId()
      .withMessage('ID de contenido inválido'),

    body('es_correcta')
      .optional()
      .isBoolean()
      .withMessage('es_correcta debe ser un valor booleano'),

    body('orden')
      .notEmpty()
      .withMessage('El orden es requerido')
      .isInt({ min: 1 })
      .withMessage('El orden debe ser un número entero mayor a 0'),

    // Validación personalizada: debe haber texto O contenido
    body().custom((value) => {
      if (!value.texto_opcion && !value.id_contenido_opcion) {
        throw new Error(
          'Debe proporcionar texto_opcion o id_contenido_opcion'
        );
      }
      return true;
    }),
  ],

  update: [
    param('id').isMongoId().withMessage('ID de opción inválido'),

    body('id_pregunta')
      .optional()
      .isMongoId()
      .withMessage('ID de pregunta inválido'),

    body('texto_opcion')
      .optional()
      .trim()
      .isLength({ max: 255 })
      .withMessage('El texto no puede exceder 255 caracteres'),

    body('id_contenido_opcion')
      .optional()
      .isMongoId()
      .withMessage('ID de contenido inválido'),

    body('es_correcta')
      .optional()
      .isBoolean()
      .withMessage('es_correcta debe ser un valor booleano'),

    body('orden')
      .optional()
      .isInt({ min: 1 })
      .withMessage('El orden debe ser un número entero mayor a 0'),
  ],

  getById: [param('id').isMongoId().withMessage('ID de opción inválido')],

  getByPregunta: [
    param('idPregunta').isMongoId().withMessage('ID de pregunta inválido'),
  ],

  delete: [param('id').isMongoId().withMessage('ID de opción inválido')],
};
