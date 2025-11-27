import { Schema, model } from 'mongoose';
import { IParEmparejamiento } from '../types/models.types';

const parEmparejamientoSchema = new Schema<IParEmparejamiento>(
  {
    id_pregunta: {
      type: Schema.Types.ObjectId,
      ref: 'Pregunta',
      required: [true, 'El ID de pregunta es requerido'],
    },
    texto_pregunta: {
      type: String,
      maxlength: [255, 'El texto de pregunta no puede exceder 255 caracteres'],
    },
    id_contenido_pregunta: {
      type: Schema.Types.ObjectId,
      ref: 'Contenido',
    },
    texto_respuesta: {
      type: String,
      maxlength: [255, 'El texto de respuesta no puede exceder 255 caracteres'],
    },
    id_contenido_respuesta: {
      type: Schema.Types.ObjectId,
      ref: 'Contenido',
    },
    orden: {
      type: Number,
      required: [true, 'El orden es requerido'],
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

parEmparejamientoSchema.index({ id_pregunta: 1 });

export const ParEmparejamiento = model<IParEmparejamiento>(
  'ParEmparejamiento',
  parEmparejamientoSchema,
  'pares_emparejamiento'
);
