import { Router } from 'express';
import { rangoEdadController } from '@controllers/rangoEdad.controller';
import { rangoEdadValidators } from '@middlewares/validators/rangoEdad.validator';
import { validate } from '@middlewares/validate';

const router = Router();

router.get('/', rangoEdadController.getAll);
router.get(
  '/:id',
  rangoEdadValidators.getById,
  validate,
  rangoEdadController.getById
);
router.post(
  '/',
  rangoEdadValidators.create,
  validate,
  rangoEdadController.create
);
router.put(
  '/:id',
  rangoEdadValidators.update,
  validate,
  rangoEdadController.update
);
router.patch(
  '/:id/desactivar',
  rangoEdadValidators.delete,
  validate,
  rangoEdadController.desactivar
);
router.delete(
  '/:id',
  rangoEdadValidators.delete,
  validate,
  rangoEdadController.delete
);

export default router;
