import { Subcategoria } from '@models/subcategoria.model';
import { Categoria } from '@models/categoria.model';
import { ISubcategoria } from '../types/models.types';
import { Types } from 'mongoose';

export class SubcategoriaService {
  async getAll(filtros?: { activo?: boolean; id_categoria?: string }): Promise<ISubcategoria[]> {
    const query: Record<string, unknown> = {};
    
    if (filtros?.activo !== undefined) {
      query.activo = filtros.activo;
    }

    if (filtros?.id_categoria) {
      query.id_categoria = filtros.id_categoria;
    }

    return await Subcategoria.find(query)
      .populate('id_categoria', 'nombre_categoria')
      .sort({ nombre_subcategoria: 1 });
  }

  async getById(id: string): Promise<ISubcategoria | null> {
    return await Subcategoria.findById(id).populate('id_categoria', 'nombre_categoria');
  }

  async getByCategoria(id_categoria: string): Promise<ISubcategoria[]> {
    return await Subcategoria.find({ id_categoria, activo: true }).sort({ nombre_subcategoria: 1 });
  }

  async create(data: {
    id_categoria: string;
    nombre_subcategoria: string;
    descripcion?: string;
    activo?: boolean;
  }): Promise<ISubcategoria> {
    // Verificar que la categoría existe
    const categoria = await Categoria.findById(data.id_categoria);
    if (!categoria) {
      throw new Error('La categoría especificada no existe');
    }

    if (!categoria.activo) {
      throw new Error('No se puede crear una subcategoría para una categoría inactiva');
    }

    // Verificar que no exista una subcategoría con el mismo nombre en esta categoría
    const existente = await Subcategoria.findOne({
      id_categoria: data.id_categoria,
      nombre_subcategoria: data.nombre_subcategoria,
    });
    if (existente) {
      throw new Error(
        `Ya existe una subcategoría con el nombre "${data.nombre_subcategoria}" en esta categoría`
      );
    }

    const subcategoria = new Subcategoria({
      ...data,
      id_categoria: new Types.ObjectId(data.id_categoria),
      fecha_creacion: new Date(),
    });
    return await subcategoria.save();
  }

  async update(
    id: string,
    data: Partial<{
      id_categoria: string;
      nombre_subcategoria: string;
      descripcion: string;
      activo: boolean;
    }>
  ): Promise<ISubcategoria | null> {
    // Si se actualiza la categoría, verificar que existe
    if (data.id_categoria) {
      const categoria = await Categoria.findById(data.id_categoria);
      if (!categoria) {
        throw new Error('La categoría especificada no existe');
      }
    }

    // Si se actualiza el nombre, verificar que no exista duplicado
    if (data.nombre_subcategoria) {
      const subcategoriaActual = await Subcategoria.findById(id);
      if (!subcategoriaActual) {
        return null;
      }

      const id_categoria = data.id_categoria || subcategoriaActual.id_categoria;

      const existente = await Subcategoria.findOne({
        id_categoria,
        nombre_subcategoria: data.nombre_subcategoria,
        _id: { $ne: id },
      });
      if (existente) {
        throw new Error(
          `Ya existe otra subcategoría con el nombre "${data.nombre_subcategoria}" en esta categoría`
        );
      }
    }

    const updateData = { ...data };
    if (data.id_categoria) {
      updateData.id_categoria = new Types.ObjectId(data.id_categoria) as unknown as string;
    }

    return await Subcategoria.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate('id_categoria', 'nombre_categoria');
  }

  async delete(id: string): Promise<ISubcategoria | null> {
    return await Subcategoria.findByIdAndUpdate(
      id,
      { activo: false },
      { new: true }
    ).populate('id_categoria', 'nombre_categoria');
  }

  async hardDelete(id: string): Promise<ISubcategoria | null> {
    return await Subcategoria.findByIdAndDelete(id);
  }
}

export const subcategoriaService = new SubcategoriaService();
