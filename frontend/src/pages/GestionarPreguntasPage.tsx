import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { 
  Examen, 
  ExamenPregunta, 
  Pregunta, 
  Subcategoria,
  NivelDificultad,
  RangoEdad,
  EstadoPregunta
} from '../types';
import { 
  examenService,
  examenPreguntaService,
  preguntaService,
  opcionPreguntaService,
  parEmparejamientoService,
  respuestaModeloService,
  subcategoriaService,
  nivelDificultadService,
  rangoEdadService,
  estadoPreguntaService
} from '../services/dataService';

const GestionarPreguntasPage = () => {
  const { examenId } = useParams<{ examenId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [examen, setExamen] = useState<Examen | null>(null);
  const [examenPreguntas, setExamenPreguntas] = useState<ExamenPregunta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modales
  const [showCrearPregunta, setShowCrearPregunta] = useState(false);
  const [showAgregarExistente, setShowAgregarExistente] = useState(false);
  
  // Datos para crear pregunta
  const [subcategorias, setSubcategorias] = useState<Subcategoria[]>([]);
  const [nivelesDificultad, setNivelesDificultad] = useState<NivelDificultad[]>([]);
  const [rangosEdad, setRangosEdad] = useState<RangoEdad[]>([]);
  const [estadosPregunta, setEstadosPregunta] = useState<EstadoPregunta[]>([]);
  const [preguntasDisponibles, setPreguntasDisponibles] = useState<Pregunta[]>([]);

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

  // Verificar privilegios - Solo editor y superadmin pueden crear/editar preguntas según backend
  const userPrivileges = user?.privilegios?.map(p => p.id_privilegio.nombre_privilegio || p.id_privilegio.nombre) || [];
  const canEdit = userPrivileges.includes('superadmin') || userPrivileges.includes('editor');

  useEffect(() => {
    if (!canEdit) {
      navigate('/examenes');
      return;
    }
    fetchData();
  }, [examenId]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      await Promise.all([
        fetchExamen(),
        fetchExamenPreguntas(),
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

  const fetchExamen = async () => {
    if (!examenId) return;
    const response = await examenService.getById(examenId);
    setExamen(response.data);
  };

  const fetchExamenPreguntas = async () => {
    if (!examenId) return;
    const response = await examenPreguntaService.getByExamen(examenId);
    setExamenPreguntas(response.data);
  };

  const fetchSubcategorias = async () => {
    const response = await subcategoriaService.getAll();
    setSubcategorias(response.data);
  };

  const fetchNivelesDificultad = async () => {
    const response = await nivelDificultadService.getAll();
    setNivelesDificultad(response.data);
  };

  const fetchRangosEdad = async () => {
    const response = await rangoEdadService.getAll();
    setRangosEdad(response.data);
  };

  const fetchEstadosPregunta = async () => {
    const response = await estadoPreguntaService.getAll();
    setEstadosPregunta(response.data);
  };

  const fetchPreguntasDisponibles = async () => {
    const response = await preguntaService.getAll();
    // Filtrar preguntas que no estén ya en el examen
    const preguntasEnExamen = examenPreguntas.map(ep => 
      typeof ep.id_pregunta === 'object' ? ep.id_pregunta._id : ep.id_pregunta
    );
    const disponibles = response.data.filter(p => !preguntasEnExamen.includes(p._id));
    setPreguntasDisponibles(disponibles);
  };

  const handleCrearPregunta = async (e: FormEvent) => {
    e.preventDefault();
    try {
      // 1. Crear la pregunta
      const preguntaResponse = await preguntaService.create({
        ...nuevaPregunta,
        activa: true,
      });

      const preguntaId = preguntaResponse.data._id;

      // 2. Crear opciones/pares/respuesta modelo según el tipo
      if (nuevaPregunta.tipo_pregunta === 'seleccion_multiple' || nuevaPregunta.tipo_pregunta === 'verdadero_falso') {
        // Crear opciones
        for (let i = 0; i < opciones.length; i++) {
          if (opciones[i].texto.trim()) {
            await opcionPreguntaService.create({
              id_pregunta: preguntaId,
              texto_opcion: opciones[i].texto,
              es_correcta: opciones[i].es_correcta,
              orden: i + 1,
            });
          }
        }
      } else if (nuevaPregunta.tipo_pregunta === 'emparejamiento') {
        // Crear pares
        for (let i = 0; i < pares.length; i++) {
          if (pares[i].pregunta.trim() && pares[i].respuesta.trim()) {
            await parEmparejamientoService.create({
              id_pregunta: preguntaId,
              texto_pregunta: pares[i].pregunta,
              texto_respuesta: pares[i].respuesta,
              orden: i + 1,
            });
          }
        }
      } else if ((nuevaPregunta.tipo_pregunta === 'desarrollo' || nuevaPregunta.tipo_pregunta === 'respuesta_corta') && respuestaModelo.trim()) {
        // Crear respuesta modelo
        await respuestaModeloService.create({
          id_pregunta: preguntaId,
          respuesta_texto: respuestaModelo,
        });
      }

      // 3. Agregar pregunta al examen
      await examenPreguntaService.create({
        id_examen: examenId!,
        id_pregunta: preguntaId,
        orden_definido: examenPreguntas.length + 1,
        puntos_asignados: nuevaPregunta.puntos_recomendados,
        usar_puntos_recomendados: true,
        obligatoria: true,
      });

      // Resetear formulario
      resetFormularioPregunta();
      setShowCrearPregunta(false);
      await fetchExamenPreguntas();
      setError('');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Error al crear pregunta');
    }
  };

  const handleAgregarPreguntaExistente = async (preguntaId: string) => {
    try {
      await examenPreguntaService.create({
        id_examen: examenId!,
        id_pregunta: preguntaId,
        orden_definido: examenPreguntas.length + 1,
        usar_puntos_recomendados: true,
        obligatoria: true,
      });

      setShowAgregarExistente(false);
      await fetchExamenPreguntas();
      setError('');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Error al agregar pregunta');
    }
  };

  const handleEliminarPreguntaDelExamen = async (examenPreguntaId: string) => {
    if (!confirm('¿Eliminar esta pregunta del examen?')) return;
    
    try {
      await examenPreguntaService.delete(examenPreguntaId);
      await fetchExamenPreguntas();
      setError('');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Error al eliminar pregunta');
    }
  };

  const handleMoverPregunta = async (index: number, direccion: 'arriba' | 'abajo') => {
    if ((direccion === 'arriba' && index === 0) || (direccion === 'abajo' && index === examenPreguntas.length - 1)) {
      return;
    }

    const newIndex = direccion === 'arriba' ? index - 1 : index + 1;
    const newOrder = [...examenPreguntas];
    [newOrder[index], newOrder[newIndex]] = [newOrder[newIndex], newOrder[index]];

    try {
      // Actualizar orden en el backend
      const ordenData = newOrder.map((ep, i) => ({
        id: ep._id,
        orden: i + 1,
      }));
      
      await examenPreguntaService.updateOrden(examenId!, ordenData);
      setExamenPreguntas(newOrder);
      setError('');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Error al reordenar preguntas');
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
    if (opciones.length <= 2) return;
    setOpciones(opciones.filter((_, i) => i !== index));
  };

  const agregarPar = () => {
    setPares([...pares, { pregunta: '', respuesta: '' }]);
  };

  const eliminarPar = (index: number) => {
    if (pares.length <= 2) return;
    setPares(pares.filter((_, i) => i !== index));
  };

  const getTipoPreguntaLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      seleccion_multiple: '📝 Selección Múltiple',
      verdadero_falso: '✓✗ Verdadero/Falso',
      desarrollo: '📄 Desarrollo',
      respuesta_corta: '✏️ Respuesta Corta',
      emparejamiento: '🔗 Emparejamiento',
    };
    return labels[tipo] || tipo;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-2xl">Cargando...</div>
      </div>
    );
  }

  if (!examen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-2xl">Examen no encontrado</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/examenes')}
            className="mb-4 text-white/70 hover:text-white transition-colors flex items-center gap-2"
          >
            ← Volver a exámenes
          </button>
          
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 mb-2">
            Gestionar Preguntas
          </h1>
          <p className="text-xl text-white/70">{examen.titulo}</p>
          
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 bg-red-500/20 border border-red-500/50 text-red-100 px-4 py-3 rounded-xl text-sm"
            >
              {error}
            </motion.div>
          )}
        </motion.div>

        {/* Botones de acción */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex gap-4"
        >
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

          <motion.button
            onClick={() => {
              fetchPreguntasDisponibles();
              setShowAgregarExistente(true);
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg"
          >
            📚 Agregar Pregunta Existente
          </motion.button>
        </motion.div>

        {/* Lista de preguntas */}
        <div className="space-y-4">
          {examenPreguntas.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white/5 backdrop-blur-2xl rounded-2xl p-12 border border-white/10 text-center"
            >
              <p className="text-white/60 text-lg">
                Este examen no tiene preguntas aún. Comienza creando o agregando preguntas.
              </p>
            </motion.div>
          ) : (
            examenPreguntas.map((ep, index) => {
              const pregunta = typeof ep.id_pregunta === 'object' ? ep.id_pregunta : null;
              if (!pregunta) return null;

              return (
                <motion.div
                  key={ep._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white/5 backdrop-blur-2xl rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all"
                >
                  <div className="flex items-start gap-4">
                    {/* Número y controles de orden */}
                    <div className="flex flex-col items-center gap-2">
                      <div className="bg-blue-500/20 text-blue-200 font-bold rounded-lg w-10 h-10 flex items-center justify-center">
                        {index + 1}
                      </div>
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => handleMoverPregunta(index, 'arriba')}
                          disabled={index === 0}
                          className={`p-1 rounded transition-colors ${
                            index === 0 
                              ? 'text-white/20 cursor-not-allowed' 
                              : 'text-white/60 hover:text-white hover:bg-white/10'
                          }`}
                          title="Mover arriba"
                        >
                          ▲
                        </button>
                        <button
                          onClick={() => handleMoverPregunta(index, 'abajo')}
                          disabled={index === examenPreguntas.length - 1}
                          className={`p-1 rounded transition-colors ${
                            index === examenPreguntas.length - 1
                              ? 'text-white/20 cursor-not-allowed' 
                              : 'text-white/60 hover:text-white hover:bg-white/10'
                          }`}
                          title="Mover abajo"
                        >
                          ▼
                        </button>
                      </div>
                    </div>

                    {/* Contenido de la pregunta */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs bg-purple-500/20 text-purple-200 px-2 py-1 rounded">
                              {getTipoPreguntaLabel(pregunta.tipo_pregunta)}
                            </span>
                            <span className="text-xs text-white/60">
                              {ep.puntos_asignados || pregunta.puntos_recomendados} puntos
                            </span>
                            {ep.obligatoria && (
                              <span className="text-xs bg-red-500/20 text-red-200 px-2 py-1 rounded">
                                Obligatoria
                              </span>
                            )}
                          </div>
                          <h3 className="text-lg font-semibold text-white">
                            {pregunta.titulo_pregunta}
                          </h3>
                          {pregunta.explicacion && (
                            <p className="text-white/60 text-sm mt-1">{pregunta.explicacion}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Botón eliminar */}
                    <motion.button
                      onClick={() => handleEliminarPreguntaDelExamen(ep._id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="bg-red-500/20 hover:bg-red-500/40 text-red-200 p-2 rounded-lg transition-all border border-red-400/30"
                      title="Eliminar del examen"
                    >
                      🗑️
                    </motion.button>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Modal: Crear Nueva Pregunta */}
        <AnimatePresence>
          {showCrearPregunta && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => setShowCrearPregunta(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/20"
                style={{
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                }}
              >
                <h2 className="text-3xl font-bold text-white mb-6">Crear Nueva Pregunta</h2>

                <form onSubmit={handleCrearPregunta} className="space-y-6">
                  {/* Tipo de pregunta */}
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      Tipo de Pregunta
                    </label>
                    <select
                      value={nuevaPregunta.tipo_pregunta}
                      onChange={(e) => setNuevaPregunta({ 
                        ...nuevaPregunta, 
                        tipo_pregunta: e.target.value as any 
                      })}
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    >
                      <option value="seleccion_multiple" className="bg-gray-800">Selección Múltiple</option>
                      <option value="verdadero_falso" className="bg-gray-800">Verdadero/Falso</option>
                      <option value="desarrollo" className="bg-gray-800">Desarrollo</option>
                      <option value="respuesta_corta" className="bg-gray-800">Respuesta Corta</option>
                      <option value="emparejamiento" className="bg-gray-800">Emparejamiento</option>
                    </select>
                  </div>

                  {/* Título de la pregunta */}
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      Título de la Pregunta
                    </label>
                    <textarea
                      value={nuevaPregunta.titulo_pregunta}
                      onChange={(e) => setNuevaPregunta({ ...nuevaPregunta, titulo_pregunta: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                      placeholder="Escribe la pregunta..."
                      rows={3}
                    />
                  </div>

                  {/* Grid de campos */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-2">
                        Subcategoría
                      </label>
                      <select
                        value={nuevaPregunta.id_subcategoria}
                        onChange={(e) => setNuevaPregunta({ ...nuevaPregunta, id_subcategoria: e.target.value })}
                        required
                        className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      >
                        <option value="">Seleccionar...</option>
                        {subcategorias.map(sub => (
                          <option key={sub._id} value={sub._id} className="bg-gray-800">
                            {sub.nombre_subcategoria}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-2">
                        Nivel de Dificultad
                      </label>
                      <select
                        value={nuevaPregunta.id_dificultad}
                        onChange={(e) => setNuevaPregunta({ ...nuevaPregunta, id_dificultad: e.target.value })}
                        required
                        className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      >
                        <option value="">Seleccionar...</option>
                        {nivelesDificultad.map(nivel => (
                          <option key={nivel._id} value={nivel._id} className="bg-gray-800">
                            {nivel.nivel}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-2">
                        Rango de Edad
                      </label>
                      <select
                        value={nuevaPregunta.id_rango_edad}
                        onChange={(e) => setNuevaPregunta({ ...nuevaPregunta, id_rango_edad: e.target.value })}
                        required
                        className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      >
                        <option value="">Seleccionar...</option>
                        {rangosEdad.map(rango => (
                          <option key={rango._id} value={rango._id} className="bg-gray-800">
                            {rango.nombre_rango} ({rango.edad_minima}-{rango.edad_maxima} años)
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-2">
                        Puntos Recomendados
                      </label>
                      <input
                        type="number"
                        value={nuevaPregunta.puntos_recomendados}
                        onChange={(e) => setNuevaPregunta({ ...nuevaPregunta, puntos_recomendados: parseFloat(e.target.value) || 1 })}
                        min="0"
                        step="0.5"
                        required
                        className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {/* Explicación */}
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      Explicación (opcional)
                    </label>
                    <textarea
                      value={nuevaPregunta.explicacion}
                      onChange={(e) => setNuevaPregunta({ ...nuevaPregunta, explicacion: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                      placeholder="Explicación adicional..."
                      rows={2}
                    />
                  </div>

                  {/* Opciones según tipo de pregunta */}
                  {(nuevaPregunta.tipo_pregunta === 'seleccion_multiple' || nuevaPregunta.tipo_pregunta === 'verdadero_falso') && (
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <label className="block text-sm font-medium text-white/90">
                          Opciones de Respuesta
                        </label>
                        {nuevaPregunta.tipo_pregunta === 'seleccion_multiple' && (
                          <button
                            type="button"
                            onClick={agregarOpcion}
                            className="text-green-300 hover:text-green-200 text-sm font-medium"
                          >
                            + Agregar Opción
                          </button>
                        )}
                      </div>

                      <div className="space-y-3">
                        {nuevaPregunta.tipo_pregunta === 'verdadero_falso' ? (
                          <>
                            {['Verdadero', 'Falso'].map((texto, i) => (
                              <div key={i} className="flex items-center gap-3 bg-white/5 p-3 rounded-lg">
                                <input
                                  type="radio"
                                  name="respuesta_correcta"
                                  checked={opciones[i]?.es_correcta || false}
                                  onChange={() => {
                                    const newOpciones = [
                                      { texto: 'Verdadero', es_correcta: i === 0 },
                                      { texto: 'Falso', es_correcta: i === 1 },
                                    ];
                                    setOpciones(newOpciones);
                                  }}
                                  className="w-4 h-4"
                                />
                                <span className="text-white flex-1">{texto}</span>
                                <span className="text-xs text-white/60">
                                  {opciones[i]?.es_correcta ? '✓ Correcta' : 'Incorrecta'}
                                </span>
                              </div>
                            ))}
                          </>
                        ) : (
                          opciones.map((opcion, index) => (
                            <div key={index} className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={opcion.es_correcta}
                                onChange={(e) => {
                                  const newOpciones = [...opciones];
                                  newOpciones[index].es_correcta = e.target.checked;
                                  setOpciones(newOpciones);
                                }}
                                className="w-4 h-4"
                              />
                              <input
                                type="text"
                                value={opcion.texto}
                                onChange={(e) => {
                                  const newOpciones = [...opciones];
                                  newOpciones[index].texto = e.target.value;
                                  setOpciones(newOpciones);
                                }}
                                required
                                className="flex-1 px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                                placeholder={`Opción ${index + 1}`}
                              />
                              {opciones.length > 2 && (
                                <button
                                  type="button"
                                  onClick={() => eliminarOpcion(index)}
                                  className="text-red-300 hover:text-red-200 px-2"
                                >
                                  ✕
                                </button>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  {nuevaPregunta.tipo_pregunta === 'emparejamiento' && (
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <label className="block text-sm font-medium text-white/90">
                          Pares de Emparejamiento
                        </label>
                        <button
                          type="button"
                          onClick={agregarPar}
                          className="text-green-300 hover:text-green-200 text-sm font-medium"
                        >
                          + Agregar Par
                        </button>
                      </div>

                      <div className="space-y-3">
                        {pares.map((par, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <input
                              type="text"
                              value={par.pregunta}
                              onChange={(e) => {
                                const newPares = [...pares];
                                newPares[index].pregunta = e.target.value;
                                setPares(newPares);
                              }}
                              required
                              className="flex-1 px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                              placeholder="Término"
                            />
                            <span className="text-white/60">⟷</span>
                            <input
                              type="text"
                              value={par.respuesta}
                              onChange={(e) => {
                                const newPares = [...pares];
                                newPares[index].respuesta = e.target.value;
                                setPares(newPares);
                              }}
                              required
                              className="flex-1 px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                              placeholder="Definición"
                            />
                            {pares.length > 2 && (
                              <button
                                type="button"
                                onClick={() => eliminarPar(index)}
                                className="text-red-300 hover:text-red-200 px-2"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {(nuevaPregunta.tipo_pregunta === 'desarrollo' || nuevaPregunta.tipo_pregunta === 'respuesta_corta') && (
                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-2">
                        Respuesta Modelo (opcional)
                      </label>
                      <textarea
                        value={respuestaModelo}
                        onChange={(e) => setRespuestaModelo(e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                        placeholder="Respuesta modelo o criterios de evaluación..."
                        rows={4}
                      />
                    </div>
                  )}

                  {/* Botones */}
                  <div className="flex gap-4 pt-4">
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 rounded-xl font-semibold transition-all"
                    >
                      Crear Pregunta
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={() => setShowCrearPregunta(false)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-semibold transition-all border border-white/30"
                    >
                      Cancelar
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal: Agregar Pregunta Existente */}
        <AnimatePresence>
          {showAgregarExistente && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => setShowAgregarExistente(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/20"
                style={{
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                }}
              >
                <h2 className="text-3xl font-bold text-white mb-6">Agregar Pregunta Existente</h2>

                {preguntasDisponibles.length === 0 ? (
                  <p className="text-white/60 text-center py-8">
                    No hay preguntas disponibles para agregar.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {preguntasDisponibles.map((pregunta) => (
                      <div
                        key={pregunta._id}
                        className="bg-white/5 p-4 rounded-xl border border-white/10 hover:border-white/30 transition-all"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs bg-purple-500/20 text-purple-200 px-2 py-1 rounded">
                                {getTipoPreguntaLabel(pregunta.tipo_pregunta)}
                              </span>
                              <span className="text-xs text-white/60">
                                {pregunta.puntos_recomendados} puntos
                              </span>
                            </div>
                            <h3 className="text-white font-medium">{pregunta.titulo_pregunta}</h3>
                          </div>
                          <motion.button
                            onClick={() => handleAgregarPreguntaExistente(pregunta._id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-green-500/20 hover:bg-green-500/40 text-green-200 px-4 py-2 rounded-lg transition-all border border-green-400/30 text-sm font-medium"
                          >
                            Agregar
                          </motion.button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-6">
                  <motion.button
                    onClick={() => setShowAgregarExistente(false)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-semibold transition-all border border-white/30"
                  >
                    Cerrar
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GestionarPreguntasPage;
