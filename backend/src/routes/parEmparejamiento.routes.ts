import { Router } from 'express';
import { parEmparejamientoController } from '@controllers/parEmparejamiento.controller';
import { parEmparejamientoValidators } from '@middlewares/validators/parEmparejamiento.validator';
import { validate } from '@middlewares/validate';
import { restrictTo } from '@middlewares/authorize';

const router = Router();

// GET: Todos los usuarios autenticados pueden ver pares
router.get('/', parEmparejamientoController.getAll);

router.get(
  '/:id',
  parEmparejamientoValidators.getById,
  validate,
  parEmparejamientoController.getById
);

router.get(
  '/pregunta/:idPregunta',
  parEmparejamientoValidators.getByPregunta,
  validate,
  parEmparejamientoController.getByPreguntaId
);

// POST/PUT/DELETE: Solo editores y superadmins
router.post(
  '/',
  restrictTo('editor', 'superadmin'),
  parEmparejamientoValidators.create,
  validate,
  parEmparejamientoController.create
);

router.put(
  '/:id',
  restrictTo('editor', 'superadmin'),
  parEmparejamientoValidators.update,
  validate,
  parEmparejamientoController.update
);

router.delete(
  '/:id',
  restrictTo('editor', 'superadmin'),
  parEmparejamientoValidators.delete,
  validate,
  parEmparejamientoController.delete
);

export default router;
