import { Router } from 'express';
import privilegioController from '@controllers/privilegio.controller';
import { restrictTo } from '@middlewares/authorize';
import { privilegioValidators } from '@middlewares/validators/privilegio.validator';
import { validate } from '@middlewares/validate';

const router = Router();

router.use(restrictTo('superadmin'));

router.get('/', privilegioController.getAll);
router.get('/:id', privilegioController.getById);
router.post(
  '/',
  privilegioValidators.create,
  validate,
  privilegioController.create
);
router.put(
  '/:id',
  privilegioValidators.update,
  validate,
  privilegioController.update
);
router.patch('/:id/desactivar', privilegioController.desactivar);
router.delete('/:id', privilegioController.delete);

export default router;
