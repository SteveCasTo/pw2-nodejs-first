import { Schema, model } from 'mongoose';
import { IRespuestaModelo } from '../types/models.types';

const respuestaModeloSchema = new Schema<IRespuestaModelo>(
  {
    id_pregunta: {
      type: Schema.Types.ObjectId,
      ref: 'Pregunta',
      required: [true, 'El ID de pregunta es requerido'],
    },
    respuesta_texto: {
      type: String,
    },
    palabras_clave: {
      type: String,
    },
    fecha_creacion: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

respuestaModeloSchema.index({ id_pregunta: 1 });

export const RespuestaModelo = model<IRespuestaModelo>('RespuestaModelo', respuestaModeloSchema, 'respuestas_modelo');