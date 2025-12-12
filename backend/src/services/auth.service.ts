import { Usuario } from '@models/usuario.model';
import { UsuarioPrivilegio } from '@models/usuarioPrivilegio.model';
import { Privilegio } from '@models/privilegio.model';
import { generateToken } from '@utils/jwt';
import { sendWelcomeEmail } from '@utils/email';
import { generatePassword } from '@utils/generatePassword';

interface LoginData {
  correo_electronico: string;
  password: string;
}

interface RegisterData {
  correo_electronico: string;
  nombre?: string;
}

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

const authService = {
  login: async (data: LoginData) => {
    const { correo_electronico, password } = data;

    const usuario = await Usuario.findOne({ correo_electronico }).select(
      '+password'
    );

    if (!usuario || !usuario.activo) {
      throw new Error('Credenciales inválidas');
    }

    const isPasswordValid = await usuario.comparePassword(password);

    if (!isPasswordValid) {
      throw new Error('Credenciales inválidas');
    }

    const privilegios = await UsuarioPrivilegio.find({
      id_usuario: usuario._id,
    })
      .populate('id_privilegio', 'nombre_privilegio descripcion')
      .select('id_privilegio');

    const token = generateToken({
      id: usuario._id.toString(),
      email: usuario.correo_electronico,
    });

    return {
      token,
      usuario: {
        _id: usuario._id,
        correo_electronico: usuario.correo_electronico,
        nombre: usuario.nombre,
        activo: usuario.activo,
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      privilegios: (privilegios as any).map((up: any) => ({
        nombre: up.id_privilegio?.nombre_privilegio,
        descripcion: up.id_privilegio?.descripcion,
      })),
    };
  },

  register: async (data: RegisterData, adminId?: string) => {
    const { correo_electronico } = data;

    const existingUser = await Usuario.findOne({ correo_electronico });
    if (existingUser) {
      throw new Error('El correo electrónico ya está registrado');
    }

    const password = generatePassword();

    const usuario = await Usuario.create({
      ...data,
      password,
      ...(adminId && { creado_por: adminId }),
    });

    // Si es el primer usuario del sistema, asignarle privilegio de superadmin
    const userCount = await Usuario.countDocuments();
    console.warn('👤 Total de usuarios en el sistema:', userCount);

    if (userCount === 1) {
      console.warn(
        '🔐 Primer usuario detectado. Asignando privilegio de superadmin...'
      );

      // Buscar o crear el privilegio de superadmin
      let superadminPrivilegio = await Privilegio.findOne({
        nombre_privilegio: 'superadmin',
      });

      if (!superadminPrivilegio) {
        console.warn('➕ Creando privilegio de superadmin...');
        superadminPrivilegio = await Privilegio.create({
          nombre_privilegio: 'superadmin',
          descripcion: 'Acceso total al sistema',
        });
      } else {
        console.warn(
          '✅ Privilegio superadmin encontrado:',
          superadminPrivilegio._id
        );
      }

      // Asignar el privilegio al usuario
      const usuarioPrivilegio = await UsuarioPrivilegio.create({
        id_usuario: usuario._id,
        id_privilegio: superadminPrivilegio._id,
      });
      console.warn('✅ Privilegio asignado exitosamente:', usuarioPrivilegio);
    }

    let emailSent = false;
    try {
      await sendWelcomeEmail(
        correo_electronico,
        password,
        data.nombre || 'Usuario'
      );
      emailSent = true;
    } catch (error) {
      console.error('Error al enviar email:', error);
    }

    return {
      _id: usuario._id,
      correo_electronico: usuario.correo_electronico,
      nombre: usuario.nombre,
      activo: usuario.activo,
      message: emailSent
        ? 'Usuario creado exitosamente. Contraseña enviada por correo.'
        : 'Usuario creado exitosamente.',
      ...(process.env.NODE_ENV === 'development' && { password }),
    };
  },

  getMe: async (userId: string) => {
    const usuario = await Usuario.findById(userId);

    if (!usuario || !usuario.activo) {
      throw new Error('Usuario no encontrado');
    }

    const privilegios = await UsuarioPrivilegio.find({
      id_usuario: usuario._id,
    })
      .populate('id_privilegio', 'nombre_privilegio descripcion')
      .select('id_privilegio');

    return {
      usuario: {
        _id: usuario._id,
        correo_electronico: usuario.correo_electronico,
        nombre: usuario.nombre,
        activo: usuario.activo,
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      privilegios: (privilegios as any).map((up: any) => ({
        nombre: up.id_privilegio?.nombre_privilegio,
        descripcion: up.id_privilegio?.descripcion,
      })),
    };
  },

  changePassword: async (userId: string, data: ChangePasswordData) => {
    const { currentPassword, newPassword } = data;

    const usuario = await Usuario.findById(userId).select('+password');

    if (!usuario || !usuario.activo) {
      throw new Error('Usuario no encontrado');
    }

    const isPasswordValid = await usuario.comparePassword(currentPassword);

    if (!isPasswordValid) {
      throw new Error('Contraseña actual incorrecta');
    }

    if (currentPassword === newPassword) {
      throw new Error(
        'La nueva contraseña debe ser diferente a la contraseña actual'
      );
    }

    usuario.password = newPassword;
    await usuario.save();

    return {
      message: 'Contraseña actualizada exitosamente',
    };
  },
};

export default authService;
