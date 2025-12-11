import { Router } from 'express';
import { respuestaModeloController } from '@controllers/respuestaModelo.controller';
import { respuestaModeloValidators } from '@middlewares/validators/respuestaModelo.validator';
import { validate } from '@middlewares/validate';
import { restrictTo } from '@middlewares/authorize';

const router = Router();

// GET: Todos los usuarios autenticados pueden ver respuestas modelo
router.get('/', respuestaModeloController.getAll);

router.get(
  '/:id',
  respuestaModeloValidators.getById,
  validate,
  respuestaModeloController.getById
);

router.get(
  '/pregunta/:idPregunta',
  respuestaModeloValidators.getByPregunta,
  validate,
  respuestaModeloController.getByPreguntaId
);

// POST/PUT/DELETE: Solo editores y superadmins
router.post(
  '/',
  restrictTo('editor', 'superadmin'),
  respuestaModeloValidators.create,
  validate,
  respuestaModeloController.create
);

router.put(
  '/:id',
  restrictTo('editor', 'superadmin'),
  respuestaModeloValidators.update,
  validate,
  respuestaModeloController.update
);

router.delete(
  '/:id',
  restrictTo('editor', 'superadmin'),
  respuestaModeloValidators.delete,
  validate,
  respuestaModeloController.delete
);

export default router;
