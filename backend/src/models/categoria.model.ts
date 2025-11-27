import { Schema, model } from 'mongoose';
import { ICategoria } from '../types/models.types';

const categoriaSchema = new Schema<ICategoria>(
  {
    nombre_categoria: {
      type: String,
      required: [true, 'El nombre de la categoría es requerido'],
      unique: true,
      maxlength: [100, 'El nombre no puede exceder 100 caracteres'],
      trim: true,
    },
    fecha_creacion: {
      type: Date,
      default: Date.now,
    },
    activo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

export const Categoria = model<ICategoria>(
  'Categoria',
  categoriaSchema,
  'categorias'
);
