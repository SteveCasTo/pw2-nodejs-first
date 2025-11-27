import { RangoEdad } from '@models/rangoEdad.model';
import { IRangoEdad } from '../types/models.types';

export class RangoEdadService {
  async getAll(filtros?: { activo?: boolean }): Promise<IRangoEdad[]> {
    const query: Record<string, unknown> = {};
    
    if (filtros?.activo !== undefined) {
      query.activo = filtros.activo;
    }

    return await RangoEdad.find(query).sort({ edad_minima: 1 });
  }

  async getById(id: string): Promise<IRangoEdad | null> {
    return await RangoEdad.findById(id);
  }

  async create(data: {
    nombre_rango: string;
    edad_minima: number;
    edad_maxima: number;
    activo?: boolean;
  }): Promise<IRangoEdad> {
    const existente = await RangoEdad.findOne({ nombre_rango: data.nombre_rango });
    if (existente) {
      throw new Error(`Ya existe un rango con el nombre "${data.nombre_rango}"`);
    }

    if (data.edad_maxima <= data.edad_minima) {
      throw new Error('La edad máxima debe ser mayor que la edad mínima');
    }

    const rangoEdad = new RangoEdad(data);
    return await rangoEdad.save();
  }

  async update(
    id: string,
    data: Partial<{
      nombre_rango: string;
      edad_minima: number;
      edad_maxima: number;
      activo: boolean;
    }>
  ): Promise<IRangoEdad | null> {
    if (data.nombre_rango) {
      const existente = await RangoEdad.findOne({
        nombre_rango: data.nombre_rango,
        _id: { $ne: id },
      });
      if (existente) {
        throw new Error(`Ya existe otro rango con el nombre "${data.nombre_rango}"`);
      }
    }

    const rangoActual = await RangoEdad.findById(id);
    if (!rangoActual) {
      return null;
    }

    const edadMin = data.edad_minima ?? rangoActual.edad_minima;
    const edadMax = data.edad_maxima ?? rangoActual.edad_maxima;

    if (edadMax <= edadMin) {
      throw new Error('La edad máxima debe ser mayor que la edad mínima');
    }

    return await RangoEdad.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id: string): Promise<IRangoEdad | null> {
    return await RangoEdad.findByIdAndUpdate(
      id,
      { activo: false },
      { new: true }
    );
  }

  async hardDelete(id: string): Promise<IRangoEdad | null> {
    return await RangoEdad.findByIdAndDelete(id);
  }
}

export const rangoEdadService = new RangoEdadService();