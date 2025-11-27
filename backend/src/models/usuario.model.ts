import { Schema, model } from 'mongoose';
import { IUsuario } from '../types/models.types';

const usuarioSchema = new Schema<IUsuario>(
  {
    correo: {
      type: String,
      required: [true, 'El correo es requerido'],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: [255, 'El correo no puede exceder 255 caracteres'],
      match: [/^\S+@\S+\.\S+$/, 'El correo no es válido'],
    },
    nombre_completo: {
      type: String,
      maxlength: [255, 'El nombre no puede exceder 255 caracteres'],
      trim: true,
    },
    fecha_registro: {
      type: Date,
      default: Date.now,
    },
    registrado_por: {
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

usuarioSchema.index({ correo: 1 }, { unique: true });
usuarioSchema.index({ activo: 1 });

export const Usuario = model<IUsuario>('Usuario', usuarioSchema, 'usuarios');