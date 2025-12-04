import { UsuarioPrivilegio } from '@models/usuarioPrivilegio.model';
import { Usuario } from '@models/usuario.model';
import { Privilegio } from '@models/privilegio.model';

interface CreateUsuarioPrivilegioData {
  id_usuario: string;
  id_privilegio: string;
  asignado_por: string;
}

const usuarioPrivilegioService = {
  getAll: async () => {
    return await UsuarioPrivilegio.find()
      .populate('id_usuario', 'correo_electronico nombre apellido_paterno')
      .populate('id_privilegio', 'nombre_privilegio descripcion')
      .populate('asignado_por', 'correo_electronico nombre apellido_paterno')
      .sort({ fecha_asignacion: -1 });
  },

  getByUserId: async (userId: string) => {
    return await UsuarioPrivilegio.find({ id_usuario: userId })
      .populate('id_privilegio', 'nombre_privilegio descripcion')
      .populate('asignado_por', 'correo_electronico nombre apellido_paterno')
      .sort({ fecha_asignacion: -1 });
  },

  getById: async (id: string) => {
    const usuarioPrivilegio = await UsuarioPrivilegio.findById(id)
      .populate('id_usuario', 'correo_electronico nombre apellido_paterno')
      .populate('id_privilegio', 'nombre_privilegio descripcion')
      .populate('asignado_por', 'correo_electronico nombre apellido_paterno');

    if (!usuarioPrivilegio) {
      throw new Error('Asignación de privilegio no encontrada');
    }

    return usuarioPrivilegio;
  },

  create: async (data: CreateUsuarioPrivilegioData) => {
    const { id_usuario, id_privilegio } = data;

    const usuario = await Usuario.findOne({ _id: id_usuario, activo: true });
    if (!usuario) {
      throw new Error('Usuario no encontrado o inactivo');
    }

    const privilegio = await Privilegio.findOne({
      _id: id_privilegio,
      activo: true,
    });
    if (!privilegio) {
      throw new Error('Privilegio no encontrado o inactivo');
    }

    const existing = await UsuarioPrivilegio.findOne({
      id_usuario,
      id_privilegio,
    });

    if (existing) {
      throw new Error('Este usuario ya tiene asignado este privilegio');
    }

    const usuarioPrivilegio = await UsuarioPrivilegio.create(data);

    return await UsuarioPrivilegio.findById(usuarioPrivilegio._id)
      .populate('id_usuario', 'correo_electronico nombre apellido_paterno')
      .populate('id_privilegio', 'nombre_privilegio descripcion')
      .populate('asignado_por', 'correo_electronico nombre apellido_paterno');
  },

  delete: async (id: string) => {
    const usuarioPrivilegio = await UsuarioPrivilegio.findByIdAndDelete(id);

    if (!usuarioPrivilegio) {
      throw new Error('Asignación de privilegio no encontrada');
    }

    return usuarioPrivilegio;
  },

  deleteByUserAndPrivilege: async (userId: string, privilegioId: string) => {
    const usuarioPrivilegio = await UsuarioPrivilegio.findOneAndDelete({
      id_usuario: userId,
      id_privilegio: privilegioId,
    });

    if (!usuarioPrivilegio) {
      throw new Error('Asignación de privilegio no encontrada');
    }

    return usuarioPrivilegio;
  },
};

export default usuarioPrivilegioService;
