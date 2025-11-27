import { Router } from 'express';
import { subcategoriaController } from '@controllers/subcategoria.controller';

const router = Router();

router.get('/', subcategoriaController.getAll);
router.get('/:id', subcategoriaController.getById);
router.get('/categoria/:id_categoria', subcategoriaController.getByCategoria);
router.post('/', subcategoriaController.create);
router.put('/:id', subcategoriaController.update);
router.delete('/:id', subcategoriaController.delete);

export default router;