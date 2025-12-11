import { Router } from 'express';
import { examenController } from '@controllers/examen.controller';
import { examenValidators } from '@middlewares/validators/examen.validator';
import { validate } from '@middlewares/validate';
import { restrictTo } from '@middlewares/authorize';

const router = Router();

// GET: Todos los usuarios autenticados pueden ver exámenes
router.get('/', examenController.getAll);

router.get('/disponibles', examenController.getExamenesDisponibles);

router.get('/proximos', examenController.getExamenesProximos);

router.get('/finalizados', examenController.getExamenesFinalizados);

router.get(
  '/:id/estadisticas',
  examenValidators.getById,
  validate,
  examenController.getEstadisticas
);

router.get(
  '/:id',
  examenValidators.getById,
  validate,
  examenController.getById
);

// POST/PUT/PATCH/DELETE: Solo editores y superadmins
router.post(
  '/',
  restrictTo('editor', 'superadmin'),
  examenValidators.create,
  validate,
  examenController.create
);

router.put(
  '/:id',
  restrictTo('editor', 'superadmin'),
  examenValidators.update,
  validate,
  examenController.update
);

router.patch(
  '/:id/desactivar',
  restrictTo('editor', 'superadmin'),
  examenValidators.desactivar,
  validate,
  examenController.desactivar
);

router.delete(
  '/:id',
  restrictTo('editor', 'superadmin'),
  examenValidators.delete,
  validate,
  examenController.delete
);

export default router;
