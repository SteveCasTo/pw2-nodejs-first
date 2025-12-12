import { Router } from 'express';
import { respuestaSeleccionController } from '@controllers/respuestaSeleccion.controller';
import { respuestaSeleccionValidators } from '@middlewares/validators/respuestaSeleccion.validator';
import { validate } from '@middlewares/validate';
import { restrictTo } from '@middlewares/authorize';

const router = Router();

// GET: Todos los usuarios autenticados pueden ver respuestas
router.get('/', respuestaSeleccionController.getAll);

router.get(
  '/intento/:idIntento',
  respuestaSeleccionValidators.getByIntento,
  validate,
  respuestaSeleccionController.getByIntento
);

router.get(
  '/:id',
  respuestaSeleccionValidators.getById,
  validate,
  respuestaSeleccionController.getById
);

// POST: Estudiantes pueden crear sus respuestas
router.post(
  '/',
  respuestaSeleccionValidators.create,
  validate,
  respuestaSeleccionController.create
);

// PUT/DELETE: Solo editores y superadmins
router.put(
  '/:id',
  restrictTo('editor', 'superadmin'),
  respuestaSeleccionValidators.update,
  validate,
  respuestaSeleccionController.update
);

router.delete(
  '/:id',
  restrictTo('editor', 'superadmin'),
  respuestaSeleccionValidators.delete,
  validate,
  respuestaSeleccionController.delete
);

export default router;
