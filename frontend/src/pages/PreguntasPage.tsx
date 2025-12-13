import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Pregunta, Subcategoria, NivelDificultad, RangoEdad, EstadoPregunta, OpcionPregunta, ParEmparejamiento, RespuestaModelo } from '../types';
import {
  preguntaService,
  subcategoriaService,
  nivelDificultadService,
  rangoEdadService,
  estadoPreguntaService,
  opcionPreguntaService,
  parEmparejamientoService,
  respuestaModeloService,
} from '../services/dataService';

// Componente para mostrar opciones/pares/respuesta modelo
const OpcionesDetalles = ({ preguntaId, tipoPregunta }: { preguntaId: string; tipoPregunta: string }) => {
  const [opciones, setOpciones] = useState<OpcionPregunta[]>([]);
  const [pares, setPares] = useState<ParEmparejamiento[]>([]);
  const [respuestaModelo, setRespuestaModelo] = useState<RespuestaModelo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetalles = async () => {
      try {
        setLoading(true);
        if (tipoPregunta === 'seleccion_multiple' || tipoPregunta === 'verdadero_falso') {
          const response = await opcionPreguntaService.getByPregunta(preguntaId);
          setOpciones(response.data);
        } else if (tipoPregunta === 'emparejamiento') {
          const response = await parEmparejamientoService.getByPregunta(preguntaId);
          setPares(response.data);
        } else if (tipoPregunta === 'desarrollo' || tipoPregunta === 'respuesta_corta') {
          const response = await respuestaModeloService.getByPregunta(preguntaId);
          if (response.data.length > 0) {
            setRespuestaModelo(response.data[0]);
          }
        }
      } catch (err) {
        console.error('Error al cargar detalles:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetalles();
  }, [preguntaId, tipoPregunta]);

  if (loading) {
    return <div className="text-white/60 text-sm py-2">Cargando detalles...</div>;
  }

  if (tipoPregunta === 'seleccion_multiple' || tipoPregunta === 'verdadero_falso') {
    return (
      <div className="mt-3">
        <div className="text-xs text-purple-300 mb-2 font-semibold">Opciones:</div>
        <div className="space-y-2">
          {opciones.sort((a, b) => (a.orden || 0) - (b.orden || 0)).map((opcion, idx) => (
            <div key={opcion._id} className={`p-2 rounded-lg text-sm flex items-center gap-2 ${opcion.es_correcta ? 'bg-green-500/20 border border-green-400/30' : 'bg-white/5 border border-white/10'}`}>
              <span className="text-white/60">{idx + 1}.</span>
              <span className="text-white flex-1">{opcion.texto_opcion}</span>
              {opcion.es_correcta && (
                <span className="text-green-300 text-xs font-semibold">✓ Correcta</span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (tipoPregunta === 'emparejamiento') {
    return (
      <div className="mt-3">
        <div className="text-xs text-purple-300 mb-2 font-semibold">Pares de Emparejamiento:</div>
        <div className="space-y-2">
          {pares.sort((a, b) => (a.orden || 0) - (b.orden || 0)).map((par, idx) => (
            <div key={par._id} className="p-2 bg-white/5 rounded-lg text-sm border border-white/10 flex items-center gap-3">
              <span className="text-white/60">{idx + 1}.</span>
              <span className="text-white flex-1">{par.texto_pregunta}</span>
              <span className="text-white/60">⟷</span>
              <span className="text-purple-300 flex-1">{par.texto_respuesta}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if ((tipoPregunta === 'desarrollo' || tipoPregunta === 'respuesta_corta') && respuestaModelo) {
    return (
      <div className="mt-3 p-3 bg-purple-500/10 rounded-lg border border-purple-400/20">
        <div className="text-xs text-purple-300 mb-1 font-semibold">Respuesta Modelo:</div>
        <div className="text-white/90 text-sm whitespace-pre-wrap">{respuestaModelo.respuesta_texto}</div>
      </div>
    );
  }

  return null;
};

const PreguntasPage = () => {
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [subcategorias, setSubcategorias] = useState<Subcategoria[]>([]);
  const [nivelesDificultad, setNivelesDificultad] = useState<NivelDificultad[]>([]);
  const [rangosEdad, setRangosEdad] = useState<RangoEdad[]>([]);
  const [estadosPregunta, setEstadosPregunta] = useState<EstadoPregunta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<string>('');
  const [filtroSubcategoria, setFiltroSubcategoria] = useState<string>('');
  const [filtroDificultad, setFiltroDificultad] = useState<string>('');
  const [preguntaExpandida, setPreguntaExpandida] = useState<string | null>(null);
  const [showCrearPregunta, setShowCrearPregunta] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Form data para nueva pregunta
  const [nuevaPregunta, setNuevaPregunta] = useState({
    id_subcategoria: '',
    id_rango_edad: '',
    id_dificultad: '',
    id_estado: '',
    tipo_pregunta: 'seleccion_multiple' as 'seleccion_multiple' | 'verdadero_falso' | 'desarrollo' | 'respuesta_corta' | 'emparejamiento',
    titulo_pregunta: '',
    puntos_recomendados: 1,
    tiempo_estimado: 0,
    explicacion: '',
  });

  // Opciones para preguntas de selección múltiple
  const [opciones, setOpciones] = useState<Array<{ texto: string; es_correcta: boolean }>>([
    { texto: '', es_correcta: false },
    { texto: '', es_correcta: false },
  ]);

  // Pares para preguntas de emparejamiento
  const [pares, setPares] = useState<Array<{ pregunta: string; respuesta: string }>>([
    { pregunta: '', respuesta: '' },
    { pregunta: '', respuesta: '' },
  ]);

  // Respuesta modelo para preguntas de desarrollo
  const [respuestaModelo, setRespuestaModelo] = useState('');

  // Verificar privilegios
  const userPrivileges = user?.privilegios?.map(p => p.id_privilegio.nombre_privilegio || p.id_privilegio.nombre) || [];
  const canEdit = userPrivileges.includes('superadmin') || userPrivileges.includes('editor');

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      await Promise.all([
        fetchPreguntas(),
        fetchSubcategorias(),
        fetchNivelesDificultad(),
        fetchRangosEdad(),
        fetchEstadosPregunta(),
      ]);
      setError('');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Error al cargar datos');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPreguntas = async () => {
    try {
      const response = await preguntaService.getAll();
      setPreguntas(response.data);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      throw new Error(error.response?.data?.message || 'Error al cargar preguntas');
    }
  };

  const fetchSubcategorias = async () => {
    try {
      const response = await subcategoriaService.getAll();
      setSubcategorias(response.data);
    } catch (err) {
      console.error('Error al cargar subcategorías:', err);
    }
  };

  const fetchNivelesDificultad = async () => {
    try {
      const response = await nivelDificultadService.getAll();
      setNivelesDificultad(response.data);
    } catch (err) {
      console.error('Error al cargar niveles de dificultad:', err);
    }
  };

  const fetchRangosEdad = async () => {
    try {
      const response = await rangoEdadService.getAll();
      setRangosEdad(response.data);
    } catch (err) {
      console.error('Error al cargar rangos de edad:', err);
    }
  };

  const fetchEstadosPregunta = async () => {
    try {
      const response = await estadoPreguntaService.getAll();
      setEstadosPregunta(response.data);
      // Establecer estado por defecto al cargar
      const borradorEstado = response.data.find(e => 
        e.nombre_estado.toLowerCase() === 'borrador' || 
        e.nombre_estado.toLowerCase() === 'draft'
      );
      if (borradorEstado && !nuevaPregunta.id_estado) {
        setNuevaPregunta(prev => ({ ...prev, id_estado: borradorEstado._id }));
      }
    } catch (err) {
      console.error('Error al cargar estados:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!canEdit) return;
    if (!window.confirm('¿Estás seguro de eliminar esta pregunta?')) return;
    
    try {
      await preguntaService.delete(id);
      await fetchPreguntas();
      setError('');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Error al eliminar pregunta');
    }
  };

  const handleCrearPregunta = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!canEdit) return;

    // Validaciones según tipo de pregunta
    if (nuevaPregunta.tipo_pregunta === 'seleccion_multiple') {
      // Debe tener al menos 2 opciones con texto
      const opcionesValidas = opciones.filter(op => op.texto.trim());
      if (opcionesValidas.length < 2) {
        setError('Debes agregar al menos 2 opciones para selección múltiple');
        return;
      }
      // Debe tener al menos una correcta
      const tieneCorrecta = opcionesValidas.some(op => op.es_correcta);
      if (!tieneCorrecta) {
        setError('Debes marcar al menos una opción como correcta');
        return;
      }
    } else if (nuevaPregunta.tipo_pregunta === 'verdadero_falso') {
      // Verificar que ambas opciones estén llenas (siempre deberían estarlo)
      const opcionesValidas = opciones.filter(op => op.texto.trim());
      if (opcionesValidas.length < 2) {
        setError('Las opciones de Verdadero/Falso deben estar completas');
        return;
      }
      // Debe tener una correcta
      const tieneCorrecta = opciones.some(op => op.es_correcta);
      if (!tieneCorrecta) {
        setError('Debes seleccionar una respuesta correcta (Verdadero o Falso)');
        return;
      }
    } else if (nuevaPregunta.tipo_pregunta === 'emparejamiento') {
      // Debe tener al menos 2 pares completos
      const paresValidos = pares.filter(p => p.pregunta.trim() && p.respuesta.trim());
      if (paresValidos.length < 2) {
        setError('Debes agregar al menos 2 pares completos para emparejamiento');
        return;
      }
    }

    try {
      // Crear la pregunta
      const preguntaCreada = await preguntaService.create(nuevaPregunta);
      const preguntaId = preguntaCreada.data._id;

      // Crear opciones, pares o respuesta modelo según el tipo
      if (nuevaPregunta.tipo_pregunta === 'seleccion_multiple' || nuevaPregunta.tipo_pregunta === 'verdadero_falso') {
        for (let i = 0; i < opciones.length; i++) {
          const opcion = opciones[i];
          if (opcion.texto.trim()) {
            await opcionPreguntaService.create({
              id_pregunta: preguntaId,
              texto_opcion: opcion.texto,
              es_correcta: opcion.es_correcta,
              orden: i + 1,
            });
          }
        }
      } else if (nuevaPregunta.tipo_pregunta === 'emparejamiento') {
        for (let i = 0; i < pares.length; i++) {
          const par = pares[i];
          if (par.pregunta.trim() && par.respuesta.trim()) {
            await parEmparejamientoService.create({
              id_pregunta: preguntaId,
              texto_pregunta: par.pregunta,
              texto_respuesta: par.respuesta,
              orden: i + 1,
            });
          }
        }
      } else if (nuevaPregunta.tipo_pregunta === 'desarrollo' && respuestaModelo.trim()) {
        await respuestaModeloService.create({
          id_pregunta: preguntaId,
          respuesta_texto: respuestaModelo,
        });
      }

      // Resetear formulario
      resetFormularioPregunta();
      setShowCrearPregunta(false);
      await fetchPreguntas();
      setError('');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Error al crear pregunta');
    }
  };

  const resetFormularioPregunta = () => {
    setNuevaPregunta({
      id_subcategoria: '',
      id_rango_edad: '',
      id_dificultad: '',
      id_estado: estadosPregunta.find(e => e.nombre_estado === 'Borrador')?._id || '',
      tipo_pregunta: 'seleccion_multiple',
      titulo_pregunta: '',
      puntos_recomendados: 1,
      tiempo_estimado: 0,
      explicacion: '',
    });
    setOpciones([
      { texto: '', es_correcta: false },
      { texto: '', es_correcta: false },
    ]);
    setPares([
      { pregunta: '', respuesta: '' },
      { pregunta: '', respuesta: '' },
    ]);
    setRespuestaModelo('');
  };

  const agregarOpcion = () => {
    setOpciones([...opciones, { texto: '', es_correcta: false }]);
  };

  const eliminarOpcion = (index: number) => {
    if (opciones.length > 2) {
      setOpciones(opciones.filter((_, i) => i !== index));
    }
  };

  const agregarPar = () => {
    setPares([...pares, { pregunta: '', respuesta: '' }]);
  };

  const eliminarPar = (index: number) => {
    if (pares.length > 2) {
      setPares(pares.filter((_, i) => i !== index));
    }
  };

  const getTipoPreguntaLabel = (tipo: string) => {
    const tipos: Record<string, string> = {
      seleccion_multiple: 'Selección Múltiple',
      verdadero_falso: 'Verdadero/Falso',
      desarrollo: 'Desarrollo',
      respuesta_corta: 'Respuesta Corta',
      emparejamiento: 'Emparejamiento',
    };
    return tipos[tipo] || tipo;
  };

  const getTipoIcon = (tipo: string) => {
    const icons: Record<string, string> = {
      seleccion_multiple: '☑️',
      verdadero_falso: '✔️',
      desarrollo: '📝',
      respuesta_corta: '✏️',
      emparejamiento: '🔗',
    };
    return icons[tipo] || '❓';
  };

  const getSubcategoriaNombre = (id: string) => {
    const sub = subcategorias.find(s => s._id === id);
    return sub ? sub.nombre_subcategoria : 'Sin categoría';
  };

  const getDificultadNombre = (id: string) => {
    const diff = nivelesDificultad.find(d => d._id === id);
    return diff ? diff.nivel : 'Sin dificultad';
  };

  const getEstadoNombre = (id: string) => {
    const estado = estadosPregunta.find(e => e._id === id);
    return estado ? estado.nombre_estado : 'Sin estado';
  };

  // Filtrar preguntas
  const preguntasFiltradas = preguntas.filter(pregunta => {
    if (filtroTipo && pregunta.tipo_pregunta !== filtroTipo) return false;
    
    // Manejar subcategoría que puede ser string o objeto poblado
    if (filtroSubcategoria) {
      const subcategoriaId = typeof pregunta.id_subcategoria === 'string' 
        ? pregunta.id_subcategoria 
        : pregunta.id_subcategoria._id;
      if (subcategoriaId !== filtroSubcategoria) return false;
    }
    
    // Manejar dificultad que puede ser string o objeto poblado
    if (filtroDificultad) {
      const dificultadId = typeof pregunta.id_dificultad === 'string' 
        ? pregunta.id_dificultad 
        : pregunta.id_dificultad._id;
      if (dificultadId !== filtroDificultad) return false;
    }
    
    return true;
  });

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-400 mb-4"></div>
          <div className="text-white text-2xl font-semibold">Cargando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-gradient-to-br from-purple-900 via-pink-900 to-purple-900">
      <div className="relative z-10 w-full h-full flex flex-col overflow-y-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center px-8 py-6 bg-gradient-to-r from-purple-900/30 to-pink-900/30 backdrop-blur-md border-b border-white/10"
        >
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-lg text-white rounded-xl font-medium transition-all border border-white/20"
            >
              ← Volver
            </button>
            <div>
              <h1 className="text-4xl font-bold text-white flex items-center gap-3">
                <span className="text-5xl">❓</span>
                Banco de Preguntas
              </h1>
            </div>
          </div>

          {canEdit && (
            <motion.button
              onClick={() => {
                resetFormularioPregunta();
                setShowCrearPregunta(true);
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg"
            >
              ➕ Crear Nueva Pregunta
            </motion.button>
          )}
        </motion.div>

        {/* Contenido */}
        <div className="flex-1 p-8">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-red-500/20 border border-red-500/50 text-red-100 px-4 py-3 rounded-xl text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Filtros */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-white/5 backdrop-blur-2xl rounded-2xl p-6 border border-white/10"
          >
            <h2 className="text-xl font-semibold text-white mb-4">Filtros</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-white/70 text-sm mb-2">Tipo de Pregunta</label>
                <select
                  value={filtroTipo}
                  onChange={(e) => setFiltroTipo(e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400 transition-colors"
                >
                  <option value="">Todos los tipos</option>
                  <option value="seleccion_multiple">Selección Múltiple</option>
                  <option value="verdadero_falso">Verdadero/Falso</option>
                  <option value="desarrollo">Desarrollo</option>
                  <option value="respuesta_corta">Respuesta Corta</option>
                  <option value="emparejamiento">Emparejamiento</option>
                </select>
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">Subcategoría</label>
                <select
                  value={filtroSubcategoria}
                  onChange={(e) => setFiltroSubcategoria(e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400 transition-colors"
                >
                  <option value="">Todas las subcategorías</option>
                  {subcategorias.map(sub => (
                    <option key={sub._id} value={sub._id}>{sub.nombre_subcategoria}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">Dificultad</label>
                <select
                  value={filtroDificultad}
                  onChange={(e) => setFiltroDificultad(e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400 transition-colors"
                >
                  <option value="">Todas las dificultades</option>
                  {nivelesDificultad.map(diff => (
                    <option key={diff._id} value={diff._id}>{diff.nivel}</option>
                  ))}
                </select>
              </div>
            </div>

            {(filtroTipo || filtroSubcategoria || filtroDificultad) && (
              <button
                onClick={() => {
                  setFiltroTipo('');
                  setFiltroSubcategoria('');
                  setFiltroDificultad('');
                }}
                className="mt-4 text-white/60 hover:text-white text-sm transition-colors"
              >
                🗑️ Limpiar filtros
              </button>
            )}
          </motion.div>

          {/* Estadísticas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            <div className="bg-white/5 backdrop-blur-2xl rounded-xl p-4 border border-white/10">
              <div className="text-white/60 text-sm mb-1">Total de Preguntas</div>
              <div className="text-3xl font-bold text-white">{preguntas.length}</div>
            </div>
            <div className="bg-white/5 backdrop-blur-2xl rounded-xl p-4 border border-white/10">
              <div className="text-white/60 text-sm mb-1">Filtradas</div>
              <div className="text-3xl font-bold text-white">{preguntasFiltradas.length}</div>
            </div>
            <div className="bg-white/5 backdrop-blur-2xl rounded-xl p-4 border border-white/10">
              <div className="text-white/60 text-sm mb-1">Subcategorías</div>
              <div className="text-3xl font-bold text-white">{subcategorias.length}</div>
            </div>
            <div className="bg-white/5 backdrop-blur-2xl rounded-xl p-4 border border-white/10">
              <div className="text-white/60 text-sm mb-1">Dificultades</div>
              <div className="text-3xl font-bold text-white">{nivelesDificultad.length}</div>
            </div>
          </motion.div>

          {/* Lista de preguntas */}
          {preguntasFiltradas.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white/5 backdrop-blur-2xl rounded-2xl p-12 border border-white/10 text-center"
            >
              <p className="text-white/60 text-lg">
                {preguntas.length === 0 
                  ? 'No hay preguntas en el banco. Las preguntas se crean desde los exámenes.' 
                  : 'No se encontraron preguntas con los filtros aplicados.'}
              </p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {preguntasFiltradas.map((pregunta, index) => (
                <motion.div
                  key={pregunta._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white/5 backdrop-blur-2xl rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl">{getTipoIcon(pregunta.tipo_pregunta)}</span>
                        <span className="text-xs bg-purple-500/20 text-purple-200 px-2 py-1 rounded">
                          {getTipoPreguntaLabel(pregunta.tipo_pregunta)}
                        </span>
                        <span className="text-xs bg-blue-500/20 text-blue-200 px-2 py-1 rounded">
                          {getSubcategoriaNombre(typeof pregunta.id_subcategoria === 'string' ? pregunta.id_subcategoria : pregunta.id_subcategoria._id)}
                        </span>
                        <span className="text-xs bg-orange-500/20 text-orange-200 px-2 py-1 rounded">
                          {getDificultadNombre(typeof pregunta.id_dificultad === 'string' ? pregunta.id_dificultad : pregunta.id_dificultad._id)}
                        </span>
                        <span className="text-xs bg-green-500/20 text-green-200 px-2 py-1 rounded">
                          {getEstadoNombre(typeof pregunta.id_estado === 'string' ? pregunta.id_estado : pregunta.id_estado._id)}
                        </span>
                        <span className="text-xs text-white/60">
                          {pregunta.puntos_recomendados} pts
                        </span>
                      </div>

                      <h3 className="text-lg font-semibold text-white mb-2">
                        {pregunta.titulo_pregunta}
                      </h3>

                      {pregunta.explicacion && (
                        <p className="text-white/60 text-sm mb-3">{pregunta.explicacion}</p>
                      )}

                      <button
                        onClick={() => setPreguntaExpandida(preguntaExpandida === pregunta._id ? null : pregunta._id)}
                        className="text-purple-300 hover:text-purple-200 text-sm transition-colors"
                      >
                        {preguntaExpandida === pregunta._id ? '▼ Ver menos' : '▶ Ver detalles'}
                      </button>

                      {preguntaExpandida === pregunta._id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-4 pt-4 border-t border-white/10"
                        >
                          <div className="space-y-4">
                            {/* Información básica */}
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-white/60">Rango de Edad: </span>
                                <span className="text-white">
                                  {typeof pregunta.id_rango_edad === 'string' 
                                    ? rangosEdad.find(r => r._id === pregunta.id_rango_edad)?.nombre_rango || 'N/A'
                                    : (pregunta.id_rango_edad as { nombre_rango?: string })?.nombre_rango || 'N/A'}
                                </span>
                              </div>
                              <div>
                                <span className="text-white/60">Tiempo Estimado: </span>
                                <span className="text-white">{pregunta.tiempo_estimado || 0} min</span>
                              </div>
                              <div>
                                <span className="text-white/60">Creado por: </span>
                                <span className="text-white">
                                  {typeof pregunta.creado_por === 'object' && pregunta.creado_por !== null 
                                    ? (pregunta.creado_por as { nombre?: string }).nombre || 'Sistema'
                                    : 'Sistema'}
                                </span>
                              </div>
                              <div>
                                <span className="text-white/60">Fecha: </span>
                                <span className="text-white">
                                  {pregunta.fecha_creacion ? new Date(pregunta.fecha_creacion).toLocaleDateString('es-ES') : 'N/A'}
                                </span>
                              </div>
                            </div>

                            {/* Explicación */}
                            {pregunta.explicacion && (
                              <div className="mt-3 p-3 bg-blue-500/10 rounded-lg border border-blue-400/20">
                                <div className="text-xs text-blue-300 mb-1 font-semibold">Explicación:</div>
                                <div className="text-white/90 text-sm">{pregunta.explicacion}</div>
                              </div>
                            )}

                            {/* Mostrar opciones según tipo de pregunta */}
                            <OpcionesDetalles preguntaId={pregunta._id} tipoPregunta={pregunta.tipo_pregunta} />
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {canEdit && (
                      <motion.button
                        onClick={() => handleDelete(pregunta._id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="bg-red-500/20 hover:bg-red-500/40 text-red-200 p-2 rounded-lg transition-all border border-red-400/30"
                        title="Eliminar pregunta"
                      >
                        🗑️
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Crear Pregunta */}
        <AnimatePresence>
          {showCrearPregunta && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowCrearPregunta(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/10"
              >
                <h2 className="text-3xl font-bold text-white mb-6">Crear Nueva Pregunta</h2>
                
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 bg-red-500/20 border border-red-500/50 text-red-100 px-4 py-3 rounded-xl text-sm"
                  >
                    {error}
                  </motion.div>
                )}
                
                <form onSubmit={handleCrearPregunta} className="space-y-6">
                  {/* Campos básicos - Parte 1: Información general */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-white/90 mb-2">Título de la Pregunta *</label>
                      <input
                        type="text"
                        value={nuevaPregunta.titulo_pregunta}
                        onChange={(e) => setNuevaPregunta({ ...nuevaPregunta, titulo_pregunta: e.target.value })}
                        required
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
                        placeholder="Escribe la pregunta..."
                      />
                    </div>

                    <div>
                      <label className="block text-white/90 mb-2">Tipo de Pregunta *</label>
                      <select
                        value={nuevaPregunta.tipo_pregunta}
                        onChange={(e) => setNuevaPregunta({ 
                          ...nuevaPregunta, 
                          tipo_pregunta: e.target.value as 'seleccion_multiple' | 'verdadero_falso' | 'desarrollo' | 'respuesta_corta' | 'emparejamiento'
                        })}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
                      >
                        <option value="seleccion_multiple">Selección Múltiple</option>
                        <option value="verdadero_falso">Verdadero/Falso</option>
                        <option value="desarrollo">Desarrollo</option>
                        <option value="respuesta_corta">Respuesta Corta</option>
                        <option value="emparejamiento">Emparejamiento</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-white/90 mb-2">Subcategoría *</label>
                      <select
                        value={nuevaPregunta.id_subcategoria}
                        onChange={(e) => setNuevaPregunta({ ...nuevaPregunta, id_subcategoria: e.target.value })}
                        required
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
                      >
                        <option value="">Seleccionar...</option>
                        {subcategorias.filter(s => s.activo).map(sub => (
                          <option key={sub._id} value={sub._id}>{sub.nombre_subcategoria}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-white/90 mb-2">Dificultad *</label>
                      <select
                        value={nuevaPregunta.id_dificultad}
                        onChange={(e) => setNuevaPregunta({ ...nuevaPregunta, id_dificultad: e.target.value })}
                        required
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
                      >
                        <option value="">Seleccionar...</option>
                        {nivelesDificultad.filter(n => n.activo).map(nivel => (
                          <option key={nivel._id} value={nivel._id}>{nivel.nivel}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-white/90 mb-2">Rango de Edad *</label>
                      <select
                        value={nuevaPregunta.id_rango_edad}
                        onChange={(e) => setNuevaPregunta({ ...nuevaPregunta, id_rango_edad: e.target.value })}
                        required
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
                      >
                        <option value="">Seleccionar...</option>
                        {rangosEdad.filter(r => r.activo).map(rango => (
                          <option key={rango._id} value={rango._id}>
                            {rango.nombre_rango} ({rango.edad_minima}-{rango.edad_maxima} años)
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-white/90 mb-2">Estado *</label>
                      <select
                        value={nuevaPregunta.id_estado}
                        onChange={(e) => setNuevaPregunta({ ...nuevaPregunta, id_estado: e.target.value })}
                        required
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
                      >
                        <option value="">Seleccionar...</option>
                        {estadosPregunta.map(estado => (
                          <option key={estado._id} value={estado._id}>{estado.nombre_estado}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-white/90 mb-2">Puntos Recomendados</label>
                      <input
                        type="number"
                        value={nuevaPregunta.puntos_recomendados}
                        onChange={(e) => setNuevaPregunta({ ...nuevaPregunta, puntos_recomendados: parseInt(e.target.value) || 1 })}
                        min="1"
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
                      />
                    </div>

                    <div>
                      <label className="block text-white/90 mb-2">Tiempo Estimado (min)</label>
                      <input
                        type="number"
                        value={nuevaPregunta.tiempo_estimado}
                        onChange={(e) => setNuevaPregunta({ ...nuevaPregunta, tiempo_estimado: parseInt(e.target.value) || 0 })}
                        min="0"
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-white/90 mb-2">Explicación (opcional)</label>
                      <textarea
                        value={nuevaPregunta.explicacion}
                        onChange={(e) => setNuevaPregunta({ ...nuevaPregunta, explicacion: e.target.value })}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400 resize-none"
                        rows={2}
                        placeholder="Explicación adicional..."
                      />
                    </div>
                  </div>

                  {/* Opciones según tipo de pregunta */}
                  {(nuevaPregunta.tipo_pregunta === 'seleccion_multiple' || nuevaPregunta.tipo_pregunta === 'verdadero_falso') && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-white font-semibold">Opciones de Respuesta</h3>
                        {nuevaPregunta.tipo_pregunta === 'seleccion_multiple' && (
                          <button
                            type="button"
                            onClick={agregarOpcion}
                            className="text-green-400 hover:text-green-300 text-sm"
                          >
                            + Agregar Opción
                          </button>
                        )}
                      </div>
                      {opciones.map((opcion, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={opcion.texto}
                            onChange={(e) => {
                              const newOpciones = [...opciones];
                              newOpciones[index].texto = e.target.value;
                              setOpciones(newOpciones);
                            }}
                            placeholder={`Opción ${index + 1}`}
                            className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
                          />
                          <label className="flex items-center gap-2 bg-white/5 px-4 rounded-lg">
                            <input
                              type="checkbox"
                              checked={opcion.es_correcta}
                              onChange={(e) => {
                                const newOpciones = [...opciones];
                                newOpciones[index].es_correcta = e.target.checked;
                                setOpciones(newOpciones);
                              }}
                              className="w-5 h-5"
                            />
                            <span className="text-white text-sm">Correcta</span>
                          </label>
                          {opciones.length > 2 && nuevaPregunta.tipo_pregunta === 'seleccion_multiple' && (
                            <button
                              type="button"
                              onClick={() => eliminarOpcion(index)}
                              className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {nuevaPregunta.tipo_pregunta === 'emparejamiento' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-white font-semibold">Pares de Emparejamiento</h3>
                        <button
                          type="button"
                          onClick={agregarPar}
                          className="text-green-400 hover:text-green-300 text-sm"
                        >
                          + Agregar Par
                        </button>
                      </div>
                      {pares.map((par, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={par.pregunta}
                            onChange={(e) => {
                              const newPares = [...pares];
                              newPares[index].pregunta = e.target.value;
                              setPares(newPares);
                            }}
                            placeholder="Pregunta"
                            className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
                          />
                          <input
                            type="text"
                            value={par.respuesta}
                            onChange={(e) => {
                              const newPares = [...pares];
                              newPares[index].respuesta = e.target.value;
                              setPares(newPares);
                            }}
                            placeholder="Respuesta"
                            className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
                          />
                          {pares.length > 2 && (
                            <button
                              type="button"
                              onClick={() => eliminarPar(index)}
                              className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {nuevaPregunta.tipo_pregunta === 'desarrollo' && (
                    <div>
                      <label className="block text-white/90 mb-2">Respuesta Modelo (opcional)</label>
                      <textarea
                        value={respuestaModelo}
                        onChange={(e) => setRespuestaModelo(e.target.value)}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400 resize-none"
                        rows={4}
                        placeholder="Escribe una respuesta modelo..."
                      />
                    </div>
                  )}

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowCrearPregunta(false)}
                      className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-medium transition-all"
                    >
                      Crear Pregunta
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PreguntasPage;
