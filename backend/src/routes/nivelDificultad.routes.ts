import { Router } from 'express';
import { nivelDificultadController } from '@controllers/nivelDificultad.controller';
import { nivelDificultadValidators } from '@middlewares/validators/nivelDificultad.validator';
import { validate } from '@middlewares/validate';

const router = Router();

router.get('/', nivelDificultadController.getAll);
router.get('/:id', nivelDificultadValidators.getById, validate, nivelDificultadController.getById);
router.post('/', nivelDificultadValidators.create, validate, nivelDificultadController.create);
router.put('/:id', nivelDificultadValidators.update, validate, nivelDificultadController.update);
router.delete('/:id', nivelDificultadValidators.delete, validate, nivelDificultadController.delete);

export default router;