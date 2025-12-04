import { Router } from 'express';
import { estadoPreguntaController } from '@controllers/estadoPregunta.controller';
import { estadoPreguntaValidators } from '@middlewares/validators/estadoPregunta.validator';
import { validate } from '@middlewares/validate';
import { restrictTo } from '@middlewares/authorize';

const router = Router();

// GET: Todos los usuarios autenticados
router.get('/', estadoPreguntaController.getAll);
router.get(
  '/:id',
  estadoPreguntaValidators.getById,
  validate,
  estadoPreguntaController.getById
);

// POST: Solo editores y superadmins
router.post(
  '/',
  restrictTo('editor', 'superadmin'),
  estadoPreguntaValidators.create,
  validate,
  estadoPreguntaController.create
);

export default router;
