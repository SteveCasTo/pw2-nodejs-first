import { Router } from 'express';
import { contenidoController } from '@controllers/contenido.controller';
import { contenidoValidators } from '@middlewares/validators/contenido.validator';
import { validate } from '@middlewares/validate';

const router = Router();

router.get('/', contenidoController.getAll);
router.get(
  '/:id',
  contenidoValidators.getById,
  validate,
  contenidoController.getById
);
router.post(
  '/',
  contenidoValidators.create,
  validate,
  contenidoController.create
);
router.delete(
  '/:id',
  contenidoValidators.delete,
  validate,
  contenidoController.delete
);

export default router;
