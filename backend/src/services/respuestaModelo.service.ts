import { RespuestaModelo } from '@models/respuestaModelo.model';
import { Pregunta } from '@models/pregunta.model';
import { EstadoPregunta } from '@models/estadoPregunta.model';
import { IRespuestaModelo } from '../types/models.types';
import { Types } from 'mongoose';

export const respuestaModeloService = {
  async getAll(): Promise<IRespuestaModelo[]> {
    return await RespuestaModelo.find()
      .populate('id_pregunta', 'titulo_pregunta tipo_pregunta')
      .sort({ fecha_creacion: -1 });
  },

  async getById(id: string): Promise<IRespuestaModelo | null> {
    return await RespuestaModelo.findById(id).populate(
      'id_pregunta',
      'titulo_pregunta tipo_pregunta'
    );
  },

  async getByPreguntaId(idPregunta: string): Promise<IRespuestaModelo | null> {
    return await RespuestaModelo.findOne({ id_pregunta: idPregunta }).populate(
      'id_pregunta',
      'titulo_pregunta tipo_pregunta'
    );
  },

  async create(data: {
    id_pregunta: string;
    respuesta_texto?: string;
    palabras_clave?: string;
  }): Promise<IRespuestaModelo> {
    // Validar que la pregunta existe
    const pregunta = await Pregunta.findById(data.id_pregunta);
    if (!pregunta) {
      throw new Error('La pregunta especificada no existe');
    }

    // Validar que el tipo de pregunta es desarrollo o respuesta_corta
    if (
      pregunta.tipo_pregunta !== 'desarrollo' &&
      pregunta.tipo_pregunta !== 'respuesta_corta'
    ) {
      throw new Error(
        'Solo las preguntas de tipo desarrollo o respuesta_corta pueden tener respuestas modelo'
      );
    }

    // Validar que la pregunta no está publicada
    const estado = await EstadoPregunta.findById(pregunta.id_estado);
    if (estado?.nombre_estado === 'publicada') {
      throw new Error(
        'No se pueden agregar respuestas modelo a una pregunta publicada'
      );
    }

    // Validar que hay al menos respuesta_texto o palabras_clave
    if (!data.respuesta_texto && !data.palabras_clave) {
      throw new Error(
        'Debe proporcionar respuesta_texto o palabras_clave (o ambos)'
      );
    }

    // Validar que no exista ya una respuesta modelo para esta pregunta
    const respuestaExistente = await RespuestaModelo.findOne({
      id_pregunta: data.id_pregunta,
    });
    if (respuestaExistente) {
      throw new Error(
        'Ya existe una respuesta modelo para esta pregunta. Solo se permite una respuesta modelo por pregunta'
      );
    }

    const nuevaRespuestaModelo = new RespuestaModelo({
      id_pregunta: new Types.ObjectId(data.id_pregunta),
      respuesta_texto: data.respuesta_texto,
      palabras_clave: data.palabras_clave,
      fecha_creacion: new Date(),
    });

    return await nuevaRespuestaModelo.save();
  },

  async update(
    id: string,
    data: {
      id_pregunta?: string;
      respuesta_texto?: string;
      palabras_clave?: string;
    }
  ): Promise<IRespuestaModelo | null> {
    const respuestaExistente = await RespuestaModelo.findById(id);
    if (!respuestaExistente) {
      throw new Error('La respuesta modelo no existe');
    }

    // Validar que la pregunta no está publicada
    const pregunta = await Pregunta.findById(respuestaExistente.id_pregunta);
    if (!pregunta) {
      throw new Error('La pregunta asociada no existe');
    }

    const estado = await EstadoPregunta.findById(pregunta.id_estado);
    if (estado?.nombre_estado === 'publicada') {
      throw new Error(
        'No se pueden modificar respuestas modelo de una pregunta publicada'
      );
    }

    // Si se intenta cambiar la pregunta, validar que no exista ya una respuesta modelo para la nueva pregunta
    if (
      data.id_pregunta &&
      data.id_pregunta !== respuestaExistente.id_pregunta.toString()
    ) {
      const respuestaEnNuevaPregunta = await RespuestaModelo.findOne({
        id_pregunta: data.id_pregunta,
        _id: { $ne: id },
      });
      if (respuestaEnNuevaPregunta) {
        throw new Error(
          'Ya existe una respuesta modelo para la nueva pregunta especificada'
        );
      }

      // Validar que la nueva pregunta es de tipo desarrollo o respuesta_corta
      const nuevaPregunta = await Pregunta.findById(data.id_pregunta);
      if (!nuevaPregunta) {
        throw new Error('La nueva pregunta especificada no existe');
      }

      if (
        nuevaPregunta.tipo_pregunta !== 'desarrollo' &&
        nuevaPregunta.tipo_pregunta !== 'respuesta_corta'
      ) {
        throw new Error(
          'Solo las preguntas de tipo desarrollo o respuesta_corta pueden tener respuestas modelo'
        );
      }
    }

    return await RespuestaModelo.findByIdAndUpdate(
      id,
      {
        ...(data.id_pregunta && {
          id_pregunta: new Types.ObjectId(data.id_pregunta),
        }),
        ...(data.respuesta_texto !== undefined && {
          respuesta_texto: data.respuesta_texto,
        }),
        ...(data.palabras_clave !== undefined && {
          palabras_clave: data.palabras_clave,
        }),
      },
      { new: true, runValidators: true }
    );
  },

  async delete(id: string): Promise<IRespuestaModelo | null> {
    const respuestaExistente = await RespuestaModelo.findById(id);
    if (!respuestaExistente) {
      throw new Error('La respuesta modelo no existe');
    }

    // Validar que la pregunta no está publicada
    const pregunta = await Pregunta.findById(respuestaExistente.id_pregunta);
    if (!pregunta) {
      throw new Error('La pregunta asociada no existe');
    }

    const estado = await EstadoPregunta.findById(pregunta.id_estado);
    if (estado?.nombre_estado === 'publicada') {
      throw new Error(
        'No se pueden eliminar respuestas modelo de una pregunta publicada'
      );
    }

    return await RespuestaModelo.findByIdAndDelete(id);
  },
};
