import { Router } from 'express';
import { categoriaController } from '@controllers/categoria.controller';
import { categoriaValidators } from '@middlewares/validators/categoria.validator';
import { validate } from '@middlewares/validate';

const router = Router();

router.get('/', categoriaController.getAll);
router.get(
  '/:id',
  categoriaValidators.getById,
  validate,
  categoriaController.getById
);
router.post(
  '/',
  categoriaValidators.create,
  validate,
  categoriaController.create
);
router.put(
  '/:id',
  categoriaValidators.update,
  validate,
  categoriaController.update
);
router.patch(
  '/:id/desactivar',
  categoriaValidators.delete,
  validate,
  categoriaController.desactivar
);
router.delete(
  '/:id',
  categoriaValidators.delete,
  validate,
  categoriaController.delete
);

export default router;
