import { Router } from 'express';
import { respuestaDesarrolloController } from '@controllers/respuestaDesarrollo.controller';
import { respuestaDesarrolloValidators } from '@middlewares/validators/respuestaDesarrollo.validator';
import { validate } from '@middlewares/validate';
import { restrictTo } from '@middlewares/authorize';

const router = Router();

// GET: Todos los usuarios autenticados pueden ver respuestas
router.get('/', respuestaDesarrolloController.getAll);

router.get(
  '/pendientes',
  respuestaDesarrolloController.getPendientesCalificacion
);

router.get(
  '/intento/:idIntento',
  respuestaDesarrolloValidators.getByIntento,
  validate,
  respuestaDesarrolloController.getByIntento
);

router.get(
  '/:id',
  respuestaDesarrolloValidators.getById,
  validate,
  respuestaDesarrolloController.getById
);

// POST: Estudiantes pueden crear sus respuestas
router.post(
  '/',
  respuestaDesarrolloValidators.create,
  validate,
  respuestaDesarrolloController.create
);

// PATCH calificar: Editores, superadmins, organizadores y profesores pueden calificar
router.patch(
  '/:id/calificar',
  restrictTo('editor', 'superadmin', 'organizador', 'profesor'),
  respuestaDesarrolloValidators.calificar,
  validate,
  respuestaDesarrolloController.calificar
);

// PUT/DELETE: Solo editores y superadmins
router.put(
  '/:id',
  restrictTo('editor', 'superadmin'),
  respuestaDesarrolloValidators.update,
  validate,
  respuestaDesarrolloController.update
);

router.delete(
  '/:id',
  restrictTo('editor', 'superadmin'),
  respuestaDesarrolloValidators.delete,
  validate,
  respuestaDesarrolloController.delete
);

export default router;
