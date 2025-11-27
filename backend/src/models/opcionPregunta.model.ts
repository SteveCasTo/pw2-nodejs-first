import { Schema, model } from 'mongoose';
import { IOpcionPregunta } from '../types/models.types';

const opcionPreguntaSchema = new Schema<IOpcionPregunta>(
  {
    id_pregunta: {
      type: Schema.Types.ObjectId,
      ref: 'Pregunta',
      required: [true, 'El ID de pregunta es requerido'],
    },
    texto_opcion: {
      type: String,
      maxlength: [255, 'El texto no puede exceder 255 caracteres'],
    },
    id_contenido_opcion: {
      type: Schema.Types.ObjectId,
      ref: 'Contenido',
    },
    es_correcta: {
      type: Boolean,
      default: false,
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

opcionPreguntaSchema.index({ id_pregunta: 1 });

export const OpcionPregunta = model<IOpcionPregunta>('OpcionPregunta', opcionPreguntaSchema, 'opciones_pregunta');