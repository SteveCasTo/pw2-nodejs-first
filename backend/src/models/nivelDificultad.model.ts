import { Schema, model } from 'mongoose';
import { INivelDificultad } from '../types/models.types';

const nivelDificultadSchema = new Schema<INivelDificultad>(
  {
    nivel: {
      type: String,
      required: [true, 'El nivel es requerido'],
      unique: true,
      trim: true,
      maxlength: [50, 'El nivel no puede exceder 50 caracteres'],
    },
    descripcion: {
      type: String,
      maxlength: [255, 'La descripción no puede exceder 255 caracteres'],
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

export const NivelDificultad = model<INivelDificultad>(
  'NivelDificultad',
  nivelDificultadSchema,
  'niveles_dificultad'
);
