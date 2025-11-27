import { Schema, model } from 'mongoose';
import { IEstadoPregunta } from '../types/models.types';

const estadoPreguntaSchema = new Schema<IEstadoPregunta>(
  {
    nombre_estado: {
      type: String,
      required: [true, 'El nombre del estado es requerido'],
      enum: {
        values: ['borrador', 'revision', 'publicada', 'rechazada', 'archivada'],
        message: '{VALUE} no es un estado válido',
      },
      unique: true,
    },
    descripcion: {
      type: String,
      maxlength: [255, 'La descripción no puede exceder 255 caracteres'],
    },
    orden: {
      type: Number,
      required: [true, 'El orden es requerido'],
      unique: true,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

export const EstadoPregunta = model<IEstadoPregunta>(
  'EstadoPregunta',
  estadoPreguntaSchema,
  'estados_pregunta'
);
