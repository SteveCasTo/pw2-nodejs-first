import { Schema, model } from 'mongoose';
import { ICiclo } from '../types/models.types';

const cicloSchema = new Schema<ICiclo>(
  {
    nombre_ciclo: {
      type: String,
      required: [true, 'El nombre del ciclo es requerido'],
      unique: true,
      maxlength: [50, 'El nombre no puede exceder 50 caracteres'],
      trim: true,
    },
    descripcion: {
      type: String,
      maxlength: [255, 'La descripción no puede exceder 255 caracteres'],
    },
    fecha_inicio: {
      type: Date,
    },
    fecha_fin: {
      type: Date,
    },
    activo: {
      type: Boolean,
      default: true,
    },
    fecha_creacion: {
      type: Date,
      default: Date.now,
    },
    creado_por: {
      type: Schema.Types.ObjectId,
      ref: 'Usuario',
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

cicloSchema.index({ nombre_ciclo: 1 }, { unique: true });
cicloSchema.index({ activo: 1 });

export const Ciclo = model<ICiclo>('Ciclo', cicloSchema, 'ciclos');