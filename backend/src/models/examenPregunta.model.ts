import { Schema, model } from 'mongoose';
import { IExamenPregunta } from '../types/models.types';

const examenPreguntaSchema = new Schema<IExamenPregunta>(
  {
    id_examen: {
      type: Schema.Types.ObjectId,
      ref: 'Examen',
      required: [true, 'El ID de examen es requerido'],
    },
    id_pregunta: {
      type: Schema.Types.ObjectId,
      ref: 'Pregunta',
      required: [true, 'El ID de pregunta es requerido'],
    },
    orden_definido: {
      type: Number,
    },
    puntos_asignados: {
      type: Number,
      min: [0, 'Los puntos deben ser mayores o iguales a 0'],
    },
    usar_puntos_recomendados: {
      type: Boolean,
      default: true,
    },
    obligatoria: {
      type: Boolean,
      default: true,
    },
    fecha_agregada: {
      type: Date,
      default: Date.now,
    },
    agregada_por: {
      type: Schema.Types.ObjectId,
      ref: 'Usuario',
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

examenPreguntaSchema.index({ id_examen: 1, id_pregunta: 1 }, { unique: true });

export const ExamenPregunta = model<IExamenPregunta>(
  'ExamenPregunta',
  examenPreguntaSchema,
  'examenes_preguntas'
);
