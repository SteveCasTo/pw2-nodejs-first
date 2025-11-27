import { Router } from 'express';
import { subcategoriaController } from '@controllers/subcategoria.controller';

const router = Router();

router.get('/', (req, res, next) => subcategoriaController.getAll(req, res, next));
router.get('/:id', (req, res, next) => subcategoriaController.getById(req, res, next));
router.get('/categoria/:id_categoria', (req, res, next) => subcategoriaController.getByCategoria(req, res, next));
router.post('/', (req, res, next) => subcategoriaController.create(req, res, next));
router.put('/:id', (req, res, next) => subcategoriaController.update(req, res, next));
router.delete('/:id', (req, res, next) => subcategoriaController.delete(req, res, next));

export default router;
