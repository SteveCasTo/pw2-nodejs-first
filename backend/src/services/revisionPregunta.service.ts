import { RevisionPregunta } from '@models/revisionPregunta.model';
import { Pregunta } from '@models/pregunta.model';
import { EstadoPregunta } from '@models/estadoPregunta.model';
import { UsuarioPrivilegio } from '@models/usuarioPrivilegio.model';
import { IRevisionPregunta } from '../types/models.types';
import { Types } from 'mongoose';

const VOTOS_NEGATIVOS_THRESHOLD = 2; // Número de votos negativos para rechazar

export const revisionPreguntaService = {
  async getAll(): Promise<IRevisionPregunta[]> {
    return await RevisionPregunta.find()
      .populate('id_pregunta', 'titulo_pregunta tipo_pregunta')
      .populate('id_revisor', 'correo_electronico nombre')
      .sort({ fecha_revision: -1 });
  },

  async getById(id: string): Promise<IRevisionPregunta | null> {
    return await RevisionPregunta.findById(id)
      .populate('id_pregunta', 'titulo_pregunta tipo_pregunta')
      .populate('id_revisor', 'correo_electronico nombre');
  },

  async getByPreguntaId(idPregunta: string): Promise<IRevisionPregunta[]> {
    return await RevisionPregunta.find({ id_pregunta: idPregunta })
      .populate('id_revisor', 'correo_electronico nombre')
      .sort({ fecha_revision: -1 });
  },

  async getByRevisorId(idRevisor: string): Promise<IRevisionPregunta[]> {
    return await RevisionPregunta.find({ id_revisor: idRevisor })
      .populate('id_pregunta', 'titulo_pregunta tipo_pregunta')
      .sort({ fecha_revision: -1 });
  },

  async getPreguntasPendientes(): Promise<unknown[]> {
    // Buscar estado "revision"
    const estadoRevision = await EstadoPregunta.findOne({
      nombre_estado: 'revision',
    });

    if (!estadoRevision) {
      return [];
    }

    const preguntas = await Pregunta.find({
      id_estado: estadoRevision._id,
      activa: true,
    })
      .populate('id_subcategoria', 'nombre_subcategoria')
      .populate('id_rango_edad', 'nombre_rango')
      .populate('id_dificultad', 'nivel')
      .populate('creado_por', 'correo_electronico nombre')
      .sort({ fecha_creacion: -1 });

    // Para cada pregunta, obtener el conteo de revisiones
    const preguntasConRevisiones = await Promise.all(
      preguntas.map(async (pregunta) => {
        const revisiones = await RevisionPregunta.find({
          id_pregunta: pregunta._id,
        });
        return {
          ...pregunta.toObject(),
          revisiones_actuales: revisiones.length,
          revisiones_requeridas: pregunta.votos_requeridos,
        };
      })
    );

    return preguntasConRevisiones;
  },

  async getEstadisticasRevisor(idRevisor: string): Promise<unknown> {
    const revisiones = await RevisionPregunta.find({ id_revisor: idRevisor });

    const votosPositivos = revisiones.filter(
      (r) => r.voto === 'positivo'
    ).length;
    const votosNegativos = revisiones.filter(
      (r) => r.voto === 'negativo'
    ).length;

    return {
      total_revisiones: revisiones.length,
      votos_positivos: votosPositivos,
      votos_negativos: votosNegativos,
      tasa_aprobacion:
        revisiones.length > 0
          ? ((votosPositivos / revisiones.length) * 100).toFixed(2) + '%'
          : '0%',
    };
  },

  async create(data: {
    id_pregunta: string;
    id_revisor: string;
    voto: 'positivo' | 'negativo';
    comentario?: string;
  }): Promise<IRevisionPregunta> {
    // Validar que la pregunta existe
    const pregunta = await Pregunta.findById(data.id_pregunta);
    if (!pregunta) {
      throw new Error('La pregunta especificada no existe');
    }

    // Validar que el revisor tiene el privilegio de revisor
    const tienePrivilegio = await UsuarioPrivilegio.findOne({
      id_usuario: data.id_revisor,
    }).populate('id_privilegio', 'nombre_privilegio');

    if (!tienePrivilegio) {
      throw new Error('El usuario no tiene privilegios de revisor');
    }

    // Validar que la pregunta está en estado "revision"
    const estado = await EstadoPregunta.findById(pregunta.id_estado);
    if (estado?.nombre_estado !== 'revision') {
      throw new Error(
        'Solo se pueden revisar preguntas en estado "revision". Estado actual: ' +
          estado?.nombre_estado
      );
    }

    // Validar que el revisor no es el creador de la pregunta
    if (pregunta.creado_por?.toString() === data.id_revisor) {
      throw new Error('No puedes revisar tus propias preguntas');
    }

    // Validar que el revisor no ha votado antes esta pregunta
    const yaVoto = await RevisionPregunta.findOne({
      id_pregunta: data.id_pregunta,
      id_revisor: data.id_revisor,
    });

    if (yaVoto) {
      throw new Error('Ya has votado esta pregunta anteriormente');
    }

    // Crear la revisión
    const nuevaRevision = new RevisionPregunta({
      id_pregunta: new Types.ObjectId(data.id_pregunta),
      id_revisor: new Types.ObjectId(data.id_revisor),
      voto: data.voto,
      comentario: data.comentario,
      fecha_revision: new Date(),
    });

    await nuevaRevision.save();

    // Actualizar contadores en la pregunta
    if (data.voto === 'positivo') {
      pregunta.votos_positivos += 1;
    } else {
      pregunta.votos_negativos += 1;
    }

    // Verificar si se alcanzó el threshold para publicar
    if (pregunta.votos_positivos >= pregunta.votos_requeridos) {
      const estadoPublicada = await EstadoPregunta.findOne({
        nombre_estado: 'publicada',
      });
      if (estadoPublicada) {
        pregunta.id_estado = estadoPublicada._id as Types.ObjectId;
        pregunta.fecha_publicacion = new Date();
      }
    }

    // Verificar si se alcanzó el threshold para rechazar
    if (pregunta.votos_negativos >= VOTOS_NEGATIVOS_THRESHOLD) {
      const estadoRechazada = await EstadoPregunta.findOne({
        nombre_estado: 'rechazada',
      });
      if (estadoRechazada) {
        pregunta.id_estado = estadoRechazada._id as Types.ObjectId;
      }
    }

    await pregunta.save();

    return nuevaRevision;
  },

  async update(
    id: string,
    data: {
      comentario?: string;
    }
  ): Promise<IRevisionPregunta | null> {
    const revisionExistente = await RevisionPregunta.findById(id);
    if (!revisionExistente) {
      throw new Error('La revisión no existe');
    }

    // Validar que la pregunta no está publicada
    const pregunta = await Pregunta.findById(revisionExistente.id_pregunta);
    if (!pregunta) {
      throw new Error('La pregunta asociada no existe');
    }

    const estado = await EstadoPregunta.findById(pregunta.id_estado);
    if (estado?.nombre_estado === 'publicada') {
      throw new Error(
        'No se pueden modificar revisiones de preguntas publicadas'
      );
    }

    // Solo se puede actualizar el comentario, no el voto
    return await RevisionPregunta.findByIdAndUpdate(
      id,
      {
        ...(data.comentario !== undefined && { comentario: data.comentario }),
      },
      { new: true, runValidators: true }
    );
  },

  async delete(id: string): Promise<IRevisionPregunta | null> {
    const revisionExistente = await RevisionPregunta.findById(id);
    if (!revisionExistente) {
      throw new Error('La revisión no existe');
    }

    // Validar que la pregunta no está publicada
    const pregunta = await Pregunta.findById(revisionExistente.id_pregunta);
    if (!pregunta) {
      throw new Error('La pregunta asociada no existe');
    }

    const estado = await EstadoPregunta.findById(pregunta.id_estado);
    if (estado?.nombre_estado === 'publicada') {
      throw new Error(
        'No se pueden eliminar revisiones de preguntas publicadas'
      );
    }

    // Actualizar contadores en la pregunta
    if (revisionExistente.voto === 'positivo') {
      pregunta.votos_positivos = Math.max(0, pregunta.votos_positivos - 1);
    } else {
      pregunta.votos_negativos = Math.max(0, pregunta.votos_negativos - 1);
    }

    await pregunta.save();

    return await RevisionPregunta.findByIdAndDelete(id);
  },

  async cambiarEstadoPregunta(
    idPregunta: string,
    nuevoEstado: string
  ): Promise<unknown> {
    const pregunta = await Pregunta.findById(idPregunta);
    if (!pregunta) {
      throw new Error('La pregunta no existe');
    }

    const estado = await EstadoPregunta.findOne({
      nombre_estado: nuevoEstado,
    });
    if (!estado) {
      throw new Error('El estado especificado no existe');
    }

    pregunta.id_estado = estado._id as Types.ObjectId;

    if (nuevoEstado === 'publicada') {
      pregunta.fecha_publicacion = new Date();
    }

    await pregunta.save();

    return pregunta;
  },
};
