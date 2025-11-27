import { Schema, model } from 'mongoose';
import { IRespuestaEmparejamiento } from '../types/models.types';

const respuestaEmparejamientoSchema = new Schema<IRespuestaEmparejamiento>(
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
    id_par: {
      type: Schema.Types.ObjectId,
      ref: 'ParEmparejamiento',
      required: [true, 'El ID de par es requerido'],
    },
    es_correcto: {
      type: Boolean,
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

respuestaEmparejamientoSchema.index({ id_intento: 1, id_examen_pregunta: 1, id_par: 1 }, { unique: true });

export const RespuestaEmparejamiento = model<IRespuestaEmparejamiento>(
  'RespuestaEmparejamiento',
  respuestaEmparejamientoSchema,
  'respuestas_emparejamiento'
);