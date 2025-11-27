import { Router } from 'express';
import { categoriaController } from '@controllers/categoria.controller';

const router = Router();

router.get('/', (req, res, next) => categoriaController.getAll(req, res, next));
router.get('/:id', (req, res, next) =>
  categoriaController.getById(req, res, next)
);
router.post('/', (req, res, next) =>
  categoriaController.create(req, res, next)
);
router.put('/:id', (req, res, next) =>
  categoriaController.update(req, res, next)
);
router.delete('/:id', (req, res, next) =>
  categoriaController.delete(req, res, next)
);

export default router;
