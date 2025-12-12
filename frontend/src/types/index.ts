// User types
export interface User {
  _id: string;
  nombre?: string;
  apellido_paterno?: string;
  apellido_materno?: string;
  correo_electronico: string;
  fecha_nacimiento?: string;
  genero?: 'masculino' | 'femenino' | 'otro' | 'prefiero_no_decir';
  id_rango_edad?: string;
  activo?: boolean;
  privilegios?: UserPrivilege[];
}

export interface UserPrivilege {
  _id: string;
  id_privilegio: Privilege;
  activo: boolean;
}

export interface Privilege {
  _id: string;
  nombre_privilegio: string;
  nombre?: string;
  descripcion?: string;
  nivel_acceso?: number;
}

// Auth types
export interface LoginCredentials {
  correo_electronico: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    token: string;
    usuario: User;
  };
  message: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

// Categoria types
export interface Categoria {
  _id: string;
  nombre_categoria: string;
  fecha_creacion?: string;
  activo: boolean;
  subcategorias?: Subcategoria[];
}

// Subcategoria types
export interface Subcategoria {
  _id: string;
  id_categoria: string;
  nombre_subcategoria: string;
  descripcion?: string;
  fecha_creacion?: string;
  activo: boolean;
}

// Pregunta types
export interface Pregunta {
  _id: string;
  id_subcategoria: string;
  id_rango_edad: string;
  id_dificultad: string;
  id_estado: string;
  tipo_pregunta: 'seleccion_multiple' | 'verdadero_falso' | 'desarrollo' | 'respuesta_corta' | 'emparejamiento';
  titulo_pregunta: string;
  id_contenido_pregunta?: string;
  puntos_recomendados: number;
  tiempo_estimado?: number;
  activo: boolean;
}

// Examen types
export interface Examen {
  _id: string;
  titulo: string;
  descripcion?: string;
  id_ciclo: string | Ciclo;
  fecha_inicio: string;
  fecha_fin: string;
  duracion_minutos?: number;
  intentos_permitidos: number;
  calificacion_minima?: number;
  mostrar_resultados: boolean;
  aleatorizar_preguntas: boolean;
  aleatorizar_opciones: boolean;
  activo: boolean;
  fecha_creacion?: string;
  creado_por?: string;
}

// Ciclo types
export interface Ciclo {
  _id: string;
  nombre_ciclo: string;
  descripcion?: string;
  fecha_inicio: string;
  fecha_fin: string;
  activo: boolean;
  fecha_creacion?: string;
  creado_por?: string;
}

// Contenido types
export interface Contenido {
  _id: string;
  tipo_contenido: 'texto' | 'imagen' | 'audio' | 'video' | 'documento' | 'otro';
  url_contenido?: string;
  nombre_archivo?: string;
  tamanio_bytes?: number;
  mime_type?: string;
  fecha_subida?: string;
  activo: boolean;
}

// Usuario types (para admin)
export interface UsuarioAdmin {
  _id: string;
  correo_electronico: string;
  nombre?: string;
  apellido_paterno?: string;
  apellido_materno?: string;
  fecha_nacimiento?: string;
  genero?: 'masculino' | 'femenino' | 'otro' | 'prefiero_no_decir';
  fecha_registro: string;
  activo: boolean;
  privilegios?: UserPrivilege[];
}

// Dashboard Card types
export interface DashboardCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  route: string;
  color: string;
  requiredPrivilege?: string;
}
