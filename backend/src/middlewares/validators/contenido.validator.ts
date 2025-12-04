import { body, param } from 'express-validator';

export const contenidoValidators = {
  create: [
    body('tipo_contenido')
      .trim()
      .notEmpty()
      .withMessage('El tipo de contenido es requerido')
      .isIn(['texto', 'imagen', 'audio', 'video', 'documento', 'otro'])
      .withMessage(
        'Tipo de contenido inválido. Valores permitidos: texto, imagen, audio, video, documento, otro'
      ),

    body('url_contenido')
      .optional({ values: 'falsy' })
      .trim()
      .isURL()
      .withMessage('Debe ser una URL válida si se proporciona'),

    body('nombre_archivo')
      .optional()
      .trim()
      .isLength({ max: 255 })
      .withMessage('El nombre del archivo no puede exceder 255 caracteres'),

    body('tamanio_bytes')
      .optional()
      .isInt({ min: 0 })
      .withMessage('El tamaño debe ser un número entero positivo'),

    body('mime_type')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('El MIME type no puede exceder 100 caracteres'),

    body('fecha_subida')
      .optional()
      .isISO8601()
      .withMessage('La fecha debe tener formato ISO 8601 válido'),

    body('subido_por')
      .optional()
      .isMongoId()
      .withMessage('ID de usuario inválido'),
  ],

  getById: [param('id').isMongoId().withMessage('ID de contenido inválido')],

  delete: [param('id').isMongoId().withMessage('ID de contenido inválido')],
};
