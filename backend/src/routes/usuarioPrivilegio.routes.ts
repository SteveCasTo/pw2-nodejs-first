import { Router } from 'express';
import usuarioPrivilegioController from '@controllers/usuarioPrivilegio.controller';
import { restrictTo } from '@middlewares/authorize';
import { usuarioPrivilegioValidators } from '@middlewares/validators/usuarioPrivilegio.validator';
import { validate } from '@middlewares/validate';

const router = Router();

router.use(restrictTo('superadmin'));

router.get('/', usuarioPrivilegioController.getAll);
router.get('/usuario/:userId', usuarioPrivilegioController.getByUserId);
router.get('/:id', usuarioPrivilegioController.getById);
router.post(
  '/',
  usuarioPrivilegioValidators.create,
  validate,
  usuarioPrivilegioController.create
);
router.delete('/:id', usuarioPrivilegioController.delete);
router.delete(
  '/usuario/:userId/privilegio/:privilegioId',
  usuarioPrivilegioController.deleteByUserAndPrivilege
);

export default router;
