import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUsuario } from '../types/models.types';

const usuarioSchema = new Schema<IUsuario>(
  {
    correo_electronico: {
      type: String,
      required: [true, 'El correo es requerido'],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: [255, 'El correo no puede exceder 255 caracteres'],
      match: [/^\S+@\S+\.\S+$/, 'El correo no es válido'],
    },
    password: {
      type: String,
      required: [true, 'La contraseña es requerida'],
      minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
      select: false,
    },
    nombre: {
      type: String,
      maxlength: [255, 'El nombre no puede exceder 255 caracteres'],
      trim: true,
    },
    fecha_registro: {
      type: Date,
      default: Date.now,
    },
    creado_por: {
      type: Schema.Types.ObjectId,
      ref: 'Usuario',
    },
    activo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

usuarioSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

usuarioSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

usuarioSchema.index({ activo: 1 });

export const Usuario = model<IUsuario>('Usuario', usuarioSchema, 'usuarios');
