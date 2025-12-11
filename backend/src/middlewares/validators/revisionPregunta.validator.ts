import { body, param } from 'express-validator';

export const revisionPreguntaValidators = {
  create: [
    body('id_pregunta')
      .notEmpty()
      .withMessage('El ID de pregunta es requerido')
      .isMongoId()
      .withMessage('ID de pregunta inválido'),

    body('voto')
      .notEmpty()
      .withMessage('El voto es requerido')
      .isIn(['positivo', 'negativo'])
      .withMessage('El voto debe ser "positivo" o "negativo"'),

    body('comentario')
      .optional()
      .trim()
      .isLength({ max: 255 })
      .withMessage('El comentario no puede exceder 255 caracteres'),
  ],

  update: [
    param('id').isMongoId().withMessage('ID de revisión inválido'),

    body('comentario')
      .optional()
      .trim()
      .isLength({ max: 255 })
      .withMessage('El comentario no puede exceder 255 caracteres'),
  ],

  getById: [param('id').isMongoId().withMessage('ID de revisión inválido')],

  getByPregunta: [
    param('idPregunta').isMongoId().withMessage('ID de pregunta inválido'),
  ],

  getByRevisor: [
    param('idRevisor').isMongoId().withMessage('ID de revisor inválido'),
  ],

  delete: [param('id').isMongoId().withMessage('ID de revisión inválido')],
};
