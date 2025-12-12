import apiClient from './api';
import type { 
  Categoria, 
  Subcategoria, 
  Pregunta, 
  Examen, 
  Ciclo, 
  Contenido, 
  UsuarioAdmin, 
  ApiResponse,
  NivelDificultad,
  RangoEdad,
  EstadoPregunta,
  OpcionPregunta,
  ParEmparejamiento,
  RespuestaModelo,
  ExamenPregunta,
  IntentoExamen,
  RespuestaSeleccion,
  RespuestaDesarrollo,
  RespuestaEmparejamiento
} from '../types';

export const categoriaService = {
  getAll: async (): Promise<ApiResponse<Categoria[]>> => {
    const response = await apiClient.get('/api/categorias');
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Categoria>> => {
    const response = await apiClient.get(`/api/categorias/${id}`);
    return response.data;
  },

  create: async (data: Partial<Categoria>): Promise<ApiResponse<Categoria>> => {
    const response = await apiClient.post('/api/categorias', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Categoria>): Promise<ApiResponse<Categoria>> => {
    const response = await apiClient.put(`/api/categorias/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/api/categorias/${id}`);
    return response.data;
  },
};

export const subcategoriaService = {
  getAll: async (): Promise<ApiResponse<Subcategoria[]>> => {
    const response = await apiClient.get('/api/subcategorias');
    return response.data;
  },

  getByCategoria: async (categoriaId: string): Promise<ApiResponse<Subcategoria[]>> => {
    const response = await apiClient.get(`/api/subcategorias/categoria/${categoriaId}`);
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Subcategoria>> => {
    const response = await apiClient.get(`/api/subcategorias/${id}`);
    return response.data;
  },

  create: async (data: Partial<Subcategoria>): Promise<ApiResponse<Subcategoria>> => {
    const response = await apiClient.post('/api/subcategorias', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Subcategoria>): Promise<ApiResponse<Subcategoria>> => {
    const response = await apiClient.put(`/api/subcategorias/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/api/subcategorias/${id}`);
    return response.data;
  },
};

export const preguntaService = {
  getAll: async (): Promise<ApiResponse<Pregunta[]>> => {
    const response = await apiClient.get('/api/preguntas');
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Pregunta>> => {
    const response = await apiClient.get(`/api/preguntas/${id}`);
    return response.data;
  },

  create: async (data: Partial<Pregunta>): Promise<ApiResponse<Pregunta>> => {
    const response = await apiClient.post('/api/preguntas', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Pregunta>): Promise<ApiResponse<Pregunta>> => {
    const response = await apiClient.put(`/api/preguntas/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/api/preguntas/${id}`);
    return response.data;
  },
};

export const examenService = {
  getAll: async (): Promise<ApiResponse<Examen[]>> => {
    const response = await apiClient.get('/api/examenes');
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Examen>> => {
    const response = await apiClient.get(`/api/examenes/${id}`);
    return response.data;
  },

  create: async (data: Partial<Examen>): Promise<ApiResponse<Examen>> => {
    const response = await apiClient.post('/api/examenes', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Examen>): Promise<ApiResponse<Examen>> => {
    const response = await apiClient.put(`/api/examenes/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/api/examenes/${id}`);
    return response.data;
  },
};

export const usuarioService = {
  getAll: async (): Promise<ApiResponse<UsuarioAdmin[]>> => {
    const response = await apiClient.get('/api/usuarios');
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<UsuarioAdmin>> => {
    const response = await apiClient.get(`/api/usuarios/${id}`);
    return response.data;
  },

  create: async (data: { nombre: string; correo_electronico: string }): Promise<ApiResponse<UsuarioAdmin>> => {
    const response = await apiClient.post('/api/usuarios', data);
    return response.data;
  },

  update: async (id: string, data: Partial<UsuarioAdmin>): Promise<ApiResponse<UsuarioAdmin>> => {
    const response = await apiClient.put(`/api/usuarios/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/api/usuarios/${id}`);
    return response.data;
  },
};

export const cicloService = {
  getAll: async (): Promise<ApiResponse<Ciclo[]>> => {
    const response = await apiClient.get('/api/ciclos');
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Ciclo>> => {
    const response = await apiClient.get(`/api/ciclos/${id}`);
    return response.data;
  },

  create: async (data: Partial<Ciclo>): Promise<ApiResponse<Ciclo>> => {
    const response = await apiClient.post('/api/ciclos', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Ciclo>): Promise<ApiResponse<Ciclo>> => {
    const response = await apiClient.put(`/api/ciclos/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/api/ciclos/${id}`);
    return response.data;
  },
};

export const contenidoService = {
  getAll: async (): Promise<ApiResponse<Contenido[]>> => {
    const response = await apiClient.get('/api/contenidos');
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Contenido>> => {
    const response = await apiClient.get(`/api/contenidos/${id}`);
    return response.data;
  },

  create: async (data: Partial<Contenido>): Promise<ApiResponse<Contenido>> => {
    const response = await apiClient.post('/api/contenidos', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Contenido>): Promise<ApiResponse<Contenido>> => {
    const response = await apiClient.put(`/api/contenidos/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/api/contenidos/${id}`);
    return response.data;
  },
};

// Nuevos servicios para el sistema de exámenes

export const nivelDificultadService = {
  getAll: async (): Promise<ApiResponse<NivelDificultad[]>> => {
    const response = await apiClient.get('/api/niveles-dificultad');
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<NivelDificultad>> => {
    const response = await apiClient.get(`/api/niveles-dificultad/${id}`);
    return response.data;
  },

  create: async (data: Partial<NivelDificultad>): Promise<ApiResponse<NivelDificultad>> => {
    const response = await apiClient.post('/api/niveles-dificultad', data);
    return response.data;
  },

  update: async (id: string, data: Partial<NivelDificultad>): Promise<ApiResponse<NivelDificultad>> => {
    const response = await apiClient.put(`/api/niveles-dificultad/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/api/niveles-dificultad/${id}`);
    return response.data;
  },
};

export const rangoEdadService = {
  getAll: async (): Promise<ApiResponse<RangoEdad[]>> => {
    const response = await apiClient.get('/api/rangos-edad');
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<RangoEdad>> => {
    const response = await apiClient.get(`/api/rangos-edad/${id}`);
    return response.data;
  },

  create: async (data: Partial<RangoEdad>): Promise<ApiResponse<RangoEdad>> => {
    const response = await apiClient.post('/api/rangos-edad', data);
    return response.data;
  },

  update: async (id: string, data: Partial<RangoEdad>): Promise<ApiResponse<RangoEdad>> => {
    const response = await apiClient.put(`/api/rangos-edad/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/api/rangos-edad/${id}`);
    return response.data;
  },
};

export const estadoPreguntaService = {
  getAll: async (): Promise<ApiResponse<EstadoPregunta[]>> => {
    const response = await apiClient.get('/api/estados-pregunta');
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<EstadoPregunta>> => {
    const response = await apiClient.get(`/api/estados-pregunta/${id}`);
    return response.data;
  },

  create: async (data: Partial<EstadoPregunta>): Promise<ApiResponse<EstadoPregunta>> => {
    const response = await apiClient.post('/api/estados-pregunta', data);
    return response.data;
  },

  update: async (id: string, data: Partial<EstadoPregunta>): Promise<ApiResponse<EstadoPregunta>> => {
    const response = await apiClient.put(`/api/estados-pregunta/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/api/estados-pregunta/${id}`);
    return response.data;
  },
};

export const opcionPreguntaService = {
  getAll: async (): Promise<ApiResponse<OpcionPregunta[]>> => {
    const response = await apiClient.get('/api/opciones-pregunta');
    return response.data;
  },

  getByPregunta: async (preguntaId: string): Promise<ApiResponse<OpcionPregunta[]>> => {
    const response = await apiClient.get(`/api/opciones-pregunta/pregunta/${preguntaId}`);
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<OpcionPregunta>> => {
    const response = await apiClient.get(`/api/opciones-pregunta/${id}`);
    return response.data;
  },

  create: async (data: Partial<OpcionPregunta>): Promise<ApiResponse<OpcionPregunta>> => {
    const response = await apiClient.post('/api/opciones-pregunta', data);
    return response.data;
  },

  update: async (id: string, data: Partial<OpcionPregunta>): Promise<ApiResponse<OpcionPregunta>> => {
    const response = await apiClient.put(`/api/opciones-pregunta/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/api/opciones-pregunta/${id}`);
    return response.data;
  },
};

export const parEmparejamientoService = {
  getAll: async (): Promise<ApiResponse<ParEmparejamiento[]>> => {
    const response = await apiClient.get('/api/pares-emparejamiento');
    return response.data;
  },

  getByPregunta: async (preguntaId: string): Promise<ApiResponse<ParEmparejamiento[]>> => {
    const response = await apiClient.get(`/api/pares-emparejamiento/pregunta/${preguntaId}`);
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<ParEmparejamiento>> => {
    const response = await apiClient.get(`/api/pares-emparejamiento/${id}`);
    return response.data;
  },

  create: async (data: Partial<ParEmparejamiento>): Promise<ApiResponse<ParEmparejamiento>> => {
    const response = await apiClient.post('/api/pares-emparejamiento', data);
    return response.data;
  },

  update: async (id: string, data: Partial<ParEmparejamiento>): Promise<ApiResponse<ParEmparejamiento>> => {
    const response = await apiClient.put(`/api/pares-emparejamiento/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/api/pares-emparejamiento/${id}`);
    return response.data;
  },
};

export const respuestaModeloService = {
  getAll: async (): Promise<ApiResponse<RespuestaModelo[]>> => {
    const response = await apiClient.get('/api/respuestas-modelo');
    return response.data;
  },

  getByPregunta: async (preguntaId: string): Promise<ApiResponse<RespuestaModelo[]>> => {
    const response = await apiClient.get(`/api/respuestas-modelo/pregunta/${preguntaId}`);
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<RespuestaModelo>> => {
    const response = await apiClient.get(`/api/respuestas-modelo/${id}`);
    return response.data;
  },

  create: async (data: Partial<RespuestaModelo>): Promise<ApiResponse<RespuestaModelo>> => {
    const response = await apiClient.post('/api/respuestas-modelo', data);
    return response.data;
  },

  update: async (id: string, data: Partial<RespuestaModelo>): Promise<ApiResponse<RespuestaModelo>> => {
    const response = await apiClient.put(`/api/respuestas-modelo/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/api/respuestas-modelo/${id}`);
    return response.data;
  },
};

export const examenPreguntaService = {
  getAll: async (): Promise<ApiResponse<ExamenPregunta[]>> => {
    const response = await apiClient.get('/api/examenes-preguntas');
    return response.data;
  },

  getByExamen: async (examenId: string): Promise<ApiResponse<ExamenPregunta[]>> => {
    const response = await apiClient.get(`/api/examenes-preguntas/examen/${examenId}`);
    return response.data;
  },

  getByPregunta: async (preguntaId: string): Promise<ApiResponse<ExamenPregunta[]>> => {
    const response = await apiClient.get(`/api/examenes-preguntas/pregunta/${preguntaId}`);
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<ExamenPregunta>> => {
    const response = await apiClient.get(`/api/examenes-preguntas/${id}`);
    return response.data;
  },

  create: async (data: Partial<ExamenPregunta>): Promise<ApiResponse<ExamenPregunta>> => {
    const response = await apiClient.post('/api/examenes-preguntas', data);
    return response.data;
  },

  update: async (id: string, data: Partial<ExamenPregunta>): Promise<ApiResponse<ExamenPregunta>> => {
    const response = await apiClient.put(`/api/examenes-preguntas/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/api/examenes-preguntas/${id}`);
    return response.data;
  },

  updateOrden: async (examenId: string, ordenData: Array<{id: string; orden: number}>): Promise<ApiResponse<void>> => {
    const response = await apiClient.patch(`/api/examenes-preguntas/examen/${examenId}/reordenar`, { ordenamiento: ordenData });
    return response.data;
  },
};

export const intentoExamenService = {
  getAll: async (): Promise<ApiResponse<IntentoExamen[]>> => {
    const response = await apiClient.get('/api/intentos-examen');
    return response.data;
  },

  getByExamen: async (examenId: string): Promise<ApiResponse<IntentoExamen[]>> => {
    const response = await apiClient.get(`/api/intentos-examen/examen/${examenId}`);
    return response.data;
  },

  getByUsuario: async (usuarioId: string): Promise<ApiResponse<IntentoExamen[]>> => {
    const response = await apiClient.get(`/api/intentos-examen/usuario/${usuarioId}`);
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<IntentoExamen>> => {
    const response = await apiClient.get(`/api/intentos-examen/${id}`);
    return response.data;
  },

  create: async (data: Partial<IntentoExamen>): Promise<ApiResponse<IntentoExamen>> => {
    const response = await apiClient.post('/api/intentos-examen', data);
    return response.data;
  },

  update: async (id: string, data: Partial<IntentoExamen>): Promise<ApiResponse<IntentoExamen>> => {
    const response = await apiClient.put(`/api/intentos-examen/${id}`, data);
    return response.data;
  },

  finalizar: async (id: string): Promise<ApiResponse<IntentoExamen>> => {
    const response = await apiClient.patch(`/api/intentos-examen/${id}/finalizar`);
    return response.data;
  },
};

export const respuestaSeleccionService = {
  getAll: async (): Promise<ApiResponse<RespuestaSeleccion[]>> => {
    const response = await apiClient.get('/api/respuestas-seleccion');
    return response.data;
  },

  getByIntento: async (intentoId: string): Promise<ApiResponse<RespuestaSeleccion[]>> => {
    const response = await apiClient.get(`/api/respuestas-seleccion/intento/${intentoId}`);
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<RespuestaSeleccion>> => {
    const response = await apiClient.get(`/api/respuestas-seleccion/${id}`);
    return response.data;
  },

  create: async (data: Partial<RespuestaSeleccion>): Promise<ApiResponse<RespuestaSeleccion>> => {
    const response = await apiClient.post('/api/respuestas-seleccion', data);
    return response.data;
  },

  update: async (id: string, data: Partial<RespuestaSeleccion>): Promise<ApiResponse<RespuestaSeleccion>> => {
    const response = await apiClient.put(`/api/respuestas-seleccion/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/api/respuestas-seleccion/${id}`);
    return response.data;
  },
};

export const respuestaDesarrolloService = {
  getAll: async (): Promise<ApiResponse<RespuestaDesarrollo[]>> => {
    const response = await apiClient.get('/api/respuestas-desarrollo');
    return response.data;
  },

  getByIntento: async (intentoId: string): Promise<ApiResponse<RespuestaDesarrollo[]>> => {
    const response = await apiClient.get(`/api/respuestas-desarrollo/intento/${intentoId}`);
    return response.data;
  },

  getPendientesCalificacion: async (): Promise<ApiResponse<RespuestaDesarrollo[]>> => {
    const response = await apiClient.get('/api/respuestas-desarrollo/pendientes');
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<RespuestaDesarrollo>> => {
    const response = await apiClient.get(`/api/respuestas-desarrollo/${id}`);
    return response.data;
  },

  create: async (data: Partial<RespuestaDesarrollo>): Promise<ApiResponse<RespuestaDesarrollo>> => {
    const response = await apiClient.post('/api/respuestas-desarrollo', data);
    return response.data;
  },

  calificar: async (id: string, puntos: number, comentario?: string): Promise<ApiResponse<RespuestaDesarrollo>> => {
    const response = await apiClient.patch(`/api/respuestas-desarrollo/${id}/calificar`, { 
      puntos_obtenidos: puntos,
      comentario_calificador: comentario 
    });
    return response.data;
  },

  update: async (id: string, data: Partial<RespuestaDesarrollo>): Promise<ApiResponse<RespuestaDesarrollo>> => {
    const response = await apiClient.put(`/api/respuestas-desarrollo/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/api/respuestas-desarrollo/${id}`);
    return response.data;
  },
};

export const respuestaEmparejamientoService = {
  getAll: async (): Promise<ApiResponse<RespuestaEmparejamiento[]>> => {
    const response = await apiClient.get('/api/respuestas-emparejamiento');
    return response.data;
  },

  getByIntento: async (intentoId: string): Promise<ApiResponse<RespuestaEmparejamiento[]>> => {
    const response = await apiClient.get(`/api/respuestas-emparejamiento/intento/${intentoId}`);
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<RespuestaEmparejamiento>> => {
    const response = await apiClient.get(`/api/respuestas-emparejamiento/${id}`);
    return response.data;
  },

  create: async (data: Partial<RespuestaEmparejamiento>): Promise<ApiResponse<RespuestaEmparejamiento>> => {
    const response = await apiClient.post('/api/respuestas-emparejamiento', data);
    return response.data;
  },

  update: async (id: string, data: Partial<RespuestaEmparejamiento>): Promise<ApiResponse<RespuestaEmparejamiento>> => {
    const response = await apiClient.put(`/api/respuestas-emparejamiento/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/api/respuestas-emparejamiento/${id}`);
    return response.data;
  },
};

