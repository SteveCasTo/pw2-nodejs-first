import { ParEmparejamiento } from '@models/parEmparejamiento.model';
import { Pregunta } from '@models/pregunta.model';
import { Contenido } from '@models/contenido.model';
import { EstadoPregunta } from '@models/estadoPregunta.model';
import { IParEmparejamiento } from '../types/models.types';
import { Types } from 'mongoose';

export const parEmparejamientoService = {
  async getAll(): Promise<IParEmparejamiento[]> {
    return await ParEmparejamiento.find()
      .populate('id_pregunta', 'titulo_pregunta tipo_pregunta')
      .populate(
        'id_contenido_pregunta',
        'tipo_contenido url_contenido nombre_archivo'
      )
      .populate(
        'id_contenido_respuesta',
        'tipo_contenido url_contenido nombre_archivo'
      )
      .sort({ id_pregunta: 1, orden: 1 });
  },

  async getById(id: string): Promise<IParEmparejamiento | null> {
    return await ParEmparejamiento.findById(id)
      .populate('id_pregunta', 'titulo_pregunta tipo_pregunta')
      .populate(
        'id_contenido_pregunta',
        'tipo_contenido url_contenido nombre_archivo'
      )
      .populate(
        'id_contenido_respuesta',
        'tipo_contenido url_contenido nombre_archivo'
      );
  },

  async getByPreguntaId(idPregunta: string): Promise<IParEmparejamiento[]> {
    return await ParEmparejamiento.find({ id_pregunta: idPregunta })
      .populate(
        'id_contenido_pregunta',
        'tipo_contenido url_contenido nombre_archivo'
      )
      .populate(
        'id_contenido_respuesta',
        'tipo_contenido url_contenido nombre_archivo'
      )
      .sort({ orden: 1 });
  },

  async create(data: {
    id_pregunta: string;
    texto_pregunta?: string;
    id_contenido_pregunta?: string;
    texto_respuesta?: string;
    id_contenido_respuesta?: string;
    orden: number;
  }): Promise<IParEmparejamiento> {
    // Validar que la pregunta existe
    const pregunta = await Pregunta.findById(data.id_pregunta);
    if (!pregunta) {
      throw new Error('La pregunta especificada no existe');
    }

    // Validar que el tipo de pregunta es emparejamiento
    if (pregunta.tipo_pregunta !== 'emparejamiento') {
      throw new Error(
        'Solo las preguntas de tipo emparejamiento pueden tener pares'
      );
    }

    // Validar que la pregunta no está publicada
    const estado = await EstadoPregunta.findById(pregunta.id_estado);
    if (estado?.nombre_estado === 'publicada') {
      throw new Error('No se pueden agregar pares a una pregunta publicada');
    }

    // Validar que hay texto O contenido para pregunta
    if (!data.texto_pregunta && !data.id_contenido_pregunta) {
      throw new Error(
        'Debe proporcionar texto_pregunta o id_contenido_pregunta'
      );
    }

    // Validar que hay texto O contenido para respuesta
    if (!data.texto_respuesta && !data.id_contenido_respuesta) {
      throw new Error(
        'Debe proporcionar texto_respuesta o id_contenido_respuesta'
      );
    }

    // Si hay contenido de pregunta, validar que existe
    if (data.id_contenido_pregunta) {
      const contenidoExiste = await Contenido.findById(
        data.id_contenido_pregunta
      );
      if (!contenidoExiste) {
        throw new Error('El contenido de pregunta especificado no existe');
      }
    }

    // Si hay contenido de respuesta, validar que existe
    if (data.id_contenido_respuesta) {
      const contenidoExiste = await Contenido.findById(
        data.id_contenido_respuesta
      );
      if (!contenidoExiste) {
        throw new Error('El contenido de respuesta especificado no existe');
      }
    }

    // Validar que el orden no esté duplicado para esta pregunta
    const ordenDuplicado = await ParEmparejamiento.findOne({
      id_pregunta: data.id_pregunta,
      orden: data.orden,
    });
    if (ordenDuplicado) {
      throw new Error(
        `Ya existe un par con orden ${data.orden} para esta pregunta`
      );
    }

    const nuevoPar = new ParEmparejamiento({
      id_pregunta: new Types.ObjectId(data.id_pregunta),
      texto_pregunta: data.texto_pregunta,
      id_contenido_pregunta: data.id_contenido_pregunta
        ? new Types.ObjectId(data.id_contenido_pregunta)
        : undefined,
      texto_respuesta: data.texto_respuesta,
      id_contenido_respuesta: data.id_contenido_respuesta
        ? new Types.ObjectId(data.id_contenido_respuesta)
        : undefined,
      orden: data.orden,
      fecha_creacion: new Date(),
    });

    return await nuevoPar.save();
  },

  async update(
    id: string,
    data: {
      id_pregunta?: string;
      texto_pregunta?: string;
      id_contenido_pregunta?: string;
      texto_respuesta?: string;
      id_contenido_respuesta?: string;
      orden?: number;
    }
  ): Promise<IParEmparejamiento | null> {
    const parExistente = await ParEmparejamiento.findById(id);
    if (!parExistente) {
      throw new Error('El par no existe');
    }

    // Validar que la pregunta no está publicada
    const pregunta = await Pregunta.findById(parExistente.id_pregunta);
    if (!pregunta) {
      throw new Error('La pregunta asociada no existe');
    }

    const estado = await EstadoPregunta.findById(pregunta.id_estado);
    if (estado?.nombre_estado === 'publicada') {
      throw new Error('No se pueden modificar pares de una pregunta publicada');
    }

    // Si se cambia el orden, validar que no esté duplicado
    if (data.orden && data.orden !== parExistente.orden) {
      const ordenDuplicado = await ParEmparejamiento.findOne({
        id_pregunta: parExistente.id_pregunta,
        orden: data.orden,
        _id: { $ne: id },
      });
      if (ordenDuplicado) {
        throw new Error(
          `Ya existe un par con orden ${data.orden} para esta pregunta`
        );
      }
    }

    // Si hay contenido de pregunta nuevo, validar que existe
    if (data.id_contenido_pregunta) {
      const contenidoExiste = await Contenido.findById(
        data.id_contenido_pregunta
      );
      if (!contenidoExiste) {
        throw new Error('El contenido de pregunta especificado no existe');
      }
    }

    // Si hay contenido de respuesta nuevo, validar que existe
    if (data.id_contenido_respuesta) {
      const contenidoExiste = await Contenido.findById(
        data.id_contenido_respuesta
      );
      if (!contenidoExiste) {
        throw new Error('El contenido de respuesta especificado no existe');
      }
    }

    return await ParEmparejamiento.findByIdAndUpdate(
      id,
      {
        ...(data.id_pregunta && {
          id_pregunta: new Types.ObjectId(data.id_pregunta),
        }),
        ...(data.texto_pregunta !== undefined && {
          texto_pregunta: data.texto_pregunta,
        }),
        ...(data.id_contenido_pregunta && {
          id_contenido_pregunta: new Types.ObjectId(data.id_contenido_pregunta),
        }),
        ...(data.texto_respuesta !== undefined && {
          texto_respuesta: data.texto_respuesta,
        }),
        ...(data.id_contenido_respuesta && {
          id_contenido_respuesta: new Types.ObjectId(data.id_contenido_respuesta),
        }),
        ...(data.orden !== undefined && { orden: data.orden }),
      },
      { new: true, runValidators: true }
    );
  },

  async delete(id: string): Promise<IParEmparejamiento | null> {
    const parExistente = await ParEmparejamiento.findById(id);
    if (!parExistente) {
      throw new Error('El par no existe');
    }

    // Validar que la pregunta no está publicada
    const pregunta = await Pregunta.findById(parExistente.id_pregunta);
    if (!pregunta) {
      throw new Error('La pregunta asociada no existe');
    }

    const estado = await EstadoPregunta.findById(pregunta.id_estado);
    if (estado?.nombre_estado === 'publicada') {
      throw new Error('No se pueden eliminar pares de una pregunta publicada');
    }

    // Validar que al eliminar, quedan al menos 2 pares
    const paresRestantes = await ParEmparejamiento.countDocuments({
      id_pregunta: parExistente.id_pregunta,
      _id: { $ne: id },
    });

    if (paresRestantes < 1) {
      throw new Error(
        'No se puede eliminar este par. Las preguntas de emparejamiento deben tener al menos 2 pares'
      );
    }

    return await ParEmparejamiento.findByIdAndDelete(id);
  },
};
