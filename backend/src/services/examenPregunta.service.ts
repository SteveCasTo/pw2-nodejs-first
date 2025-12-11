import { ExamenPregunta } from '@models/examenPregunta.model';
import { Examen } from '@models/examen.model';
import { Pregunta } from '@models/pregunta.model';
import { EstadoPregunta } from '@models/estadoPregunta.model';
import { IntentoExamen } from '@models/intentoExamen.model';
import { IExamenPregunta } from '../types/models.types';
import { Types } from 'mongoose';

export const examenPreguntaService = {
  async getAll(): Promise<IExamenPregunta[]> {
    return await ExamenPregunta.find()
      .populate('id_examen', 'titulo fecha_inicio fecha_fin activo')
      .populate('id_pregunta', 'titulo_pregunta tipo_pregunta puntos_recomendados')
      .populate('agregada_por', 'correo_electronico nombre')
      .sort({ id_examen: 1, orden_definido: 1, fecha_agregada: 1 });
  },

  async getById(id: string): Promise<IExamenPregunta | null> {
    return await ExamenPregunta.findById(id)
      .populate('id_examen', 'titulo fecha_inicio fecha_fin activo')
      .populate('id_pregunta', 'titulo_pregunta tipo_pregunta puntos_recomendados')
      .populate('agregada_por', 'correo_electronico nombre');
  },

  async getByExamenId(idExamen: string): Promise<IExamenPregunta[]> {
    return await ExamenPregunta.find({ id_examen: idExamen })
      .populate(
        'id_pregunta',
        'titulo_pregunta tipo_pregunta puntos_recomendados id_subcategoria id_dificultad'
      )
      .populate('agregada_por', 'correo_electronico nombre')
      .sort({ orden_definido: 1, fecha_agregada: 1 });
  },

  async create(data: {
    id_examen: string;
    id_pregunta: string;
    orden_definido?: number;
    puntos_asignados?: number;
    usar_puntos_recomendados?: boolean;
    obligatoria?: boolean;
    agregada_por: string;
  }): Promise<IExamenPregunta> {
    // Validar que el examen existe
    const examen = await Examen.findById(data.id_examen);
    if (!examen) {
      throw new Error('El examen especificado no existe');
    }

    // Validar que el examen está activo
    if (!examen.activo) {
      throw new Error('No se pueden agregar preguntas a un examen inactivo');
    }

    // Validar que la pregunta existe
    const pregunta = await Pregunta.findById(data.id_pregunta);
    if (!pregunta) {
      throw new Error('La pregunta especificada no existe');
    }

    // Validar que la pregunta está publicada
    const estado = await EstadoPregunta.findById(pregunta.id_estado);
    if (estado?.nombre_estado !== 'publicada') {
      throw new Error(
        'Solo se pueden agregar preguntas en estado "publicada" a un examen. Estado actual: ' +
          estado?.nombre_estado
      );
    }

    // Validar que la pregunta no esté duplicada en el examen
    const preguntaDuplicada = await ExamenPregunta.findOne({
      id_examen: data.id_examen,
      id_pregunta: data.id_pregunta,
    });

    if (preguntaDuplicada) {
      throw new Error('Esta pregunta ya está asociada al examen');
    }

    // Validar que no haya intentos del examen
    const hayIntentos = await IntentoExamen.countDocuments({
      id_examen: data.id_examen,
    });

    if (hayIntentos > 0) {
      throw new Error(
        'No se pueden agregar preguntas a un examen que ya tiene intentos registrados'
      );
    }

    // Si se especifica orden, validar que no esté duplicado
    if (data.orden_definido) {
      const ordenDuplicado = await ExamenPregunta.findOne({
        id_examen: data.id_examen,
        orden_definido: data.orden_definido,
      });

      if (ordenDuplicado) {
        throw new Error(
          `Ya existe una pregunta con orden ${data.orden_definido} en este examen`
        );
      }
    }

    // Validar puntos
    const usarPuntosRecomendados = data.usar_puntos_recomendados ?? true;

    if (!usarPuntosRecomendados && data.puntos_asignados === undefined) {
      throw new Error(
        'Debe proporcionar puntos_asignados cuando usar_puntos_recomendados es false'
      );
    }

    const nuevaExamenPregunta = new ExamenPregunta({
      id_examen: new Types.ObjectId(data.id_examen),
      id_pregunta: new Types.ObjectId(data.id_pregunta),
      orden_definido: data.orden_definido,
      puntos_asignados: data.puntos_asignados,
      usar_puntos_recomendados: usarPuntosRecomendados,
      obligatoria: data.obligatoria ?? true,
      fecha_agregada: new Date(),
      agregada_por: new Types.ObjectId(data.agregada_por),
    });

    return await nuevaExamenPregunta.save();
  },

  async update(
    id: string,
    data: {
      orden_definido?: number;
      puntos_asignados?: number;
      usar_puntos_recomendados?: boolean;
      obligatoria?: boolean;
    }
  ): Promise<IExamenPregunta | null> {
    const examenPreguntaExistente = await ExamenPregunta.findById(id);
    if (!examenPreguntaExistente) {
      throw new Error('La asociación examen-pregunta no existe');
    }

    // Validar que no haya intentos del examen
    const hayIntentos = await IntentoExamen.countDocuments({
      id_examen: examenPreguntaExistente.id_examen,
    });

    if (hayIntentos > 0) {
      throw new Error(
        'No se pueden modificar preguntas de un examen que ya tiene intentos registrados'
      );
    }

    // Si se cambia el orden, validar que no esté duplicado
    if (
      data.orden_definido &&
      data.orden_definido !== examenPreguntaExistente.orden_definido
    ) {
      const ordenDuplicado = await ExamenPregunta.findOne({
        id_examen: examenPreguntaExistente.id_examen,
        orden_definido: data.orden_definido,
        _id: { $ne: id },
      });

      if (ordenDuplicado) {
        throw new Error(
          `Ya existe una pregunta con orden ${data.orden_definido} en este examen`
        );
      }
    }

    return await ExamenPregunta.findByIdAndUpdate(
      id,
      {
        ...(data.orden_definido !== undefined && {
          orden_definido: data.orden_definido,
        }),
        ...(data.puntos_asignados !== undefined && {
          puntos_asignados: data.puntos_asignados,
        }),
        ...(data.usar_puntos_recomendados !== undefined && {
          usar_puntos_recomendados: data.usar_puntos_recomendados,
        }),
        ...(data.obligatoria !== undefined && { obligatoria: data.obligatoria }),
      },
      { new: true, runValidators: true }
    );
  },

  async delete(id: string): Promise<IExamenPregunta | null> {
    const examenPreguntaExistente = await ExamenPregunta.findById(id);
    if (!examenPreguntaExistente) {
      throw new Error('La asociación examen-pregunta no existe');
    }

    // Validar que no haya intentos del examen
    const hayIntentos = await IntentoExamen.countDocuments({
      id_examen: examenPreguntaExistente.id_examen,
    });

    if (hayIntentos > 0) {
      throw new Error(
        'No se pueden eliminar preguntas de un examen que ya tiene intentos registrados'
      );
    }

    return await ExamenPregunta.findByIdAndDelete(id);
  },

  async getPuntajeTotalExamen(idExamen: string): Promise<number> {
    const preguntasExamen = await ExamenPregunta.find({
      id_examen: idExamen,
    }).populate('id_pregunta', 'puntos_recomendados');

    const puntajeTotal = preguntasExamen.reduce((total, ep) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pregunta = ep.id_pregunta as any;
      const puntos = ep.usar_puntos_recomendados
        ? pregunta?.puntos_recomendados || 0
        : ep.puntos_asignados || 0;
      return total + puntos;
    }, 0);

    return puntajeTotal;
  },

  async reordenarPreguntas(
    idExamen: string,
    ordenamiento: Array<{ id: string; orden: number }>
  ): Promise<unknown> {
    // Validar que no haya intentos del examen
    const hayIntentos = await IntentoExamen.countDocuments({
      id_examen: idExamen,
    });

    if (hayIntentos > 0) {
      throw new Error(
        'No se pueden reordenar preguntas de un examen que ya tiene intentos registrados'
      );
    }

    // Validar que no haya órdenes duplicados
    const ordenes = ordenamiento.map((o) => o.orden);
    const ordenesUnicos = new Set(ordenes);

    if (ordenes.length !== ordenesUnicos.size) {
      throw new Error('No puede haber órdenes duplicados');
    }

    // Actualizar cada pregunta
    const actualizaciones = ordenamiento.map(async (item) => {
      const examenPregunta = await ExamenPregunta.findById(item.id);
      if (!examenPregunta) {
        throw new Error(`No se encontró la pregunta con ID ${item.id}`);
      }

      if (examenPregunta.id_examen.toString() !== idExamen) {
        throw new Error(`La pregunta ${item.id} no pertenece a este examen`);
      }

      examenPregunta.orden_definido = item.orden;
      return await examenPregunta.save();
    });

    await Promise.all(actualizaciones);

    return {
      message: 'Preguntas reordenadas exitosamente',
      total_actualizadas: ordenamiento.length,
    };
  },
};
