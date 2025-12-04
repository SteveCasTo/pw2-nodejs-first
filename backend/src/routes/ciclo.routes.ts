import { Router } from 'express';
import cicloController from '@controllers/ciclo.controller';
import { restrictTo } from '@middlewares/authorize';
import { cicloValidators } from '@middlewares/validators/ciclo.validator';
import { validate } from '@middlewares/validate';

const router = Router();

router.get('/', cicloController.getAll);
router.get('/:id', cicloController.getById);
router.post(
  '/',
  restrictTo('superadmin'),
  cicloValidators.create,
  validate,
  cicloController.create
);
router.put(
  '/:id',
  restrictTo('superadmin'),
  cicloValidators.update,
  validate,
  cicloController.update
);
router.patch(
  '/:id/desactivar',
  restrictTo('superadmin'),
  cicloController.desactivar
);
router.delete('/:id', restrictTo('superadmin'), cicloController.delete);

export default router;
