import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { 
  Examen, 
  ExamenPregunta,
  OpcionPregunta,
  ParEmparejamiento
} from '../types';
import { 
  examenService,
  examenPreguntaService,
  intentoExamenService,
  opcionPreguntaService,
  parEmparejamientoService,
  respuestaSeleccionService,
  respuestaDesarrolloService,
  respuestaEmparejamientoService
} from '../services/dataService';

interface RespuestaLocal {
  id_examen_pregunta: string;
  tipo: 'seleccion' | 'desarrollo' | 'emparejamiento';
  // Para selección múltiple y verdadero/falso
  id_opcion_seleccionada?: string;
  // Para desarrollo y respuesta corta
  respuesta_texto?: string;
  // Para emparejamiento (array de pares con su respuesta)
  emparejamientos?: Array<{ id_par: string; respuesta_asignada: string }>;
}

const ResolverExamenPage = () => {
  const { examenId } = useParams<{ examenId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [examen, setExamen] = useState<Examen | null>(null);
  const [examenPreguntas, setExamenPreguntas] = useState<ExamenPregunta[]>([]);
  const [preguntaActualIndex, setPreguntaActualIndex] = useState(0);
  const [respuestas, setRespuestas] = useState<RespuestaLocal[]>([]);
  const [intentoId, setIntentoId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [tiempoRestante, setTiempoRestante] = useState<number | null>(null);
  const [examenFinalizado, setExamenFinalizado] = useState(false);

  // Datos de opciones y pares para la pregunta actual
  const [opciones, setOpciones] = useState<OpcionPregunta[]>([]);
  const [pares, setPares] = useState<ParEmparejamiento[]>([]);
  const [paresDesordenados, setParesDesordenados] = useState<{ id: string; texto: string }[]>([]);

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examenId]);

  useEffect(() => {
    // Timer para tiempo restante
    if (tiempoRestante !== null && tiempoRestante > 0 && !examenFinalizado) {
      const timer = setInterval(() => {
        setTiempoRestante(prev => {
          if (prev === null || prev <= 1) {
            // Tiempo agotado, finalizar automáticamente
            handleFinalizarExamen(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tiempoRestante, examenFinalizado]);

  useEffect(() => {
    // Cargar opciones/pares cuando cambia la pregunta
    if (examenPreguntas.length > 0 && preguntaActualIndex < examenPreguntas.length) {
      cargarDatosPregunta();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preguntaActualIndex, examenPreguntas]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Cargar examen
      const examenResponse = await examenService.getById(examenId!);
      setExamen(examenResponse.data);

      // Cargar preguntas del examen
      const preguntasResponse = await examenPreguntaService.getByExamen(examenId!);
      let preguntas = preguntasResponse.data;

      // Aleatorizar preguntas si está configurado
      if (examenResponse.data.aleatorizar_preguntas) {
        preguntas = [...preguntas].sort(() => Math.random() - 0.5);
      }

      setExamenPreguntas(preguntas);

      // Crear intento de examen
      const intentoResponse = await intentoExamenService.create({
        id_examen: examenId!,
        id_usuario: user!._id,
        numero_intento: 1, // TODO: calcular número de intento real
        completado: false,
        requiere_revision_manual: false,
      });

      setIntentoId(intentoResponse.data._id);

      // Calcular tiempo restante
      if (examenResponse.data.duracion_minutos) {
        setTiempoRestante(examenResponse.data.duracion_minutos * 60);
      }

      setError('');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Error al cargar examen');
    } finally {
      setIsLoading(false);
    }
  };

  const cargarDatosPregunta = async () => {
    const examenPregunta = examenPreguntas[preguntaActualIndex];
    const pregunta = typeof examenPregunta.id_pregunta === 'object' 
      ? examenPregunta.id_pregunta 
      : null;

    if (!pregunta) return;

    try {
      if (pregunta.tipo_pregunta === 'seleccion_multiple' || pregunta.tipo_pregunta === 'verdadero_falso') {
        const opcionesResponse = await opcionPreguntaService.getByPregunta(pregunta._id);
        let opcionesData = opcionesResponse.data;

        // Aleatorizar opciones si está configurado
        if (examen?.aleatorizar_opciones) {
          opcionesData = [...opcionesData].sort(() => Math.random() - 0.5);
        }

        setOpciones(opcionesData);
      } else if (pregunta.tipo_pregunta === 'emparejamiento') {
        const paresResponse = await parEmparejamientoService.getByPregunta(pregunta._id);
        const paresData = paresResponse.data;
        setPares(paresData);

        // Desordenar las respuestas
        const respuestas = paresData.map(p => ({
          id: p._id,
          texto: p.texto_respuesta || '',
        }));
        setParesDesordenados([...respuestas].sort(() => Math.random() - 0.5));
      }
    } catch (err) {
      console.error('Error al cargar datos de la pregunta:', err);
    }
  };

  const handleRespuestaSeleccion = (opcionId: string) => {
    const examenPregunta = examenPreguntas[preguntaActualIndex];
    
    setRespuestas(prev => {
      const existingIndex = prev.findIndex(r => r.id_examen_pregunta === examenPregunta._id);
      const newRespuesta: RespuestaLocal = {
        id_examen_pregunta: examenPregunta._id,
        tipo: 'seleccion',
        id_opcion_seleccionada: opcionId,
      };

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = newRespuesta;
        return updated;
      }
      return [...prev, newRespuesta];
    });
  };

  const handleRespuestaDesarrollo = (texto: string) => {
    const examenPregunta = examenPreguntas[preguntaActualIndex];
    
    setRespuestas(prev => {
      const existingIndex = prev.findIndex(r => r.id_examen_pregunta === examenPregunta._id);
      const newRespuesta: RespuestaLocal = {
        id_examen_pregunta: examenPregunta._id,
        tipo: 'desarrollo',
        respuesta_texto: texto,
      };

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = newRespuesta;
        return updated;
      }
      return [...prev, newRespuesta];
    });
  };

  const handleRespuestaEmparejamiento = (parId: string, respuestaAsignada: string) => {
    const examenPregunta = examenPreguntas[preguntaActualIndex];
    
    setRespuestas(prev => {
      const existingIndex = prev.findIndex(r => r.id_examen_pregunta === examenPregunta._id);
      
      if (existingIndex >= 0) {
        const updated = [...prev];
        const emparejamientos = updated[existingIndex].emparejamientos || [];
        const emparejamientoIndex = emparejamientos.findIndex(e => e.id_par === parId);
        
        if (emparejamientoIndex >= 0) {
          emparejamientos[emparejamientoIndex].respuesta_asignada = respuestaAsignada;
        } else {
          emparejamientos.push({ id_par: parId, respuesta_asignada: respuestaAsignada });
        }
        
        updated[existingIndex].emparejamientos = emparejamientos;
        return updated;
      }

      return [...prev, {
        id_examen_pregunta: examenPregunta._id,
        tipo: 'emparejamiento',
        emparejamientos: [{ id_par: parId, respuesta_asignada: respuestaAsignada }],
      }];
    });
  };

  const handleSiguientePregunta = () => {
    if (preguntaActualIndex < examenPreguntas.length - 1) {
      setPreguntaActualIndex(preguntaActualIndex + 1);
    }
  };

  const handleAnteriorPregunta = () => {
    if (preguntaActualIndex > 0) {
      setPreguntaActualIndex(preguntaActualIndex - 1);
    }
  };

  const handleFinalizarExamen = async (porTiempo = false) => {
    if (!intentoId) return;

    if (!porTiempo && !confirm('¿Estás seguro de finalizar el examen? No podrás modificar tus respuestas.')) {
      return;
    }

    try {
      setIsLoading(true);

      // Guardar todas las respuestas
      for (const respuesta of respuestas) {
        if (respuesta.tipo === 'seleccion' && respuesta.id_opcion_seleccionada) {
          await respuestaSeleccionService.create({
            id_intento: intentoId,
            id_examen_pregunta: respuesta.id_examen_pregunta,
            id_opcion_seleccionada: respuesta.id_opcion_seleccionada,
          });
        } else if (respuesta.tipo === 'desarrollo' && respuesta.respuesta_texto) {
          await respuestaDesarrolloService.create({
            id_intento: intentoId,
            id_examen_pregunta: respuesta.id_examen_pregunta,
            respuesta_texto: respuesta.respuesta_texto,
            calificada: false,
          });
        } else if (respuesta.tipo === 'emparejamiento' && respuesta.emparejamientos) {
          for (const emp of respuesta.emparejamientos) {
            await respuestaEmparejamientoService.create({
              id_intento: intentoId,
              id_examen_pregunta: respuesta.id_examen_pregunta,
              id_par: emp.id_par,
            });
          }
        }
      }

      // Finalizar intento
      await intentoExamenService.finalizar(intentoId);

      setExamenFinalizado(true);
      setError('');
      
      if (porTiempo) {
        alert('El tiempo ha finalizado. El examen se ha enviado automáticamente.');
      }

      // Redirigir después de 3 segundos
      setTimeout(() => {
        navigate('/examenes');
      }, 3000);

    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Error al finalizar examen');
    } finally {
      setIsLoading(false);
    }
  };

  const getRespuestaActual = () => {
    const examenPregunta = examenPreguntas[preguntaActualIndex];
    return respuestas.find(r => r.id_examen_pregunta === examenPregunta._id);
  };

  const formatTiempo = (segundos: number) => {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segs = segundos % 60;
    
    if (horas > 0) {
      return `${horas}:${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
    }
    return `${minutos}:${segs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-2xl">Cargando examen...</div>
      </div>
    );
  }

  if (!examen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-2xl">Examen no encontrado</div>
      </div>
    );
  }

  if (examenFinalizado) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/10 backdrop-blur-2xl rounded-3xl p-12 border border-white/20 text-center max-w-2xl"
        >
          <div className="text-6xl mb-6">✅</div>
          <h1 className="text-4xl font-bold text-white mb-4">¡Examen Finalizado!</h1>
          <p className="text-white/70 text-lg mb-6">
            Tu examen ha sido enviado correctamente. {examen.mostrar_resultados 
              ? 'Los resultados estarán disponibles pronto.' 
              : 'Tus respuestas están siendo revisadas.'}
          </p>
          <p className="text-white/50">Redirigiendo al listado de exámenes...</p>
        </motion.div>
      </div>
    );
  }

  const preguntaActual = examenPreguntas[preguntaActualIndex];
  const pregunta = typeof preguntaActual?.id_pregunta === 'object' ? preguntaActual.id_pregunta : null;
  const respuestaActual = getRespuestaActual();

  if (!pregunta) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-2xl">Error al cargar la pregunta</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header con timer */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">{examen.titulo}</h1>
            <p className="text-white/60">
              Pregunta {preguntaActualIndex + 1} de {examenPreguntas.length}
            </p>
          </div>
          
          {tiempoRestante !== null && (
            <div className={`text-2xl font-mono font-bold px-6 py-3 rounded-xl ${
              tiempoRestante < 300 
                ? 'bg-red-500/20 text-red-200 border border-red-400/50' 
                : 'bg-blue-500/20 text-blue-200 border border-blue-400/50'
            }`}>
              ⏱️ {formatTiempo(tiempoRestante)}
            </div>
          )}
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-red-500/20 border border-red-500/50 text-red-100 px-4 py-3 rounded-xl text-sm"
          >
            {error}
          </motion.div>
        )}

        {/* Pregunta */}
        <motion.div
          key={preguntaActualIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 mb-6"
        >
          <div className="flex items-start gap-4 mb-6">
            <div className="bg-purple-500/20 text-purple-200 font-bold rounded-lg px-4 py-2 text-lg">
              {preguntaActualIndex + 1}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-white mb-2">
                {pregunta.titulo_pregunta}
              </h2>
              {pregunta.explicacion && (
                <p className="text-white/60 text-sm">{pregunta.explicacion}</p>
              )}
              <div className="flex gap-2 mt-3">
                <span className="text-xs bg-blue-500/20 text-blue-200 px-3 py-1 rounded-full">
                  {preguntaActual.puntos_asignados || pregunta.puntos_recomendados} puntos
                </span>
                {preguntaActual.obligatoria && (
                  <span className="text-xs bg-red-500/20 text-red-200 px-3 py-1 rounded-full">
                    Obligatoria
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Respuestas según tipo de pregunta */}
          <div className="ml-16">
            {/* Selección Múltiple o Verdadero/Falso */}
            {(pregunta.tipo_pregunta === 'seleccion_multiple' || pregunta.tipo_pregunta === 'verdadero_falso') && (
              <div className="space-y-3">
                {opciones.map((opcion) => (
                  <motion.button
                    key={opcion._id}
                    onClick={() => handleRespuestaSeleccion(opcion._id)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      respuestaActual?.id_opcion_seleccionada === opcion._id
                        ? 'bg-green-500/30 border-green-400/80 text-white'
                        : 'bg-white/5 border-white/20 hover:border-white/40 text-white/80 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        respuestaActual?.id_opcion_seleccionada === opcion._id
                          ? 'border-green-400 bg-green-500'
                          : 'border-white/40'
                      }`}>
                        {respuestaActual?.id_opcion_seleccionada === opcion._id && (
                          <div className="w-3 h-3 bg-white rounded-full" />
                        )}
                      </div>
                      <span className="flex-1">{opcion.texto_opcion}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}

            {/* Desarrollo o Respuesta Corta */}
            {(pregunta.tipo_pregunta === 'desarrollo' || pregunta.tipo_pregunta === 'respuesta_corta') && (
              <textarea
                value={respuestaActual?.respuesta_texto || ''}
                onChange={(e) => handleRespuestaDesarrollo(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                placeholder="Escribe tu respuesta aquí..."
                rows={pregunta.tipo_pregunta === 'desarrollo' ? 10 : 4}
              />
            )}

            {/* Emparejamiento */}
            {pregunta.tipo_pregunta === 'emparejamiento' && (
              <div className="space-y-4">
                {pares.map((par) => {
                  const respuestaAsignada = respuestaActual?.emparejamientos?.find(
                    e => e.id_par === par._id
                  )?.respuesta_asignada;

                  return (
                    <div key={par._id} className="bg-white/5 p-4 rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="flex-1 text-white font-medium">
                          {par.texto_pregunta}
                        </div>
                        <span className="text-white/60">→</span>
                        <select
                          value={respuestaAsignada || ''}
                          onChange={(e) => handleRespuestaEmparejamiento(par._id, e.target.value)}
                          className="flex-1 px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                        >
                          <option value="">Seleccionar respuesta...</option>
                          {paresDesordenados.map(respuesta => (
                            <option key={respuesta.id} value={respuesta.id} className="bg-gray-800">
                              {respuesta.texto}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>

        {/* Navegación */}
        <div className="flex justify-between items-center gap-4">
          <motion.button
            onClick={handleAnteriorPregunta}
            disabled={preguntaActualIndex === 0}
            whileHover={preguntaActualIndex > 0 ? { scale: 1.02 } : {}}
            whileTap={preguntaActualIndex > 0 ? { scale: 0.98 } : {}}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              preguntaActualIndex === 0
                ? 'bg-white/5 text-white/30 cursor-not-allowed'
                : 'bg-white/10 hover:bg-white/20 text-white border border-white/30'
            }`}
          >
            ← Anterior
          </motion.button>

          <div className="flex-1 flex justify-center gap-2">
            {examenPreguntas.map((_, index) => (
              <button
                key={index}
                onClick={() => setPreguntaActualIndex(index)}
                className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                  index === preguntaActualIndex
                    ? 'bg-purple-500 text-white'
                    : respuestas.some(r => r.id_examen_pregunta === examenPreguntas[index]._id)
                    ? 'bg-green-500/30 text-green-200 border border-green-400/50'
                    : 'bg-white/10 text-white/60 hover:bg-white/20'
                }`}
                title={`Pregunta ${index + 1}`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {preguntaActualIndex < examenPreguntas.length - 1 ? (
            <motion.button
              onClick={handleSiguientePregunta}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-all border border-white/30"
            >
              Siguiente →
            </motion.button>
          ) : (
            <motion.button
              onClick={() => handleFinalizarExamen(false)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-semibold transition-all shadow-lg"
            >
              Finalizar Examen
            </motion.button>
          )}
        </div>

        {/* Indicador de progreso */}
        <div className="mt-8 bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
          <div className="flex justify-between text-white/60 text-sm mb-2">
            <span>Progreso del examen</span>
            <span>
              {respuestas.length} de {examenPreguntas.length} respondidas
            </span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(respuestas.length / examenPreguntas.length) * 100}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResolverExamenPage;
