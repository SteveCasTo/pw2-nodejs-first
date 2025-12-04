import { Pregunta } from '@models/pregunta.model';
import { Subcategoria } from '@models/subcategoria.model';
import { RangoEdad } from '@models/rangoEdad.model';
import { NivelDificultad } from '@models/nivelDificultad.model';
import { EstadoPregunta } from '@models/estadoPregunta.model';
import { Contenido } from '@models/contenido.model';
import { IPregunta } from '../types/models.types';
import { Types } from 'mongoose';

interface FiltrosPregunta {
  tipo_pregunta?:
    | 'seleccion_multiple'
    | 'verdadero_falso'
    | 'desarrollo'
    | 'respuesta_corta'
    | 'emparejamiento';
  id_subcategoria?: string;
  id_dificultad?: string;
  id_estado?: string;
  activa?: boolean;
}

export const preguntaService = {
  async getAll(filtros?: FiltrosPregunta): Promise<IPregunta[]> {
    const query: Record<string, unknown> = {};

    if (filtros?.tipo_pregunta) {
      query.tipo_pregunta = filtros.tipo_pregunta;
    }

    if (filtros?.id_subcategoria) {
      query.id_subcategoria = new Types.ObjectId(filtros.id_subcategoria);
    }

    if (filtros?.id_dificultad) {
      query.id_dificultad = new Types.ObjectId(filtros.id_dificultad);
    }

    if (filtros?.id_estado) {
      query.id_estado = new Types.ObjectId(filtros.id_estado);
    }

    if (filtros?.activa !== undefined) {
      query.activa = filtros.activa;
    }

    return await Pregunta.find(query)
      .populate('id_subcategoria', 'nombre_subcategoria')
      .populate('id_rango_edad', 'nombre_rango edad_minima edad_maxima')
      .populate('id_dificultad', 'nivel descripcion')
      .populate('id_estado', 'nombre_estado descripcion')
      .populate(
        'id_contenido_pregunta',
        'tipo_contenido url_contenido nombre_archivo'
      )
      .populate('creado_por', 'correo nombre_completo')
      .sort({ fecha_creacion: -1 });
  },

  async getById(id: string): Promise<IPregunta | null> {
    return await Pregunta.findById(id)
      .populate('id_subcategoria', 'nombre_subcategoria')
      .populate('id_rango_edad', 'nombre_rango edad_minima edad_maxima')
      .populate('id_dificultad', 'nivel descripcion')
      .populate('id_estado', 'nombre_estado descripcion')
      .populate(
        'id_contenido_pregunta',
        'tipo_contenido url_contenido nombre_archivo'
      )
      .populate('creado_por', 'correo nombre_completo');
  },

  async create(data: {
    id_subcategoria: string;
    id_rango_edad: string;
    id_dificultad: string;
    id_estado: string;
    tipo_pregunta:
      | 'seleccion_multiple'
      | 'verdadero_falso'
      | 'desarrollo'
      | 'respuesta_corta'
      | 'emparejamiento';
    titulo_pregunta: string;
    id_contenido_pregunta?: string;
    puntos_recomendados: number;
    tiempo_estimado?: number;
    explicacion?: string;
    fecha_creacion?: Date;
    creado_por?: string;
    votos_requeridos?: number;
    fecha_publicacion?: Date;
    activa?: boolean;
  }): Promise<IPregunta> {
    // Validar que la subcategoría existe
    const subcategoriaExiste = await Subcategoria.findById(
      data.id_subcategoria
    );
    if (!subcategoriaExiste) {
      throw new Error('La subcategoría especificada no existe');
    }

    // Validar que el rango de edad existe
    const rangoEdadExiste = await RangoEdad.findById(data.id_rango_edad);
    if (!rangoEdadExiste) {
      throw new Error('El rango de edad especificado no existe');
    }

    // Validar que el nivel de dificultad existe
    const nivelDificultadExiste = await NivelDificultad.findById(
      data.id_dificultad
    );
    if (!nivelDificultadExiste) {
      throw new Error('El nivel de dificultad especificado no existe');
    }

    // Validar que el estado existe
    const estadoExiste = await EstadoPregunta.findById(data.id_estado);
    if (!estadoExiste) {
      throw new Error('El estado especificado no existe');
    }

    // Validar contenido si se proporciona
    if (data.id_contenido_pregunta) {
      const contenidoExiste = await Contenido.findById(
        data.id_contenido_pregunta
      );
      if (!contenidoExiste) {
        throw new Error('El contenido especificado no existe');
      }
    }

    const pregunta = new Pregunta({
      ...data,
      id_subcategoria: new Types.ObjectId(data.id_subcategoria),
      id_rango_edad: new Types.ObjectId(data.id_rango_edad),
      id_dificultad: new Types.ObjectId(data.id_dificultad),
      id_estado: new Types.ObjectId(data.id_estado),
      id_contenido_pregunta: data.id_contenido_pregunta
        ? new Types.ObjectId(data.id_contenido_pregunta)
        : undefined,
      creado_por: data.creado_por
        ? new Types.ObjectId(data.creado_por)
        : undefined,
      fecha_creacion: data.fecha_creacion || new Date(),
      fecha_modificacion: new Date(),
      fecha_publicacion: data.fecha_publicacion || new Date(),
      votos_positivos: 0,
      votos_negativos: 0,
    });

    return await pregunta.save();
  },

  async update(
    id: string,
    data: Partial<{
      id_subcategoria: string;
      id_rango_edad: string;
      id_dificultad: string;
      id_estado: string;
      tipo_pregunta: string;
      titulo_pregunta: string;
      id_contenido_pregunta: string;
      puntos_recomendados: number;
      tiempo_estimado: number;
      explicacion: string;
      activa: boolean;
    }>
  ): Promise<IPregunta | null> {
    // Validar referencias si se proporcionan
    if (data.id_subcategoria) {
      const subcategoriaExiste = await Subcategoria.findById(
        data.id_subcategoria
      );
      if (!subcategoriaExiste) {
        throw new Error('La subcategoría especificada no existe');
      }
    }

    if (data.id_rango_edad) {
      const rangoEdadExiste = await RangoEdad.findById(data.id_rango_edad);
      if (!rangoEdadExiste) {
        throw new Error('El rango de edad especificado no existe');
      }
    }

    if (data.id_dificultad) {
      const nivelDificultadExiste = await NivelDificultad.findById(
        data.id_dificultad
      );
      if (!nivelDificultadExiste) {
        throw new Error('El nivel de dificultad especificado no existe');
      }
    }

    if (data.id_estado) {
      const estadoExiste = await EstadoPregunta.findById(data.id_estado);
      if (!estadoExiste) {
        throw new Error('El estado especificado no existe');
      }
    }

    if (data.id_contenido_pregunta) {
      const contenidoExiste = await Contenido.findById(
        data.id_contenido_pregunta
      );
      if (!contenidoExiste) {
        throw new Error('El contenido especificado no existe');
      }
    }

    const updateData = {
      ...data,
      fecha_modificacion: new Date(),
    };

    return await Pregunta.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  },

  async delete(id: string): Promise<IPregunta | null> {
    return await Pregunta.findByIdAndUpdate(
      id,
      { activa: false, fecha_modificacion: new Date() },
      { new: true }
    );
  },

  async hardDelete(id: string): Promise<IPregunta | null> {
    return await Pregunta.findByIdAndDelete(id);
  },
};
