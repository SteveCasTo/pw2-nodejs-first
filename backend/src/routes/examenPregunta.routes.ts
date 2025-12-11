import { Router } from 'express';
import { examenPreguntaController } from '@controllers/examenPregunta.controller';
import { examenPreguntaValidators } from '@middlewares/validators/examenPregunta.validator';
import { validate } from '@middlewares/validate';
import { restrictTo } from '@middlewares/authorize';

const router = Router();

// GET: Todos los usuarios autenticados pueden ver exámenes-preguntas
router.get('/', examenPreguntaController.getAll);

router.get(
  '/examen/:idExamen/puntaje',
  examenPreguntaValidators.getByExamen,
  validate,
  examenPreguntaController.getPuntajeTotalExamen
);

router.get(
  '/examen/:idExamen',
  examenPreguntaValidators.getByExamen,
  validate,
  examenPreguntaController.getByExamenId
);

router.get(
  '/:id',
  examenPreguntaValidators.getById,
  validate,
  examenPreguntaController.getById
);

// POST/PUT/DELETE: Solo editores y superadmins
router.post(
  '/',
  restrictTo('editor', 'superadmin'),
  examenPreguntaValidators.create,
  validate,
  examenPreguntaController.create
);

router.put(
  '/:id',
  restrictTo('editor', 'superadmin'),
  examenPreguntaValidators.update,
  validate,
  examenPreguntaController.update
);

router.delete(
  '/:id',
  restrictTo('editor', 'superadmin'),
  examenPreguntaValidators.delete,
  validate,
  examenPreguntaController.delete
);

// PATCH: Reordenar preguntas
router.patch(
  '/examen/:idExamen/reordenar',
  restrictTo('editor', 'superadmin'),
  examenPreguntaValidators.getByExamen,
  validate,
  examenPreguntaController.reordenarPreguntas
);

export default router;
