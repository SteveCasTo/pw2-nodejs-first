import { Schema, model } from 'mongoose';
import { IRangoEdad } from '../types/models.types';

const rangoEdadSchema = new Schema<IRangoEdad>(
  {
    nombre_rango: {
      type: String,
      required: [true, 'El nombre del rango es requerido'],
      maxlength: [50, 'El nombre no puede exceder 50 caracteres'],
      trim: true,
    },
    edad_minima: {
      type: Number,
      required: [true, 'La edad mínima es requerida'],
      min: [0, 'La edad mínima debe ser mayor o igual a 0'],
    },
    edad_maxima: {
      type: Number,
      required: [true, 'La edad máxima es requerida'],
      min: [0, 'La edad máxima debe ser mayor o igual a 0'],
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

rangoEdadSchema.index({ nombre_rango: 1 });
rangoEdadSchema.index({ activo: 1 });

export const RangoEdad = model<IRangoEdad>(
  'RangoEdad',
  rangoEdadSchema,
  'rangos_edad'
);
