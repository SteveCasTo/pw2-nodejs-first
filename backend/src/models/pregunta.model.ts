import { Schema, model } from 'mongoose';
import { IPregunta } from '../types/models.types';

const preguntaSchema = new Schema<IPregunta>(
  {
    id_subcategoria: {
      type: Schema.Types.ObjectId,
      ref: 'Subcategoria',
      required: [true, 'La subcategoría es requerida'],
    },
    id_rango_edad: {
      type: Schema.Types.ObjectId,
      ref: 'RangoEdad',
      required: [true, 'El rango de edad es requerido'],
    },
    id_dificultad: {
      type: Schema.Types.ObjectId,
      ref: 'NivelDificultad',
      required: [true, 'El nivel de dificultad es requerido'],
    },
    id_estado: {
      type: Schema.Types.ObjectId,
      ref: 'EstadoPregunta',
      required: [true, 'El estado es requerido'],
      default: null,
    },
    tipo_pregunta: {
      type: String,
      required: [true, 'El tipo de pregunta es requerido'],
      enum: {
        values: ['seleccion_multiple', 'verdadero_falso', 'desarrollo', 'respuesta_corta', 'emparejamiento'],
        message: '{VALUE} no es un tipo de pregunta válido',
      },
    },
    titulo_pregunta: {
      type: String,
      required: [true, 'El título de la pregunta es requerido'],
      maxlength: [255, 'El título no puede exceder 255 caracteres'],
    },
    id_contenido_pregunta: {
      type: Schema.Types.ObjectId,
      ref: 'Contenido',
    },
    puntos_recomendados: {
      type: Number,
      default: 1.0,
      min: [0, 'Los puntos deben ser mayores o iguales a 0'],
    },
    tiempo_estimado: {
      type: Number,
      min: [0, 'El tiempo debe ser mayor o igual a 0'],
    },
    explicacion: {
      type: String,
      maxlength: [255, 'La explicación no puede exceder 255 caracteres'],
    },
    fecha_creacion: {
      type: Date,
      default: Date.now,
    },
    fecha_modificacion: {
      type: Date,
      default: Date.now,
    },
    creado_por: {
      type: Schema.Types.ObjectId,
      ref: 'Usuario',
      required: [true, 'El creador es requerido'],
    },
    votos_requeridos: {
      type: Number,
      default: 3,
    },
    votos_positivos: {
      type: Number,
      default: 0,
    },
    votos_negativos: {
      type: Number,
      default: 0,
    },
    fecha_publicacion: {
      type: Date,
      default: Date.now,
    },
    activa: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

preguntaSchema.index({ id_subcategoria: 1 });
preguntaSchema.index({ id_rango_edad: 1 });
preguntaSchema.index({ id_dificultad: 1 });
preguntaSchema.index({ id_estado: 1 });
preguntaSchema.index({ tipo_pregunta: 1 });
preguntaSchema.index({ activa: 1 });
preguntaSchema.index({ creado_por: 1 });

export const Pregunta = model<IPregunta>('Pregunta', preguntaSchema, 'preguntas');