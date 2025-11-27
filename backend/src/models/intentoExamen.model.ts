import { Schema, model } from 'mongoose';
import { IIntentoExamen } from '../types/models.types';

const intentoExamenSchema = new Schema<IIntentoExamen>(
  {
    id_examen: {
      type: Schema.Types.ObjectId,
      ref: 'Examen',
      required: [true, 'El ID de examen es requerido'],
    },
    id_usuario: {
      type: Schema.Types.ObjectId,
      ref: 'Usuario',
      required: [true, 'El ID de usuario es requerido'],
    },
    numero_intento: {
      type: Number,
      required: [true, 'El número de intento es requerido'],
      min: [1, 'El número de intento debe ser mayor o igual a 1'],
    },
    fecha_inicio: {
      type: Date,
      default: Date.now,
    },
    fecha_finalizacion: {
      type: Date,
    },
    calificacion: {
      type: Number,
      min: [0, 'La calificación debe ser mayor o igual a 0'],
      max: [100, 'La calificación no puede exceder 100'],
    },
    puntos_obtenidos: {
      type: Number,
      min: [0, 'Los puntos deben ser mayores o iguales a 0'],
    },
    puntos_totales: {
      type: Number,
      min: [0, 'Los puntos totales deben ser mayores o iguales a 0'],
    },
    requiere_revision_manual: {
      type: Boolean,
      default: false,
    },
    completado: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

intentoExamenSchema.index({ id_examen: 1 });
intentoExamenSchema.index({ id_usuario: 1 });
intentoExamenSchema.index({ id_examen: 1, id_usuario: 1 });

export const IntentoExamen = model<IIntentoExamen>(
  'IntentoExamen',
  intentoExamenSchema,
  'intentos_examen'
);
