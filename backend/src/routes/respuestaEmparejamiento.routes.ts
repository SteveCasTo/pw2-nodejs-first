import { Router } from 'express';
import { respuestaEmparejamientoController } from '@controllers/respuestaEmparejamiento.controller';
import { respuestaEmparejamientoValidators } from '@middlewares/validators/respuestaEmparejamiento.validator';
import { validate } from '@middlewares/validate';
import { restrictTo } from '@middlewares/authorize';

const router = Router();

// GET: Todos los usuarios autenticados pueden ver respuestas
router.get('/', respuestaEmparejamientoController.getAll);

router.get(
  '/intento/:idIntento',
  respuestaEmparejamientoValidators.getByIntento,
  validate,
  respuestaEmparejamientoController.getByIntento
);

router.get(
  '/:id',
  respuestaEmparejamientoValidators.getById,
  validate,
  respuestaEmparejamientoController.getById
);

// POST: Estudiantes pueden crear sus respuestas
router.post(
  '/',
  respuestaEmparejamientoValidators.create,
  validate,
  respuestaEmparejamientoController.create
);

// PUT/DELETE: Solo editores y superadmins
router.put(
  '/:id',
  restrictTo('editor', 'superadmin'),
  respuestaEmparejamientoValidators.update,
  validate,
  respuestaEmparejamientoController.update
);

router.delete(
  '/:id',
  restrictTo('editor', 'superadmin'),
  respuestaEmparejamientoValidators.delete,
  validate,
  respuestaEmparejamientoController.delete
);

export default router;
