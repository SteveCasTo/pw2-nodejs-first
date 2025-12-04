import { body, param } from 'express-validator';

export const estadoPreguntaValidators = {
  create: [
    body('nombre_estado')
      .trim()
      .notEmpty()
      .withMessage('El nombre del estado es requerido')
      .isIn(['borrador', 'revision', 'publicada', 'rechazada', 'archivada'])
      .withMessage(
        'Estado inválido. Valores permitidos: borrador, revision, publicada, rechazada, archivada'
      ),

    body('descripcion')
      .optional()
      .trim()
      .isLength({ max: 255 })
      .withMessage('La descripción no puede exceder 255 caracteres'),

    body('orden')
      .notEmpty()
      .withMessage('El orden es requerido')
      .isInt({ min: 1 })
      .withMessage('El orden debe ser un número entero positivo'),
  ],

  getById: [
    param('id').isMongoId().withMessage('ID de estado de pregunta inválido'),
  ],
};
