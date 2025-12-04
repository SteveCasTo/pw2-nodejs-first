import { body } from 'express-validator';

export const authValidators = {
  login: [
    body('correo_electronico')
      .isEmail()
      .withMessage('Debe ser un correo válido')
      .normalizeEmail()
      .trim(),
    body('password')
      .notEmpty()
      .withMessage('La contraseña es requerida')
      .isLength({ min: 6 })
      .withMessage('La contraseña debe tener al menos 6 caracteres'),
  ],

  register: [
    body('correo_electronico')
      .isEmail()
      .withMessage('Debe ser un correo válido')
      .normalizeEmail()
      .trim()
      .isLength({ max: 100 })
      .withMessage('El correo no debe exceder 100 caracteres'),
    body('nombre')
      .optional()
      .isString()
      .withMessage('El nombre debe ser una cadena de texto')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('El nombre debe tener entre 2 y 100 caracteres')
      .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      .withMessage('El nombre solo puede contener letras y espacios'),
  ],

  changePassword: [
    body('currentPassword')
      .notEmpty()
      .withMessage('La contraseña actual es requerida')
      .isLength({ min: 6 })
      .withMessage('La contraseña actual es inválida'),
    body('newPassword')
      .notEmpty()
      .withMessage('La nueva contraseña es requerida')
      .isLength({ min: 8 })
      .withMessage('La nueva contraseña debe tener al menos 8 caracteres')
      .matches(/[a-z]/)
      .withMessage('La nueva contraseña debe contener al menos una letra minúscula')
      .matches(/[A-Z]/)
      .withMessage('La nueva contraseña debe contener al menos una letra mayúscula')
      .matches(/\d/)
      .withMessage('La nueva contraseña debe contener al menos un número')
      .matches(/[@$!%*?&]/)
      .withMessage(
        'La nueva contraseña debe contener al menos un carácter especial (@$!%*?&)'
      )
      .custom((value, { req }) => {
        if (value === req.body.currentPassword) {
          throw new Error(
            'La nueva contraseña debe ser diferente a la contraseña actual'
          );
        }
        return true;
      }),
  ],
};
