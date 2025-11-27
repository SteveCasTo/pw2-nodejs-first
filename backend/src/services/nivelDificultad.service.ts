import { NivelDificultad } from '@models/nivelDificultad.model';
import { INivelDificultad } from '../types/models.types';

interface FiltrosNivel {
  nivel?: string;
  activo?: boolean;
}

export const nivelDificultadService = {
  async getAll(filtros?: FiltrosNivel) {
    const query: Record<string, unknown> = {};

    if (filtros?.nivel) {
      query.nivel = filtros.nivel;
    }

    if (filtros?.activo !== undefined) {
      query.activo = filtros.activo;
    }

    const niveles = await NivelDificultad.find(query).sort({ nivel: 1 });
    return niveles;
  },

  async getById(id: string) {
    const nivel = await NivelDificultad.findById(id);
    if (!nivel) {
      throw new Error('Nivel de dificultad no encontrado');
    }
    return nivel;
  },

  async create(data: Partial<INivelDificultad>) {
    const nivelExistente = await NivelDificultad.findOne({ nivel: data.nivel });
    if (nivelExistente) {
      throw new Error('Ya existe un nivel de dificultad con ese nombre');
    }

    const nivel = new NivelDificultad(data);
    await nivel.save();
    return nivel;
  },

  async update(id: string, data: Partial<INivelDificultad>) {
    if (data.nivel) {
      const nivelExistente = await NivelDificultad.findOne({
        nivel: data.nivel,
        _id: { $ne: id },
      });
      if (nivelExistente) {
        throw new Error('Ya existe un nivel de dificultad con ese nombre');
      }
    }

    const nivel = await NivelDificultad.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!nivel) {
      throw new Error('Nivel de dificultad no encontrado');
    }

    return nivel;
  },

  async delete(id: string) {
    const nivel = await NivelDificultad.findByIdAndUpdate(
      id,
      { activo: false },
      { new: true }
    );

    if (!nivel) {
      throw new Error('Nivel de dificultad no encontrado');
    }

    return nivel;
  },

  async hardDelete(id: string) {
    const nivel = await NivelDificultad.findByIdAndDelete(id);

    if (!nivel) {
      throw new Error('Nivel de dificultad no encontrado');
    }

    return nivel;
  },
};