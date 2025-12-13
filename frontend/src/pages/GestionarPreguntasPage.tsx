import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { 
  Examen, 
  ExamenPregunta, 
  Pregunta
} from '../types';
import { 
  examenService,
  examenPreguntaService,
  preguntaService
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
  const [showAgregarExistente, setShowAgregarExistente] = useState(false);
  
  // Datos para agregar pregunta existente
  const [preguntasDisponibles, setPreguntasDisponibles] = useState<Pregunta[]>([]);

  // Verificar privilegios - Solo editor y superadmin pueden crear/editar preguntas según backend
  const userPrivileges = user?.privilegios?.map(p => p.id_privilegio.nombre_privilegio || p.id_privilegio.nombre) || [];
  const canEdit = userPrivileges.includes('superadmin') || userPrivileges.includes('editor');

  useEffect(() => {
    if (!canEdit) {
      navigate('/examenes');
      return;
    }
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examenId]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      await Promise.all([
        fetchExamen(),
        fetchExamenPreguntas(),
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

  const fetchPreguntasDisponibles = async () => {
    const response = await preguntaService.getAll();
    // Filtrar preguntas que no estén ya en el examen
    const preguntasEnExamen = examenPreguntas.map(ep => 
      typeof ep.id_pregunta === 'object' ? ep.id_pregunta._id : ep.id_pregunta
    );
    // Filtrar solo preguntas publicadas y que no estén en el examen
    const disponibles = response.data.filter(p => {
      const estadoPregunta = typeof p.id_estado === 'object' ? p.id_estado : null;
      const esPublicada = estadoPregunta?.nombre_estado?.toLowerCase() === 'publicada' || 
                          estadoPregunta?.nombre_estado?.toLowerCase() === 'publicado';
      return !preguntasEnExamen.includes(p._id) && esPublicada;
    });
    setPreguntasDisponibles(disponibles);
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
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-400 mb-4"></div>
          <div className="text-white text-2xl font-semibold">Cargando...</div>
        </div>
      </div>
    );
  }

  if (!examen) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-2xl">Examen no encontrado</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <div className="relative z-10 w-full h-full flex flex-col overflow-y-auto">
        <div className="flex-1 px-8 py-8">
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
    </div>
  );
};

export default GestionarPreguntasPage;
