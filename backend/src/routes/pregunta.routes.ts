import { Router } from 'express';
import { preguntaController } from '@controllers/pregunta.controller';
import { preguntaValidators } from '@middlewares/validators/pregunta.validator';
import { validate } from '@middlewares/validate';
import { restrictTo } from '@middlewares/authorize';

const router = Router();

// GET: Todos los usuarios autenticados pueden ver preguntas
router.get('/', preguntaController.getAll);
router.get(
  '/:id',
  preguntaValidators.getById,
  validate,
  preguntaController.getById
);

// POST/PUT/PATCH/DELETE: Solo editores y superadmins
router.post(
  '/',
  restrictTo('editor', 'superadmin'),
  preguntaValidators.create,
  validate,
  preguntaController.create
);
router.put(
  '/:id',
  restrictTo('editor', 'superadmin'),
  preguntaValidators.update,
  validate,
  preguntaController.update
);
router.patch(
  '/:id/desactivar',
  restrictTo('editor', 'superadmin'),
  preguntaValidators.delete,
  validate,
  preguntaController.desactivar
);
router.delete(
  '/:id',
  restrictTo('editor', 'superadmin'),
  preguntaValidators.delete,
  validate,
  preguntaController.delete
);

export default router;
