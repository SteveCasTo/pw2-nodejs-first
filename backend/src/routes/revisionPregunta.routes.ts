import { Router } from 'express';
import { revisionPreguntaController } from '@controllers/revisionPregunta.controller';
import { revisionPreguntaValidators } from '@middlewares/validators/revisionPregunta.validator';
import { validate } from '@middlewares/validate';
import { restrictTo } from '@middlewares/authorize';

const router = Router();

// GET: Todos los usuarios autenticados pueden ver revisiones
router.get('/', revisionPreguntaController.getAll);

router.get(
  '/pendientes',
  restrictTo('revisor', 'editor', 'superadmin'),
  revisionPreguntaController.getPreguntasPendientes
);

router.get(
  '/estadisticas/:idRevisor',
  revisionPreguntaValidators.getByRevisor,
  validate,
  revisionPreguntaController.getEstadisticasRevisor
);

router.get(
  '/:id',
  revisionPreguntaValidators.getById,
  validate,
  revisionPreguntaController.getById
);

router.get(
  '/pregunta/:idPregunta',
  revisionPreguntaValidators.getByPregunta,
  validate,
  revisionPreguntaController.getByPreguntaId
);

router.get(
  '/revisor/:idRevisor',
  revisionPreguntaValidators.getByRevisor,
  validate,
  revisionPreguntaController.getByRevisorId
);

// POST: Solo revisores, editores y superadmins pueden crear revisiones
router.post(
  '/',
  restrictTo('revisor', 'editor', 'superadmin'),
  revisionPreguntaValidators.create,
  validate,
  revisionPreguntaController.create
);

// PUT: Solo el revisor que creó la revisión puede actualizarla (validar en service)
router.put(
  '/:id',
  restrictTo('revisor', 'editor', 'superadmin'),
  revisionPreguntaValidators.update,
  validate,
  revisionPreguntaController.update
);

// DELETE: Solo revisores y superadmins pueden eliminar
router.delete(
  '/:id',
  restrictTo('revisor', 'superadmin'),
  revisionPreguntaValidators.delete,
  validate,
  revisionPreguntaController.delete
);

// PATCH: Solo superadmins pueden cambiar el estado de una pregunta manualmente
router.patch(
  '/pregunta/:idPregunta/estado',
  restrictTo('superadmin'),
  revisionPreguntaController.cambiarEstadoPregunta
);

export default router;
