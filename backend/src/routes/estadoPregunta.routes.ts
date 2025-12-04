import { Router } from 'express';
import { estadoPreguntaController } from '@controllers/estadoPregunta.controller';
import { estadoPreguntaValidators } from '@middlewares/validators/estadoPregunta.validator';
import { validate } from '@middlewares/validate';

const router = Router();

router.get('/', estadoPreguntaController.getAll);
router.get(
  '/:id',
  estadoPreguntaValidators.getById,
  validate,
  estadoPreguntaController.getById
);
router.post(
  '/',
  estadoPreguntaValidators.create,
  validate,
  estadoPreguntaController.create
);

export default router;
