import { Schema, model } from 'mongoose';
import { IRespuestaSeleccion } from '../types/models.types';

const respuestaSeleccionSchema = new Schema<IRespuestaSeleccion>(
  {
    id_intento: {
      type: Schema.Types.ObjectId,
      ref: 'IntentoExamen',
      required: [true, 'El ID de intento es requerido'],
    },
    id_examen_pregunta: {
      type: Schema.Types.ObjectId,
      ref: 'ExamenPregunta',
      required: [true, 'El ID de examen pregunta es requerido'],
    },
    id_opcion_seleccionada: {
      type: Schema.Types.ObjectId,
      ref: 'OpcionPregunta',
      required: [true, 'La opción seleccionada es requerida'],
    },
    es_correcta: {
      type: Boolean,
    },
    puntos_obtenidos: {
      type: Number,
      min: [0, 'Los puntos deben ser mayores o iguales a 0'],
    },
    fecha_respuesta: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

respuestaSeleccionSchema.index({ id_intento: 1 });
respuestaSeleccionSchema.index({ id_examen_pregunta: 1 });

export const RespuestaSeleccion = model<IRespuestaSeleccion>(
  'RespuestaSeleccion',
  respuestaSeleccionSchema,
  'respuestas_seleccion'
);