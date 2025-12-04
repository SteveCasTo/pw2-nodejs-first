import { Router } from 'express';
import authController from '@controllers/auth.controller';
import { protect } from '@middlewares/auth';
import { restrictTo } from '@middlewares/authorize';
import { authValidators } from '@middlewares/validators/auth.validator';
import { validate } from '@middlewares/validate';

const router = Router();

router.post('/login', authValidators.login, validate, authController.login);

router.use(protect);

router.get('/me', authController.getMe);
router.put(
  '/change-password',
  authValidators.changePassword,
  validate,
  authController.changePassword
);

router.post(
  '/register',
  restrictTo('superadmin'),
  authValidators.register,
  validate,
  authController.register
);

export default router;
