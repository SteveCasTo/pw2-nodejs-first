import { Examen } from '@models/examen.model';
import { Ciclo } from '@models/ciclo.model';
import { ExamenPregunta } from '@models/examenPregunta.model';
import { IExamen } from '../types/models.types';
import { Types } from 'mongoose';

interface FiltrosExamen {
  id_ciclo?: string;
  activo?: boolean;
  creado_por?: string;
}

export const examenService = {
  async getAll(filtros?: FiltrosExamen): Promise<IExamen[]> {
    const query: Record<string, unknown> = {};

    if (filtros?.id_ciclo) {
      query.id_ciclo = new Types.ObjectId(filtros.id_ciclo);
    }

    if (filtros?.activo !== undefined) {
      query.activo = filtros.activo;
    }

    if (filtros?.creado_por) {
      query.creado_por = new Types.ObjectId(filtros.creado_por);
    }

    return await Examen.find(query)
      .populate('id_ciclo', 'nombre_ciclo fecha_inicio fecha_fin activo')
      .populate('creado_por', 'correo_electronico nombre')
      .sort({ fecha_creacion: -1 });
  },

  async getById(id: string): Promise<IExamen | null> {
    return await Examen.findById(id)
      .populate('id_ciclo', 'nombre_ciclo fecha_inicio fecha_fin activo')
      .populate('creado_por', 'correo_electronico nombre');
  },

  async getExamenesDisponibles(): Promise<IExamen[]> {
    const now = new Date();

    return await Examen.find({
      activo: true,
      fecha_inicio: { $lte: now },
      fecha_fin: { $gte: now },
    })
      .populate('id_ciclo', 'nombre_ciclo activo')
      .sort({ fecha_inicio: -1 });
  },

  async getExamenesProximos(): Promise<IExamen[]> {
    const now = new Date();

    return await Examen.find({
      activo: true,
      fecha_inicio: { $gt: now },
    })
      .populate('id_ciclo', 'nombre_ciclo')
      .sort({ fecha_inicio: 1 });
  },

  async getExamenesFinalizados(): Promise<IExamen[]> {
    const now = new Date();

    return await Examen.find({
      activo: true,
      fecha_fin: { $lt: now },
    })
      .populate('id_ciclo', 'nombre_ciclo')
      .sort({ fecha_fin: -1 });
  },

  async create(data: {
    titulo: string;
    descripcion?: string;
    id_ciclo: string;
    fecha_inicio: Date;
    fecha_fin: Date;
    duracion_minutos?: number;
    intentos_permitidos?: number;
    calificacion_minima?: number;
    mostrar_resultados?: boolean;
    aleatorizar_preguntas?: boolean;
    aleatorizar_opciones?: boolean;
    creado_por: string;
  }): Promise<IExamen> {
    // Validar que el ciclo existe y está activo
    const ciclo = await Ciclo.findById(data.id_ciclo);
    if (!ciclo) {
      throw new Error('El ciclo especificado no existe');
    }

    if (!ciclo.activo) {
      throw new Error('El ciclo especificado no está activo');
    }

    // Validar que fecha_inicio < fecha_fin
    if (new Date(data.fecha_fin) <= new Date(data.fecha_inicio)) {
      throw new Error('La fecha de fin debe ser posterior a la fecha de inicio');
    }

    // Validar que las fechas del examen estén dentro del ciclo
    if (ciclo.fecha_inicio && new Date(data.fecha_inicio) < ciclo.fecha_inicio) {
      throw new Error(
        'La fecha de inicio del examen no puede ser anterior a la fecha de inicio del ciclo'
      );
    }

    if (ciclo.fecha_fin && new Date(data.fecha_fin) > ciclo.fecha_fin) {
      throw new Error(
        'La fecha de fin del examen no puede ser posterior a la fecha de fin del ciclo'
      );
    }

    const nuevoExamen = new Examen({
      titulo: data.titulo,
      descripcion: data.descripcion,
      id_ciclo: new Types.ObjectId(data.id_ciclo),
      fecha_inicio: new Date(data.fecha_inicio),
      fecha_fin: new Date(data.fecha_fin),
      duracion_minutos: data.duracion_minutos,
      intentos_permitidos: data.intentos_permitidos ?? 1,
      calificacion_minima: data.calificacion_minima,
      mostrar_resultados: data.mostrar_resultados ?? true,
      aleatorizar_preguntas: data.aleatorizar_preguntas ?? false,
      aleatorizar_opciones: data.aleatorizar_opciones ?? false,
      activo: true,
      fecha_creacion: new Date(),
      creado_por: new Types.ObjectId(data.creado_por),
    });

    return await nuevoExamen.save();
  },

  async update(
    id: string,
    data: {
      titulo?: string;
      descripcion?: string;
      id_ciclo?: string;
      fecha_inicio?: Date;
      fecha_fin?: Date;
      duracion_minutos?: number;
      intentos_permitidos?: number;
      calificacion_minima?: number;
      mostrar_resultados?: boolean;
      aleatorizar_preguntas?: boolean;
      aleatorizar_opciones?: boolean;
    }
  ): Promise<IExamen | null> {
    const examenExistente = await Examen.findById(id);
    if (!examenExistente) {
      throw new Error('El examen no existe');
    }

    // Si se cambia el ciclo, validar que existe y está activo
    if (data.id_ciclo) {
      const ciclo = await Ciclo.findById(data.id_ciclo);
      if (!ciclo) {
        throw new Error('El ciclo especificado no existe');
      }
      if (!ciclo.activo) {
        throw new Error('El ciclo especificado no está activo');
      }
    }

    // Validar fechas si se proporcionan ambas o una de ellas
    const fechaInicio = data.fecha_inicio
      ? new Date(data.fecha_inicio)
      : examenExistente.fecha_inicio;
    const fechaFin = data.fecha_fin
      ? new Date(data.fecha_fin)
      : examenExistente.fecha_fin;

    if (fechaFin <= fechaInicio) {
      throw new Error('La fecha de fin debe ser posterior a la fecha de inicio');
    }

    return await Examen.findByIdAndUpdate(
      id,
      {
        ...(data.titulo && { titulo: data.titulo }),
        ...(data.descripcion !== undefined && { descripcion: data.descripcion }),
        ...(data.id_ciclo && { id_ciclo: new Types.ObjectId(data.id_ciclo) }),
        ...(data.fecha_inicio && { fecha_inicio: new Date(data.fecha_inicio) }),
        ...(data.fecha_fin && { fecha_fin: new Date(data.fecha_fin) }),
        ...(data.duracion_minutos !== undefined && {
          duracion_minutos: data.duracion_minutos,
        }),
        ...(data.intentos_permitidos !== undefined && {
          intentos_permitidos: data.intentos_permitidos,
        }),
        ...(data.calificacion_minima !== undefined && {
          calificacion_minima: data.calificacion_minima,
        }),
        ...(data.mostrar_resultados !== undefined && {
          mostrar_resultados: data.mostrar_resultados,
        }),
        ...(data.aleatorizar_preguntas !== undefined && {
          aleatorizar_preguntas: data.aleatorizar_preguntas,
        }),
        ...(data.aleatorizar_opciones !== undefined && {
          aleatorizar_opciones: data.aleatorizar_opciones,
        }),
      },
      { new: true, runValidators: true }
    );
  },

  async desactivar(id: string): Promise<IExamen | null> {
    const examenExistente = await Examen.findById(id);
    if (!examenExistente) {
      throw new Error('El examen no existe');
    }

    examenExistente.activo = false;
    return await examenExistente.save();
  },

  async delete(id: string): Promise<IExamen | null> {
    const examenExistente = await Examen.findById(id);
    if (!examenExistente) {
      throw new Error('El examen no existe');
    }

    // Verificar si hay preguntas asociadas
    const preguntasAsociadas = await ExamenPregunta.countDocuments({
      id_examen: id,
    });

    if (preguntasAsociadas > 0) {
      throw new Error(
        `No se puede eliminar el examen porque tiene ${preguntasAsociadas} pregunta(s) asociada(s). Desactívelo en su lugar.`
      );
    }

    return await Examen.findByIdAndDelete(id);
  },

  async getEstadisticas(id: string): Promise<unknown> {
    const examen = await Examen.findById(id);
    if (!examen) {
      throw new Error('El examen no existe');
    }

    // Contar preguntas asociadas
    const totalPreguntas = await ExamenPregunta.countDocuments({
      id_examen: id,
    });

    // Calcular puntos totales
    const preguntasConPuntos = await ExamenPregunta.find({
      id_examen: id,
    }).populate('id_pregunta', 'puntos_recomendados');

    const puntajeTotalCalculado = preguntasConPuntos.reduce((total, ep) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pregunta = ep.id_pregunta as any;
      const puntos = ep.usar_puntos_recomendados
        ? pregunta?.puntos_recomendados || 0
        : ep.puntos_asignados || 0;
      return total + puntos;
    }, 0);

    const now = new Date();
    let estadoExamen = 'No iniciado';

    if (now >= examen.fecha_inicio && now <= examen.fecha_fin) {
      estadoExamen = 'En curso';
    } else if (now > examen.fecha_fin) {
      estadoExamen = 'Finalizado';
    }

    return {
      id: examen._id,
      titulo: examen.titulo,
      total_preguntas: totalPreguntas,
      puntaje_total: puntajeTotalCalculado,
      intentos_permitidos: examen.intentos_permitidos,
      duracion_minutos: examen.duracion_minutos,
      fecha_inicio: examen.fecha_inicio,
      fecha_fin: examen.fecha_fin,
      estado: estadoExamen,
      activo: examen.activo,
    };
  },
};
