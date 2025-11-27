import { Categoria } from '@models/categoria.model';
import { ICategoria } from '../types/models.types';

interface FiltrosCategoria {
  activo?: boolean;
}

export const categoriaService = {
  async getAll(filtros?: FiltrosCategoria): Promise<ICategoria[]> {
    const query: Record<string, unknown> = {};

    if (filtros?.activo !== undefined) {
      query.activo = filtros.activo;
    }

    return await Categoria.find(query).sort({ nombre_categoria: 1 });
  },

  async getById(id: string): Promise<ICategoria | null> {
    return await Categoria.findById(id);
  },

  async create(data: {
    nombre_categoria: string;
    activo?: boolean;
  }): Promise<ICategoria> {
    const existente = await Categoria.findOne({
      nombre_categoria: data.nombre_categoria,
    });
    if (existente) {
      throw new Error(
        `Ya existe una categoría con el nombre "${data.nombre_categoria}"`
      );
    }

    const categoria = new Categoria({
      ...data,
      fecha_creacion: new Date(),
    });
    return await categoria.save();
  },

  async update(
    id: string,
    data: Partial<{
      nombre_categoria: string;
      activo: boolean;
    }>
  ): Promise<ICategoria | null> {
    if (data.nombre_categoria) {
      const existente = await Categoria.findOne({
        nombre_categoria: data.nombre_categoria,
        _id: { $ne: id },
      });
      if (existente) {
        throw new Error(
          `Ya existe otra categoría con el nombre "${data.nombre_categoria}"`
        );
      }
    }

    return await Categoria.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  },

  async delete(id: string): Promise<ICategoria | null> {
    return await Categoria.findByIdAndUpdate(
      id,
      { activo: false },
      { new: true }
    );
  },

  async hardDelete(id: string): Promise<ICategoria | null> {
    return await Categoria.findByIdAndDelete(id);
  },
};
