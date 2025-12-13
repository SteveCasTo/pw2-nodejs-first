import { OpcionPregunta } from '@models/opcionPregunta.model';
import { Pregunta } from '@models/pregunta.model';
import { Contenido } from '@models/contenido.model';
import { EstadoPregunta } from '@models/estadoPregunta.model';
import { IOpcionPregunta } from '../types/models.types';
import { Types } from 'mongoose';

export const opcionPreguntaService = {
  async getAll(): Promise<IOpcionPregunta[]> {
    return await OpcionPregunta.find()
      .populate('id_pregunta', 'titulo_pregunta tipo_pregunta')
      .populate(
        'id_contenido_opcion',
        'tipo_contenido url_contenido nombre_archivo'
      )
      .sort({ id_pregunta: 1, orden: 1 });
  },

  async getById(id: string): Promise<IOpcionPregunta | null> {
    return await OpcionPregunta.findById(id)
      .populate('id_pregunta', 'titulo_pregunta tipo_pregunta')
      .populate(
        'id_contenido_opcion',
        'tipo_contenido url_contenido nombre_archivo'
      );
  },

  async getByPreguntaId(idPregunta: string): Promise<IOpcionPregunta[]> {
    return await OpcionPregunta.find({ id_pregunta: idPregunta })
      .populate(
        'id_contenido_opcion',
        'tipo_contenido url_contenido nombre_archivo'
      )
      .sort({ orden: 1 });
  },

  async create(data: {
    id_pregunta: string;
    texto_opcion?: string;
    id_contenido_opcion?: string;
    es_correcta?: boolean;
    orden: number;
  }): Promise<IOpcionPregunta> {
    // Validar que la pregunta existe
    const pregunta = await Pregunta.findById(data.id_pregunta);
    if (!pregunta) {
      throw new Error('La pregunta especificada no existe');
    }

    // Validar que el tipo de pregunta permite opciones
    if (
      pregunta.tipo_pregunta !== 'seleccion_multiple' &&
      pregunta.tipo_pregunta !== 'verdadero_falso'
    ) {
      throw new Error(
        'Solo las preguntas de tipo seleccion_multiple o verdadero_falso pueden tener opciones'
      );
    }

    // Validar que la pregunta no está publicada (no se puede modificar)
    const estado = await EstadoPregunta.findById(pregunta.id_estado);
    if (estado?.nombre_estado === 'publicada') {
      throw new Error('No se pueden agregar opciones a una pregunta publicada');
    }

    // Validar que hay texto O contenido
    if (!data.texto_opcion && !data.id_contenido_opcion) {
      throw new Error('Debe proporcionar texto_opcion o id_contenido_opcion');
    }

    // Si hay contenido, validar que existe
    if (data.id_contenido_opcion) {
      const contenidoExiste = await Contenido.findById(
        data.id_contenido_opcion
      );
      if (!contenidoExiste) {
        throw new Error('El contenido especificado no existe');
      }
    }

    // Validar reglas para verdadero_falso
    if (pregunta.tipo_pregunta === 'verdadero_falso') {
      const opcionesExistentes = await OpcionPregunta.countDocuments({
        id_pregunta: data.id_pregunta,
      });

      if (opcionesExistentes >= 2) {
        throw new Error(
          'Las preguntas de verdadero_falso solo pueden tener 2 opciones'
        );
      }

      // Si ya existe una opción correcta, esta nueva no puede ser correcta
      if (data.es_correcta) {
        const yaHayCorrecta = await OpcionPregunta.findOne({
          id_pregunta: data.id_pregunta,
          es_correcta: true,
        });
        if (yaHayCorrecta) {
          throw new Error(
            'Las preguntas de verdadero_falso solo pueden tener 1 opción correcta'
          );
        }
      }
    }

    // Validar que el orden no esté duplicado para esta pregunta
    const ordenDuplicado = await OpcionPregunta.findOne({
      id_pregunta: data.id_pregunta,
      orden: data.orden,
    });
    if (ordenDuplicado) {
      throw new Error(
        `Ya existe una opción con orden ${data.orden} para esta pregunta`
      );
    }

    const nuevaOpcion = new OpcionPregunta({
      id_pregunta: new Types.ObjectId(data.id_pregunta),
      texto_opcion: data.texto_opcion,
      id_contenido_opcion: data.id_contenido_opcion
        ? new Types.ObjectId(data.id_contenido_opcion)
        : undefined,
      es_correcta: data.es_correcta ?? false,
      orden: data.orden,
      fecha_creacion: new Date(),
    });

    return await nuevaOpcion.save();
  },

  async update(
    id: string,
    data: {
      id_pregunta?: string;
      texto_opcion?: string;
      id_contenido_opcion?: string;
      es_correcta?: boolean;
      orden?: number;
    }
  ): Promise<IOpcionPregunta | null> {
    const opcionExistente = await OpcionPregunta.findById(id);
    if (!opcionExistente) {
      throw new Error('La opción no existe');
    }

    // Validar que la pregunta no está publicada
    const pregunta = await Pregunta.findById(opcionExistente.id_pregunta);
    if (!pregunta) {
      throw new Error('La pregunta asociada no existe');
    }

    const estado = await EstadoPregunta.findById(pregunta.id_estado);
    if (estado?.nombre_estado === 'publicada') {
      throw new Error(
        'No se pueden modificar opciones de una pregunta publicada'
      );
    }

    // Si se intenta marcar como correcta en pregunta verdadero_falso
    if (data.es_correcta && pregunta.tipo_pregunta === 'verdadero_falso') {
      const yaHayCorrecta = await OpcionPregunta.findOne({
        id_pregunta: opcionExistente.id_pregunta,
        es_correcta: true,
        _id: { $ne: id },
      });
      if (yaHayCorrecta) {
        throw new Error(
          'Las preguntas de verdadero_falso solo pueden tener 1 opción correcta'
        );
      }
    }

    // Si se cambia el orden, validar que no esté duplicado
    if (data.orden && data.orden !== opcionExistente.orden) {
      const ordenDuplicado = await OpcionPregunta.findOne({
        id_pregunta: opcionExistente.id_pregunta,
        orden: data.orden,
        _id: { $ne: id },
      });
      if (ordenDuplicado) {
        throw new Error(
          `Ya existe una opción con orden ${data.orden} para esta pregunta`
        );
      }
    }

    // Si hay contenido nuevo, validar que existe
    if (data.id_contenido_opcion) {
      const contenidoExiste = await Contenido.findById(
        data.id_contenido_opcion
      );
      if (!contenidoExiste) {
        throw new Error('El contenido especificado no existe');
      }
    }

    return await OpcionPregunta.findByIdAndUpdate(
      id,
      {
        ...(data.id_pregunta && {
          id_pregunta: new Types.ObjectId(data.id_pregunta),
        }),
        ...(data.texto_opcion !== undefined && {
          texto_opcion: data.texto_opcion,
        }),
        ...(data.id_contenido_opcion && {
          id_contenido_opcion: new Types.ObjectId(data.id_contenido_opcion),
        }),
        ...(data.es_correcta !== undefined && {
          es_correcta: data.es_correcta,
        }),
        ...(data.orden !== undefined && { orden: data.orden }),
      },
      { new: true, runValidators: true }
    );
  },

  async delete(id: string): Promise<IOpcionPregunta | null> {
    const opcionExistente = await OpcionPregunta.findById(id);
    if (!opcionExistente) {
      throw new Error('La opción no existe');
    }

    // Validar que la pregunta no está publicada
    const pregunta = await Pregunta.findById(opcionExistente.id_pregunta);
    if (!pregunta) {
      throw new Error('La pregunta asociada no existe');
    }

    const estado = await EstadoPregunta.findById(pregunta.id_estado);
    if (estado?.nombre_estado === 'publicada') {
      throw new Error(
        'No se pueden eliminar opciones de una pregunta publicada'
      );
    }

    // Validar que al eliminar, quedan suficientes opciones
    const opcionesRestantes = await OpcionPregunta.countDocuments({
      id_pregunta: opcionExistente.id_pregunta,
      _id: { $ne: id },
    });

    if (pregunta.tipo_pregunta === 'verdadero_falso' && opcionesRestantes < 1) {
      throw new Error(
        'No se puede eliminar esta opción. Las preguntas de verdadero_falso deben tener al menos 2 opciones'
      );
    }

    if (
      pregunta.tipo_pregunta === 'seleccion_multiple' &&
      opcionesRestantes < 1
    ) {
      throw new Error(
        'No se puede eliminar esta opción. Las preguntas de selección múltiple deben tener al menos 2 opciones'
      );
    }

    // Validar que al eliminar, queda al menos 1 opción correcta
    if (opcionExistente.es_correcta) {
      const hayOtraCorrecta = await OpcionPregunta.findOne({
        id_pregunta: opcionExistente.id_pregunta,
        es_correcta: true,
        _id: { $ne: id },
      });

      if (!hayOtraCorrecta) {
        throw new Error(
          'No se puede eliminar esta opción. Debe haber al menos 1 opción correcta por pregunta'
        );
      }
    }

    return await OpcionPregunta.findByIdAndDelete(id);
  },
};
