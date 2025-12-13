import { Router } from 'express';
import { intentoExamenController } from '@controllers/intentoExamen.controller';
import { intentoExamenValidators } from '@middlewares/validators/intentoExamen.validator';
import { validate } from '@middlewares/validate';
import { restrictTo } from '@middlewares/authorize';

const router = Router();

// GET: Todos los usuarios autenticados pueden ver intentos (con restricciones en el controlador si es necesario)
router.get('/', intentoExamenController.getAll);

router.get(
  '/examen/:idExamen',
  intentoExamenValidators.getByExamen,
  validate,
  intentoExamenController.getByExamen
);

router.get(
  '/usuario/:idUsuario',
  intentoExamenValidators.getByUsuario,
  validate,
  intentoExamenController.getByUsuario
);

router.get(
  '/:id',
  intentoExamenValidators.getById,
  validate,
  intentoExamenController.getById
);

// POST: Estudiantes pueden crear intentos de examen
router.post(
  '/',
  intentoExamenValidators.create,
  validate,
  intentoExamenController.create
);

// PATCH finalizar: Estudiantes pueden finalizar sus propios intentos
router.patch(
  '/:id/finalizar',
  intentoExamenValidators.finalizar,
  validate,
  intentoExamenController.finalizar
);

// PUT: Solo editores y superadmins pueden actualizar intentos manualmente
router.put(
  '/:id',
  restrictTo('editor', 'superadmin'),
  intentoExamenValidators.update,
  validate,
  intentoExamenController.update
);

// DELETE: Solo editores y superadmins pueden eliminar intentos
router.delete(
  '/:id',
  restrictTo('editor', 'superadmin'),
  intentoExamenValidators.delete,
  validate,
  intentoExamenController.delete
);

export default router;
