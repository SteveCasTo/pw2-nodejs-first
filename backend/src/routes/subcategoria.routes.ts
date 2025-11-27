import { Router } from 'express';
import { subcategoriaController } from '@controllers/subcategoria.controller';
import { subcategoriaValidators } from '@middlewares/validators/subcategoria.validator';
import { validate } from '@middlewares/validate';

const router = Router();

router.get('/', subcategoriaController.getAll);
router.get(
  '/:id',
  subcategoriaValidators.getById,
  validate,
  subcategoriaController.getById
);
router.get(
  '/categoria/:id_categoria',
  subcategoriaValidators.getByCategoria,
  validate,
  subcategoriaController.getByCategoria
);
router.post(
  '/',
  subcategoriaValidators.create,
  validate,
  subcategoriaController.create
);
router.put(
  '/:id',
  subcategoriaValidators.update,
  validate,
  subcategoriaController.update
);
router.patch(
  '/:id/desactivar',
  subcategoriaValidators.delete,
  validate,
  subcategoriaController.desactivar
);
router.delete(
  '/:id',
  subcategoriaValidators.delete,
  validate,
  subcategoriaController.delete
);

export default router;
