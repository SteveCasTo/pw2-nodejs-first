import { Router } from 'express';
import { usuarioController } from '@controllers/usuario.controller';
import { protect } from '@middlewares/auth';

const router = Router();

router.use(protect);

router.get('/', usuarioController.getAll);
router.post('/', usuarioController.create);
router.get('/:id', usuarioController.getById);
router.put('/:id', usuarioController.update);
router.delete('/:id', usuarioController.delete);

export default router;
