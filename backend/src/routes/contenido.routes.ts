import { Router } from 'express';
import { contenidoController } from '@controllers/contenido.controller';
import { contenidoValidators } from '@middlewares/validators/contenido.validator';
import { validate } from '@middlewares/validate';
import { restrictTo } from '@middlewares/authorize';

const router = Router();

// GET: Todos los usuarios autenticados
router.get('/', contenidoController.getAll);
router.get(
  '/:id',
  contenidoValidators.getById,
  validate,
  contenidoController.getById
);

// POST/DELETE: Solo editores y superadmins
router.post(
  '/',
  restrictTo('editor', 'superadmin'),
  contenidoValidators.create,
  validate,
  contenidoController.create
);
router.delete(
  '/:id',
  restrictTo('editor', 'superadmin'),
  contenidoValidators.delete,
  validate,
  contenidoController.delete
);

export default router;
