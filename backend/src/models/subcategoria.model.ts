import { Schema, model } from 'mongoose';
import { ISubcategoria } from '../types/models.types';

const subcategoriaSchema = new Schema<ISubcategoria>(
  {
    id_categoria: {
      type: Schema.Types.ObjectId,
      ref: 'Categoria',
      required: [true, 'El ID de categoría es requerido'],
    },
    nombre_subcategoria: {
      type: String,
      required: [true, 'El nombre de la subcategoría es requerido'],
      maxlength: [100, 'El nombre no puede exceder 100 caracteres'],
      trim: true,
    },
    descripcion: {
      type: String,
      maxlength: [255, 'La descripción no puede exceder 255 caracteres'],
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

subcategoriaSchema.index({ id_categoria: 1, nombre_subcategoria: 1 }, { unique: true });

export const Subcategoria = model<ISubcategoria>('Subcategoria', subcategoriaSchema, 'subcategorias');