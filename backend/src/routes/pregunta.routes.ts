import { Router } from 'express';
import { preguntaController } from '@controllers/pregunta.controller';
import { preguntaValidators } from '@middlewares/validators/pregunta.validator';
import { validate } from '@middlewares/validate';

const router = Router();

router.get('/', preguntaController.getAll);
router.get(
  '/:id',
  preguntaValidators.getById,
  validate,
  preguntaController.getById
);
router.post(
  '/',
  preguntaValidators.create,
  validate,
  preguntaController.create
);
router.put(
  '/:id',
  preguntaValidators.update,
  validate,
  preguntaController.update
);
router.patch(
  '/:id/desactivar',
  preguntaValidators.delete,
  validate,
  preguntaController.desactivar
);
router.delete(
  '/:id',
  preguntaValidators.delete,
  validate,
  preguntaController.delete
);

export default router;
