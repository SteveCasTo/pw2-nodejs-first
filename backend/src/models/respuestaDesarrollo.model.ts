import { Schema, model } from 'mongoose';
import { IRespuestaDesarrollo } from '../types/models.types';

const respuestaDesarrolloSchema = new Schema<IRespuestaDesarrollo>(
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
    respuesta_texto: {
      type: String,
      required: [true, 'El texto de respuesta es requerido'],
    },
    puntos_obtenidos: {
      type: Number,
      min: [0, 'Los puntos deben ser mayores o iguales a 0'],
    },
    fecha_respuesta: {
      type: Date,
      default: Date.now,
    },
    calificada: {
      type: Boolean,
      default: false,
    },
    calificada_por: {
      type: Schema.Types.ObjectId,
      ref: 'Usuario',
    },
    fecha_calificacion: {
      type: Date,
    },
    comentario_calificador: {
      type: String,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

respuestaDesarrolloSchema.index({ id_intento: 1 });
respuestaDesarrolloSchema.index({ id_examen_pregunta: 1 });
respuestaDesarrolloSchema.index({ calificada: 1 });

export const RespuestaDesarrollo = model<IRespuestaDesarrollo>(
  'RespuestaDesarrollo',
  respuestaDesarrolloSchema,
  'respuestas_desarrollo'
);
