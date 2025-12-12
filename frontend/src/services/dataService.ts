import apiClient from './api';
import type { Categoria, Pregunta, Examen, Ciclo, Contenido, UsuarioAdmin, ApiResponse } from '../types';

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

