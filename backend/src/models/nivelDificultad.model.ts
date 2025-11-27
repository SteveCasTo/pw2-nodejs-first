import { Schema, model } from 'mongoose';
import { INivelDificultad } from '../types/models.types';

const nivelDificultadSchema = new Schema<INivelDificultad>(
  {
    nivel: {
      type: String,
      required: [true, 'El nivel es requerido'],
      enum: {
        values: ['facil', 'medio', 'dificil'],
        message: '{VALUE} no es un nivel válido',
      },
      unique: true,
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

nivelDificultadSchema.index({ nivel: 1 }, { unique: true });

export const NivelDificultad = model<INivelDificultad>(
  'NivelDificultad',
  nivelDificultadSchema,
  'niveles_dificultad'
);
