import { EstadoPregunta } from '@models/estadoPregunta.model';
import { IEstadoPregunta } from '../types/models.types';

export const estadoPreguntaService = {
  async getAll(): Promise<IEstadoPregunta[]> {
    return await EstadoPregunta.find().sort({ orden: 1 });
  },

  async getById(id: string): Promise<IEstadoPregunta | null> {
    return await EstadoPregunta.findById(id);
  },

  async create(data: {
    nombre_estado: 'borrador' | 'revision' | 'publicada' | 'rechazada' | 'archivada';
    descripcion?: string;
    orden: number;
  }): Promise<IEstadoPregunta> {
    // Validar que no exista un estado con el mismo nombre
    const existente = await EstadoPregunta.findOne({
      nombre_estado: data.nombre_estado,
    });
    if (existente) {
      throw new Error(
        `Ya existe un estado con el nombre "${data.nombre_estado}"`
      );
    }

    // Validar que no exista un estado con el mismo orden
    const existenteOrden = await EstadoPregunta.findOne({
      orden: data.orden,
    });
    if (existenteOrden) {
      throw new Error(
        `Ya existe un estado con el orden ${data.orden}`
      );
    }

    const estado = new EstadoPregunta(data);
    return await estado.save();
  },
};
