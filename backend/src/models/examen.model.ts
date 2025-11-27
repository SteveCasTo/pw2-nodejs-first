import { Schema, model } from 'mongoose';
import { IExamen } from '../types/models.types';

const examenSchema = new Schema<IExamen>(
  {
    titulo: {
      type: String,
      required: [true, 'El título es requerido'],
      maxlength: [255, 'El título no puede exceder 255 caracteres'],
    },
    descripcion: {
      type: String,
      maxlength: [255, 'La descripción no puede exceder 255 caracteres'],
    },
    id_ciclo: {
      type: Schema.Types.ObjectId,
      ref: 'Ciclo',
      required: [true, 'El ciclo es requerido'],
    },
    fecha_inicio: {
      type: Date,
      required: [true, 'La fecha de inicio es requerida'],
    },
    fecha_fin: {
      type: Date,
      required: [true, 'La fecha de fin es requerida'],
    },
    duracion_minutos: {
      type: Number,
      min: [0, 'La duración debe ser mayor o igual a 0'],
    },
    intentos_permitidos: {
      type: Number,
      default: 1,
      min: [1, 'Debe permitir al menos 1 intento'],
    },
    calificacion_minima: {
      type: Number,
      min: [0, 'La calificación mínima debe ser mayor o igual a 0'],
      max: [100, 'La calificación mínima no puede exceder 100'],
    },
    mostrar_resultados: {
      type: Boolean,
      default: true,
    },
    aleatorizar_preguntas: {
      type: Boolean,
      default: false,
    },
    aleatorizar_opciones: {
      type: Boolean,
      default: false,
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
      required: [true, 'El creador es requerido'],
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

examenSchema.index({ id_ciclo: 1 });
examenSchema.index({ activo: 1 });
examenSchema.index({ creado_por: 1 });

export const Examen = model<IExamen>('Examen', examenSchema, 'examenes');