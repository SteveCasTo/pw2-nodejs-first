import { Router } from 'express';
import authController from '@controllers/auth.controller';
import { protect } from '@middlewares/auth';
import { authValidators } from '@middlewares/validators/auth.validator';
import { validate } from '@middlewares/validate';

const router = Router();

// Rutas públicas (sin autenticación)
router.post('/login', authValidators.login, validate, authController.login);
router.post(
  '/register',
  authValidators.register,
  validate,
  authController.register
);

// Rutas protegidas (requieren autenticación)
router.use(protect);

router.get('/me', authController.getMe);
router.put(
  '/change-password',
  authValidators.changePassword,
  validate,
  authController.changePassword
);

export default router;
