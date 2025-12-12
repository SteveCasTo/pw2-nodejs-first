import { Usuario } from '@models/usuario.model';
import { UsuarioPrivilegio } from '@models/usuarioPrivilegio.model';

const usuarioService = {
  getAll: async () => {
    const usuarios = await Usuario.find().select('-password');
    
    // Obtener privilegios para cada usuario
    const usuariosConPrivilegios = await Promise.all(
      usuarios.map(async (usuario) => {
        const privilegios = await UsuarioPrivilegio.find({
          id_usuario: usuario._id,
        })
          .populate('id_privilegio', 'nombre_privilegio descripcion')
          .select('id_privilegio activo');
        
        return {
          ...usuario.toObject(),
          privilegios,
        };
      })
    );
    
    return usuariosConPrivilegios;
  },

  getById: async (id: string) => {
    const usuario = await Usuario.findById(id).select('-password');
    
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }
    
    const privilegios = await UsuarioPrivilegio.find({
      id_usuario: usuario._id,
    })
      .populate('id_privilegio', 'nombre_privilegio descripcion')
      .select('id_privilegio activo');
    
    return {
      ...usuario.toObject(),
      privilegios,
    };
  },

  create: async (data: { nombre: string; correo_electronico: string; password?: string }) => {
    // Verificar si el usuario ya existe
    const existingUser = await Usuario.findOne({ correo_electronico: data.correo_electronico });
    if (existingUser) {
      throw new Error('El correo electrónico ya está registrado');
    }

    // Crear usuario con contraseña por defecto si no se proporciona
    const usuario = await Usuario.create({
      ...data,
      password: data.password || 'password123', // Contraseña por defecto
      activo: true,
    });

    // Retornar sin la contraseña
    const { password, ...usuarioSinPassword } = usuario.toObject();
    return usuarioSinPassword;
  },

  update: async (id: string, data: { nombre?: string; activo?: boolean }) => {
    const usuario = await Usuario.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    ).select('-password');

    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    return usuario;
  },

  delete: async (id: string) => {
    const usuario = await Usuario.findByIdAndUpdate(
      id,
      { $set: { activo: false } },
      { new: true }
    );

    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    return { message: 'Usuario desactivado exitosamente' };
  },
};

export default usuarioService;
