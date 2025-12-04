import { body, param } from 'express-validator';

export const preguntaValidators = {
  create: [
    body('id_subcategoria')
      .notEmpty()
      .withMessage('La subcategoría es requerida')
      .isMongoId()
      .withMessage('ID de subcategoría inválido'),

    body('id_rango_edad')
      .notEmpty()
      .withMessage('El rango de edad es requerido')
      .isMongoId()
      .withMessage('ID de rango de edad inválido'),

    body('id_dificultad')
      .notEmpty()
      .withMessage('El nivel de dificultad es requerido')
      .isMongoId()
      .withMessage('ID de nivel de dificultad inválido'),

    body('id_estado')
      .notEmpty()
      .withMessage('El estado es requerido')
      .isMongoId()
      .withMessage('ID de estado inválido'),

    body('tipo_pregunta')
      .trim()
      .notEmpty()
      .withMessage('El tipo de pregunta es requerido')
      .isIn([
        'seleccion_multiple',
        'verdadero_falso',
        'desarrollo',
        'respuesta_corta',
        'emparejamiento',
      ])
      .withMessage(
        'Tipo de pregunta inválido. Valores permitidos: seleccion_multiple, verdadero_falso, desarrollo, respuesta_corta, emparejamiento'
      ),

    body('titulo_pregunta')
      .trim()
      .notEmpty()
      .withMessage('El título de la pregunta es requerido')
      .isLength({ min: 5, max: 500 })
      .withMessage('El título debe tener entre 5 y 500 caracteres'),

    body('id_contenido_pregunta')
      .optional()
      .isMongoId()
      .withMessage('ID de contenido inválido'),

    body('puntos_recomendados')
      .notEmpty()
      .withMessage('Los puntos recomendados son requeridos')
      .isFloat({ min: 0 })
      .withMessage('Los puntos deben ser un número mayor o igual a 0'),

    body('tiempo_estimado')
      .optional()
      .isInt({ min: 0 })
      .withMessage('El tiempo estimado debe ser un número entero positivo'),

    body('explicacion')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('La explicación no puede exceder 1000 caracteres'),

    body('fecha_creacion')
      .optional()
      .isISO8601()
      .withMessage('La fecha de creación debe tener formato ISO 8601 válido'),

    body('creado_por')
      .optional({ values: 'falsy' })
      .trim()
      .custom(value => {
        if (!value) return true;
        return /^[0-9a-fA-F]{24}$/.test(value);
      })
      .withMessage('ID de usuario inválido si se proporciona'),

    body('votos_requeridos')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Los votos requeridos deben ser un número entero positivo'),

    body('fecha_publicacion')
      .optional()
      .isISO8601()
      .withMessage(
        'La fecha de publicación debe tener formato ISO 8601 válido'
      ),

    body('activa')
      .optional()
      .isBoolean()
      .withMessage('El campo activa debe ser un booleano'),
  ],

  update: [
    param('id').isMongoId().withMessage('ID de pregunta inválido'),

    body('id_subcategoria')
      .optional()
      .isMongoId()
      .withMessage('ID de subcategoría inválido'),

    body('id_rango_edad')
      .optional()
      .isMongoId()
      .withMessage('ID de rango de edad inválido'),

    body('id_dificultad')
      .optional()
      .isMongoId()
      .withMessage('ID de nivel de dificultad inválido'),

    body('id_estado')
      .optional()
      .isMongoId()
      .withMessage('ID de estado inválido'),

    body('tipo_pregunta')
      .optional()
      .trim()
      .isIn([
        'seleccion_multiple',
        'verdadero_falso',
        'desarrollo',
        'respuesta_corta',
        'emparejamiento',
      ])
      .withMessage('Tipo de pregunta inválido'),

    body('titulo_pregunta')
      .optional()
      .trim()
      .isLength({ min: 5, max: 500 })
      .withMessage('El título debe tener entre 5 y 500 caracteres'),

    body('id_contenido_pregunta')
      .optional()
      .isMongoId()
      .withMessage('ID de contenido inválido'),

    body('puntos_recomendados')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Los puntos deben ser un número mayor o igual a 0'),

    body('tiempo_estimado')
      .optional()
      .isInt({ min: 0 })
      .withMessage('El tiempo estimado debe ser un número entero positivo'),

    body('explicacion')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('La explicación no puede exceder 1000 caracteres'),

    body('activa')
      .optional()
      .isBoolean()
      .withMessage('El campo activa debe ser un booleano'),
  ],

  getById: [param('id').isMongoId().withMessage('ID de pregunta inválido')],

  delete: [param('id').isMongoId().withMessage('ID de pregunta inválido')],
};
