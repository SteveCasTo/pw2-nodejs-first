import { body, param } from 'express-validator';

export const examenPreguntaValidators = {
  create: [
    body('id_examen')
      .notEmpty()
      .withMessage('El ID de examen es requerido')
      .isMongoId()
      .withMessage('ID de examen inválido'),

    body('id_pregunta')
      .notEmpty()
      .withMessage('El ID de pregunta es requerido')
      .isMongoId()
      .withMessage('ID de pregunta inválido'),

    body('orden_definido')
      .optional()
      .isInt({ min: 1 })
      .withMessage('El orden debe ser un número entero mayor a 0'),

    body('puntos_asignados')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Los puntos deben ser mayores o iguales a 0'),

    body('usar_puntos_recomendados')
      .optional()
      .isBoolean()
      .withMessage('usar_puntos_recomendados debe ser un valor booleano'),

    body('obligatoria')
      .optional()
      .isBoolean()
      .withMessage('obligatoria debe ser un valor booleano'),

    // Validación: si usar_puntos_recomendados es false, puntos_asignados es requerido
    body('puntos_asignados').custom((value, { req }) => {
      if (req.body.usar_puntos_recomendados === false && !value && value !== 0) {
        throw new Error(
          'puntos_asignados es requerido cuando usar_puntos_recomendados es false'
        );
      }
      return true;
    }),
  ],

  update: [
    param('id').isMongoId().withMessage('ID de examen-pregunta inválido'),

    body('orden_definido')
      .optional()
      .isInt({ min: 1 })
      .withMessage('El orden debe ser un número entero mayor a 0'),

    body('puntos_asignados')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Los puntos deben ser mayores o iguales a 0'),

    body('usar_puntos_recomendados')
      .optional()
      .isBoolean()
      .withMessage('usar_puntos_recomendados debe ser un valor booleano'),

    body('obligatoria')
      .optional()
      .isBoolean()
      .withMessage('obligatoria debe ser un valor booleano'),
  ],

  getById: [
    param('id').isMongoId().withMessage('ID de examen-pregunta inválido'),
  ],

  getByExamen: [
    param('idExamen').isMongoId().withMessage('ID de examen inválido'),
  ],

  delete: [
    param('id').isMongoId().withMessage('ID de examen-pregunta inválido'),
  ],
};
