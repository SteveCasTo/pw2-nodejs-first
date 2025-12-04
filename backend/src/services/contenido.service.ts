import { Contenido } from '@models/contenido.model';
import { IContenido } from '../types/models.types';
import { Types } from 'mongoose';

interface FiltrosContenido {
  tipo_contenido?:
    | 'texto'
    | 'imagen'
    | 'audio'
    | 'video'
    | 'documento'
    | 'otro';
  subido_por?: string;
}

export const contenidoService = {
  async getAll(filtros?: FiltrosContenido): Promise<IContenido[]> {
    const query: Record<string, unknown> = {};

    if (filtros?.tipo_contenido) {
      query.tipo_contenido = filtros.tipo_contenido;
    }

    if (filtros?.subido_por) {
      query.subido_por = new Types.ObjectId(filtros.subido_por);
    }

    return await Contenido.find(query)
      .populate('subido_por', 'correo nombre_completo')
      .sort({ fecha_subida: -1 });
  },

  async getById(id: string): Promise<IContenido | null> {
    return await Contenido.findById(id).populate(
      'subido_por',
      'correo nombre_completo'
    );
  },

  async create(data: {
    tipo_contenido:
      | 'texto'
      | 'imagen'
      | 'audio'
      | 'video'
      | 'documento'
      | 'otro';
    url_contenido?: string;
    nombre_archivo?: string;
    tamanio_bytes?: number;
    mime_type?: string;
    fecha_subida?: Date;
    subido_por?: string;
  }): Promise<IContenido> {
    const contenido = new Contenido({
      ...data,
      fecha_subida: data.fecha_subida || new Date(),
      subido_por: data.subido_por
        ? new Types.ObjectId(data.subido_por)
        : undefined,
    });

    return await contenido.save();
  },

  async delete(id: string): Promise<IContenido | null> {
    return await Contenido.findByIdAndDelete(id);
  },
};
