import { Router } from 'express';
import { rangoEdadController } from '@controllers/rangoEdad.controller';

const router = Router();

router.get('/', (req, res, next) => rangoEdadController.getAll(req, res, next));
router.get('/:id', (req, res, next) => rangoEdadController.getById(req, res, next));
router.post('/', (req, res, next) => rangoEdadController.create(req, res, next));
router.put('/:id', (req, res, next) => rangoEdadController.update(req, res, next));
router.delete('/:id', (req, res, next) => rangoEdadController.delete(req, res, next));

export default router;