import { Schema, model } from 'mongoose';
import { IPrivilegio } from '../types/models.types';

const privilegioSchema = new Schema<IPrivilegio>(
  {
    nombre_privilegio: {
      type: String,
      required: [true, 'El nombre del privilegio es requerido'],
      unique: true,
      maxlength: [50, 'El nombre no puede exceder 50 caracteres'],
      trim: true,
    },
    descripcion: {
      type: String,
      maxlength: [255, 'La descripción no puede exceder 255 caracteres'],
    },
    fecha_creacion: {
      type: Date,
      default: Date.now,
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

export const Privilegio = model<IPrivilegio>(
  'Privilegio',
  privilegioSchema,
  'privilegios'
);
