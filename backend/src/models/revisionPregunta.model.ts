import { Schema, model } from 'mongoose';
import { IRevisionPregunta } from '../types/models.types';

const revisionPreguntaSchema = new Schema<IRevisionPregunta>(
  {
    id_pregunta: {
      type: Schema.Types.ObjectId,
      ref: 'Pregunta',
      required: [true, 'El ID de pregunta es requerido'],
    },
    id_revisor: {
      type: Schema.Types.ObjectId,
      ref: 'Usuario',
      required: [true, 'El ID de revisor es requerido'],
    },
    voto: {
      type: String,
      required: [true, 'El voto es requerido'],
      enum: {
        values: ['positivo', 'negativo'],
        message: '{VALUE} no es un voto válido',
      },
    },
    comentario: {
      type: String,
      maxlength: [255, 'El comentario no puede exceder 255 caracteres'],
    },
    fecha_revision: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

revisionPreguntaSchema.index({ id_pregunta: 1, id_revisor: 1 }, { unique: true });

export const RevisionPregunta = model<IRevisionPregunta>(
  'RevisionPregunta',
  revisionPreguntaSchema,
  'revisiones_pregunta'
);