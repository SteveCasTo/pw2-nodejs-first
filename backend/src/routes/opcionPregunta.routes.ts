import { Router } from 'express';
import { opcionPreguntaController } from '@controllers/opcionPregunta.controller';
import { opcionPreguntaValidators } from '@middlewares/validators/opcionPregunta.validator';
import { validate } from '@middlewares/validate';
import { restrictTo } from '@middlewares/authorize';

const router = Router();

// GET: Todos los usuarios autenticados pueden ver opciones
router.get('/', opcionPreguntaController.getAll);

router.get(
  '/:id',
  opcionPreguntaValidators.getById,
  validate,
  opcionPreguntaController.getById
);

router.get(
  '/pregunta/:idPregunta',
  opcionPreguntaValidators.getByPregunta,
  validate,
  opcionPreguntaController.getByPreguntaId
);

// POST/PUT/DELETE: Solo editores y superadmins
router.post(
  '/',
  restrictTo('editor', 'superadmin'),
  opcionPreguntaValidators.create,
  validate,
  opcionPreguntaController.create
);

router.put(
  '/:id',
  restrictTo('editor', 'superadmin'),
  opcionPreguntaValidators.update,
  validate,
  opcionPreguntaController.update
);

router.delete(
  '/:id',
  restrictTo('editor', 'superadmin'),
  opcionPreguntaValidators.delete,
  validate,
  opcionPreguntaController.delete
);

export default router;
