import { Schema, model } from 'mongoose';
import { IContenido } from '../types/models.types';

const contenidoSchema = new Schema<IContenido>(
  {
    tipo_contenido: {
      type: String,
      required: [true, 'El tipo de contenido es requerido'],
      enum: {
        values: ['texto', 'imagen', 'audio', 'video', 'documento', 'otro'],
        message: '{VALUE} no es un tipo de contenido válido',
      },
    },
    url_contenido: {
      type: String,
      required: [true, 'La URL del contenido es requerida'],
    },
    nombre_archivo: {
      type: String,
      maxlength: [255, 'El nombre del archivo no puede exceder 255 caracteres'],
    },
    tamanio_bytes: {
      type: Number,
      min: [0, 'El tamaño debe ser mayor o igual a 0'],
    },
    mime_type: {
      type: String,
      maxlength: [100, 'El MIME type no puede exceder 100 caracteres'],
    },
    fecha_subida: {
      type: Date,
      default: Date.now,
    },
    subido_por: {
      type: Schema.Types.ObjectId,
      ref: 'Usuario',
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

contenidoSchema.index({ tipo_contenido: 1 });
contenidoSchema.index({ subido_por: 1 });

export const Contenido = model<IContenido>('Contenido', contenidoSchema, 'contenidos');