import { Usuario } from '@models/usuario.model';
import { UsuarioPrivilegio } from '@models/usuarioPrivilegio.model';
import { Privilegio } from '@models/privilegio.model';
import { generatePassword } from '@utils/generatePassword';
import { sendWelcomeEmail } from '@utils/email';

const usuarioService = {
  getAll: async () => {
    const usuarios = await Usuario.find().select('-password');

    // Obtener privilegios para cada usuario
    const usuariosConPrivilegios = await Promise.all(
      usuarios.map(async usuario => {
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

  create: async (data: {
    nombre: string;
    correo_electronico: string;
    password?: string;
  }) => {
    // Verificar si el usuario ya existe
    const existingUser = await Usuario.findOne({
      correo_electronico: data.correo_electronico,
    });
    if (existingUser) {
      throw new Error('El correo electrónico ya está registrado');
    }

    // Generar contraseña aleatoria
    const password = generatePassword();

    // Crear usuario
    const usuario = await Usuario.create({
      ...data,
      password,
      activo: true,
    });

    // Asignar privilegio "estudiante" por defecto
    const privilegioEstudiante = await Privilegio.findOne({
      nombre_privilegio: 'estudiante',
    });
    if (privilegioEstudiante) {
      await UsuarioPrivilegio.create({
        id_usuario: usuario._id,
        id_privilegio: privilegioEstudiante._id,
        activo: true,
      });
    }

    // Intentar enviar email con la contraseña
    let emailSent = false;
    try {
      await sendWelcomeEmail(data.correo_electronico, password, data.nombre);
      emailSent = true;
    } catch (error) {
      console.error('Error al enviar email:', error);
    }

    // Retornar usuario con privilegios
    const privilegios = await UsuarioPrivilegio.find({
      id_usuario: usuario._id,
    })
      .populate('id_privilegio', 'nombre_privilegio descripcion')
      .select('id_privilegio activo');

    const { password: _, ...usuarioSinPassword } = usuario.toObject();
    return {
      ...usuarioSinPassword,
      privilegios,
      message: emailSent
        ? 'Usuario creado exitosamente. Contraseña enviada por correo.'
        : 'Usuario creado exitosamente.',
      ...(process.env.NODE_ENV === 'development' && { password }),
    };
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
