import { Document, Types } from 'mongoose';

export interface IUsuario extends Document {
  correo_electronico: string;
  password: string;
  nombre?: string;
  fecha_registro: Date;
  creado_por?: Types.ObjectId;
  activo: boolean;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IPrivilegio extends Document {
  nombre_privilegio: string;
  descripcion?: string;
  fecha_creacion: Date;
  activo: boolean;
}

export interface IUsuarioPrivilegio extends Document {
  id_usuario: Types.ObjectId;
  id_privilegio: Types.ObjectId;
  asignado_por?: Types.ObjectId;
  fecha_asignacion: Date;
  activo: boolean;
}

export interface ICategoria extends Document {
  nombre_categoria: string;
  fecha_creacion: Date;
  activo: boolean;
}

export interface ISubcategoria extends Document {
  id_categoria: Types.ObjectId;
  nombre_subcategoria: string;
  descripcion?: string;
  fecha_creacion: Date;
  activo: boolean;
}

export interface IRangoEdad extends Document {
  nombre_rango: string;
  edad_minima: number;
  edad_maxima: number;
  activo: boolean;
}

export interface INivelDificultad extends Document {
  nivel: 'facil' | 'medio' | 'dificil';
  descripcion?: string;
  activo: boolean;
}

export interface IEstadoPregunta extends Document {
  nombre_estado:
    | 'borrador'
    | 'revision'
    | 'publicada'
    | 'rechazada'
    | 'archivada';
  descripcion?: string;
  orden: number;
}

export interface IContenido extends Document {
  tipo_contenido: 'texto' | 'imagen' | 'audio' | 'video' | 'documento' | 'otro';
  url_contenido: string;
  nombre_archivo?: string;
  tamanio_bytes?: number;
  mime_type?: string;
  fecha_subida: Date;
  subido_por?: Types.ObjectId;
}

export interface IPregunta extends Document {
  id_subcategoria: Types.ObjectId;
  id_rango_edad: Types.ObjectId;
  id_dificultad: Types.ObjectId;
  id_estado: Types.ObjectId;
  tipo_pregunta:
    | 'seleccion_multiple'
    | 'verdadero_falso'
    | 'desarrollo'
    | 'respuesta_corta'
    | 'emparejamiento';
  titulo_pregunta: string;
  id_contenido_pregunta?: Types.ObjectId;
  puntos_recomendados: number;
  tiempo_estimado?: number;
  explicacion?: string;
  fecha_creacion: Date;
  fecha_modificacion: Date;
  creado_por: Types.ObjectId;
  votos_requeridos: number;
  votos_positivos: number;
  votos_negativos: number;
  fecha_publicacion: Date;
  activa: boolean;
}

export interface IOpcionPregunta extends Document {
  id_pregunta: Types.ObjectId;
  texto_opcion?: string;
  id_contenido_opcion?: Types.ObjectId;
  es_correcta: boolean;
  orden: number;
  fecha_creacion: Date;
}

export interface IParEmparejamiento extends Document {
  id_pregunta: Types.ObjectId;
  texto_pregunta?: string;
  id_contenido_pregunta?: Types.ObjectId;
  texto_respuesta?: string;
  id_contenido_respuesta?: Types.ObjectId;
  orden: number;
  fecha_creacion: Date;
}

export interface IRespuestaModelo extends Document {
  id_pregunta: Types.ObjectId;
  respuesta_texto?: string;
  palabras_clave?: string;
  fecha_creacion: Date;
}

export interface IRevisionPregunta extends Document {
  id_pregunta: Types.ObjectId;
  id_revisor: Types.ObjectId;
  voto: 'positivo' | 'negativo';
  comentario?: string;
  fecha_revision: Date;
}

export interface ICiclo extends Document {
  nombre_ciclo: string;
  descripcion?: string;
  fecha_inicio: Date;
  fecha_fin: Date;
  activo: boolean;
  fecha_creacion: Date;
  creado_por?: Types.ObjectId;
}

export interface IExamen extends Document {
  titulo: string;
  descripcion?: string;
  id_ciclo: Types.ObjectId;
  fecha_inicio: Date;
  fecha_fin: Date;
  duracion_minutos?: number;
  intentos_permitidos: number;
  calificacion_minima?: number;
  mostrar_resultados: boolean;
  aleatorizar_preguntas: boolean;
  aleatorizar_opciones: boolean;
  activo: boolean;
  fecha_creacion: Date;
  creado_por: Types.ObjectId;
}

export interface IExamenPregunta extends Document {
  id_examen: Types.ObjectId;
  id_pregunta: Types.ObjectId;
  orden_definido?: number;
  puntos_asignados?: number;
  usar_puntos_recomendados: boolean;
  obligatoria: boolean;
  fecha_agregada: Date;
  agregada_por?: Types.ObjectId;
}

export interface IIntentoExamen extends Document {
  id_examen: Types.ObjectId;
  id_usuario: Types.ObjectId;
  numero_intento: number;
  fecha_inicio: Date;
  fecha_finalizacion?: Date;
  calificacion?: number;
  puntos_obtenidos?: number;
  puntos_totales?: number;
  requiere_revision_manual: boolean;
  completado: boolean;
}

export interface IRespuestaSeleccion extends Document {
  id_intento: Types.ObjectId;
  id_examen_pregunta: Types.ObjectId;
  id_opcion_seleccionada: Types.ObjectId;
  es_correcta?: boolean;
  puntos_obtenidos?: number;
  fecha_respuesta: Date;
}

export interface IRespuestaDesarrollo extends Document {
  id_intento: Types.ObjectId;
  id_examen_pregunta: Types.ObjectId;
  respuesta_texto: string;
  puntos_obtenidos?: number;
  fecha_respuesta: Date;
  calificada: boolean;
  calificada_por?: Types.ObjectId;
  fecha_calificacion?: Date;
  comentario_calificador?: string;
}

export interface IRespuestaEmparejamiento extends Document {
  id_intento: Types.ObjectId;
  id_examen_pregunta: Types.ObjectId;
  id_par: Types.ObjectId;
  es_correcto?: boolean;
  fecha_respuesta: Date;
}
