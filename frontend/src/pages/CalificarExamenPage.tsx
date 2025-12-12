import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { 
  Examen, 
  IntentoExamen,
  ExamenPregunta,
  RespuestaSeleccion,
  RespuestaDesarrollo,
  RespuestaEmparejamiento,
  OpcionPregunta,
  ParEmparejamiento
} from '../types';
import { 
  examenService,
  intentoExamenService,
  examenPreguntaService,
  respuestaSeleccionService,
  respuestaDesarrolloService,
  respuestaEmparejamientoService,
  opcionPreguntaService,
  parEmparejamientoService
} from '../services/dataService';

const CalificarExamenPage = () => {
  const { intentoId } = useParams<{ intentoId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [intento, setIntento] = useState<IntentoExamen | null>(null);
  const [examen, setExamen] = useState<Examen | null>(null);
  const [examenPreguntas, setExamenPreguntas] = useState<ExamenPregunta[]>([]);
  const [respuestasSeleccion, setRespuestasSeleccion] = useState<RespuestaSeleccion[]>([]);
  const [respuestasDesarrollo, setRespuestasDesarrollo] = useState<RespuestaDesarrollo[]>([]);
  const [respuestasEmparejamiento, setRespuestasEmparejamiento] = useState<RespuestaEmparejamiento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [calificando, setCalificando] = useState<string | null>(null);
  const [puntosInput, setPuntosInput] = useState('');
  const [comentarioInput, setComentarioInput] = useState('');

  // Verificar privilegios
  const userPrivileges = user?.privilegios?.map(p => p.id_privilegio.nombre_privilegio || p.id_privilegio.nombre) || [];
  const canCalificar = userPrivileges.includes('superadmin') || 
                       userPrivileges.includes('editor') || 
                       userPrivileges.includes('organizador') ||
                       userPrivileges.includes('profesor');

  useEffect(() => {
    if (!canCalificar) {
      navigate('/examenes');
      return;
    }
    fetchData();
  }, [intentoId]);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      // Cargar intento
      const intentoResponse = await intentoExamenService.getById(intentoId!);
      setIntento(intentoResponse.data);

      // Cargar examen
      const examenId = typeof intentoResponse.data.id_examen === 'string' 
        ? intentoResponse.data.id_examen 
        : (intentoResponse.data.id_examen as any)._id;
      
      const examenResponse = await examenService.getById(examenId);
      setExamen(examenResponse.data);

      // Cargar preguntas del examen
      const preguntasResponse = await examenPreguntaService.getByExamen(examenId);
      setExamenPreguntas(preguntasResponse.data);

      // Cargar respuestas
      const [seleccionRes, desarrolloRes, emparejamientoRes] = await Promise.all([
        respuestaSeleccionService.getByIntento(intentoId!),
        respuestaDesarrolloService.getByIntento(intentoId!),
        respuestaEmparejamientoService.getByIntento(intentoId!),
      ]);

      setRespuestasSeleccion(seleccionRes.data);
      setRespuestasDesarrollo(desarrolloRes.data);
      setRespuestasEmparejamiento(emparejamientoRes.data);

      setError('');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Error al cargar datos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCalificarDesarrollo = async (respuestaId: string) => {
    try {
      const puntos = parseFloat(puntosInput);
      if (isNaN(puntos) || puntos < 0) {
        setError('Puntos inválidos');
        return;
      }

      await respuestaDesarrolloService.calificar(respuestaId, puntos, comentarioInput);
      
      setCalificando(null);
      setPuntosInput('');
      setComentarioInput('');
      await fetchData();
      setError('');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Error al calificar');
    }
  };

  const calcularCalificacionTotal = () => {
    let puntosObtenidos = 0;
    let puntosTotales = 0;

    examenPreguntas.forEach(ep => {
      const pregunta = typeof ep.id_pregunta === 'object' ? ep.id_pregunta : null;
      if (!pregunta) return;

      const puntosAsignados = ep.puntos_asignados || pregunta.puntos_recomendados;
      puntosTotales += puntosAsignados;

      // Buscar respuesta según tipo de pregunta
      if (pregunta.tipo_pregunta === 'seleccion_multiple' || pregunta.tipo_pregunta === 'verdadero_falso') {
        const respuesta = respuestasSeleccion.find(r => r.id_examen_pregunta === ep._id);
        if (respuesta?.es_correcta) {
          puntosObtenidos += puntosAsignados;
        }
      } else if (pregunta.tipo_pregunta === 'desarrollo' || pregunta.tipo_pregunta === 'respuesta_corta') {
        const respuesta = respuestasDesarrollo.find(r => r.id_examen_pregunta === ep._id);
        if (respuesta?.calificada && respuesta.puntos_obtenidos !== undefined) {
          puntosObtenidos += respuesta.puntos_obtenidos;
        }
      } else if (pregunta.tipo_pregunta === 'emparejamiento') {
        const respuestas = respuestasEmparejamiento.filter(r => r.id_examen_pregunta === ep._id);
        const correctas = respuestas.filter(r => r.es_correcto).length;
        if (respuestas.length > 0) {
          puntosObtenidos += (correctas / respuestas.length) * puntosAsignados;
        }
      }
    });

    return { puntosObtenidos, puntosTotales };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-2xl">Cargando...</div>
      </div>
    );
  }

  if (!intento || !examen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-2xl">Intento no encontrado</div>
      </div>
    );
  }

  const { puntosObtenidos, puntosTotales } = calcularCalificacionTotal();
  const calificacionPorcentaje = puntosTotales > 0 ? (puntosObtenidos / puntosTotales) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900">
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
          
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 mb-2">
            Calificar Examen
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

        {/* Resumen de calificación */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Resumen de Calificación</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white/5 p-6 rounded-xl">
              <div className="text-white/60 text-sm mb-2">Puntos Obtenidos</div>
              <div className="text-3xl font-bold text-green-300">
                {puntosObtenidos.toFixed(2)}
              </div>
            </div>

            <div className="bg-white/5 p-6 rounded-xl">
              <div className="text-white/60 text-sm mb-2">Puntos Totales</div>
              <div className="text-3xl font-bold text-white">
                {puntosTotales.toFixed(2)}
              </div>
            </div>

            <div className="bg-white/5 p-6 rounded-xl">
              <div className="text-white/60 text-sm mb-2">Calificación</div>
              <div className={`text-3xl font-bold ${
                calificacionPorcentaje >= (examen.calificacion_minima || 60)
                  ? 'text-green-300'
                  : 'text-red-300'
              }`}>
                {calificacionPorcentaje.toFixed(1)}%
              </div>
            </div>

            <div className="bg-white/5 p-6 rounded-xl">
              <div className="text-white/60 text-sm mb-2">Estado</div>
              <div className={`text-xl font-bold ${
                intento.completado 
                  ? (calificacionPorcentaje >= (examen.calificacion_minima || 60) ? 'text-green-300' : 'text-red-300')
                  : 'text-yellow-300'
              }`}>
                {!intento.completado 
                  ? 'En Proceso'
                  : calificacionPorcentaje >= (examen.calificacion_minima || 60)
                  ? 'Aprobado'
                  : 'Reprobado'
                }
              </div>
            </div>
          </div>
        </motion.div>

        {/* Respuestas por pregunta */}
        <div className="space-y-6">
          {examenPreguntas.map((ep, index) => {
            const pregunta = typeof ep.id_pregunta === 'object' ? ep.id_pregunta : null;
            if (!pregunta) return null;

            return (
              <PreguntaRespuesta
                key={ep._id}
                numero={index + 1}
                examenPregunta={ep}
                pregunta={pregunta}
                respuestasSeleccion={respuestasSeleccion}
                respuestasDesarrollo={respuestasDesarrollo}
                respuestasEmparejamiento={respuestasEmparejamiento}
                calificando={calificando}
                setCalificando={setCalificando}
                puntosInput={puntosInput}
                setPuntosInput={setPuntosInput}
                comentarioInput={comentarioInput}
                setComentarioInput={setComentarioInput}
                handleCalificarDesarrollo={handleCalificarDesarrollo}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Componente auxiliar para mostrar cada pregunta y su respuesta
const PreguntaRespuesta = ({ 
  numero, 
  examenPregunta, 
  pregunta,
  respuestasSeleccion,
  respuestasDesarrollo,
  respuestasEmparejamiento,
  calificando,
  setCalificando,
  puntosInput,
  setPuntosInput,
  comentarioInput,
  setComentarioInput,
  handleCalificarDesarrollo
}: any) => {
  const [opciones, setOpciones] = useState<OpcionPregunta[]>([]);
  const [pares, setPares] = useState<ParEmparejamiento[]>([]);

  useEffect(() => {
    if (pregunta.tipo_pregunta === 'seleccion_multiple' || pregunta.tipo_pregunta === 'verdadero_falso') {
      opcionPreguntaService.getByPregunta(pregunta._id).then(res => setOpciones(res.data));
    } else if (pregunta.tipo_pregunta === 'emparejamiento') {
      parEmparejamientoService.getByPregunta(pregunta._id).then(res => setPares(res.data));
    }
  }, [pregunta]);

  const getRespuesta = () => {
    if (pregunta.tipo_pregunta === 'seleccion_multiple' || pregunta.tipo_pregunta === 'verdadero_falso') {
      return respuestasSeleccion.find((r: RespuestaSeleccion) => r.id_examen_pregunta === examenPregunta._id);
    } else if (pregunta.tipo_pregunta === 'desarrollo' || pregunta.tipo_pregunta === 'respuesta_corta') {
      return respuestasDesarrollo.find((r: RespuestaDesarrollo) => r.id_examen_pregunta === examenPregunta._id);
    } else if (pregunta.tipo_pregunta === 'emparejamiento') {
      return respuestasEmparejamiento.filter((r: RespuestaEmparejamiento) => r.id_examen_pregunta === examenPregunta._id);
    }
    return null;
  };

  const respuesta = getRespuesta();
  const puntosAsignados = examenPregunta.puntos_asignados || pregunta.puntos_recomendados;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: numero * 0.05 }}
      className="bg-white/5 backdrop-blur-2xl rounded-2xl p-6 border border-white/10"
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="bg-indigo-500/20 text-indigo-200 font-bold rounded-lg px-4 py-2 text-lg">
          {numero}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-white mb-2">
            {pregunta.titulo_pregunta}
          </h3>
          <div className="flex gap-2">
            <span className="text-xs bg-blue-500/20 text-blue-200 px-3 py-1 rounded-full">
              {puntosAsignados} puntos
            </span>
            <span className="text-xs bg-purple-500/20 text-purple-200 px-3 py-1 rounded-full">
              {pregunta.tipo_pregunta.replace(/_/g, ' ')}
            </span>
          </div>
        </div>
      </div>

      {/* Mostrar respuesta según tipo */}
      <div className="ml-16">
        {/* Selección Múltiple / Verdadero Falso */}
        {(pregunta.tipo_pregunta === 'seleccion_multiple' || pregunta.tipo_pregunta === 'verdadero_falso') && respuesta && (
          <div className="space-y-2">
            {opciones.map(opcion => {
              const esSeleccionada = (respuesta as RespuestaSeleccion).id_opcion_seleccionada === opcion._id;
              const esCorrecta = opcion.es_correcta;

              return (
                <div
                  key={opcion._id}
                  className={`p-3 rounded-lg border-2 ${
                    esSeleccionada && esCorrecta
                      ? 'bg-green-500/20 border-green-400/60 text-green-200'
                      : esSeleccionada && !esCorrecta
                      ? 'bg-red-500/20 border-red-400/60 text-red-200'
                      : esCorrecta
                      ? 'bg-blue-500/10 border-blue-400/40 text-blue-200'
                      : 'bg-white/5 border-white/20 text-white/60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {esSeleccionada && (esCorrecta ? '✅' : '❌')}
                    {!esSeleccionada && esCorrecta && '✓'}
                    <span>{opcion.texto_opcion}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Desarrollo / Respuesta Corta */}
        {(pregunta.tipo_pregunta === 'desarrollo' || pregunta.tipo_pregunta === 'respuesta_corta') && respuesta && (
          <div>
            <div className="bg-white/5 p-4 rounded-lg mb-4">
              <div className="text-white/60 text-sm mb-2">Respuesta del estudiante:</div>
              <div className="text-white whitespace-pre-wrap">
                {(respuesta as RespuestaDesarrollo).respuesta_texto}
              </div>
            </div>

            {(respuesta as RespuestaDesarrollo).calificada ? (
              <div className="bg-green-500/10 border border-green-400/30 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-green-200 font-semibold">✅ Calificada</span>
                  <span className="text-green-300 font-bold">
                    {(respuesta as RespuestaDesarrollo).puntos_obtenidos} / {puntosAsignados} puntos
                  </span>
                </div>
                {(respuesta as RespuestaDesarrollo).comentario_calificador && (
                  <div className="text-white/80 text-sm mt-2">
                    <strong>Comentario:</strong> {(respuesta as RespuestaDesarrollo).comentario_calificador}
                  </div>
                )}
              </div>
            ) : (
              calificando === (respuesta as RespuestaDesarrollo)._id ? (
                <div className="bg-white/5 p-4 rounded-lg">
                  <div className="mb-4">
                    <label className="block text-white/90 text-sm mb-2">
                      Puntos obtenidos (máximo {puntosAsignados})
                    </label>
                    <input
                      type="number"
                      value={puntosInput}
                      onChange={(e) => setPuntosInput(e.target.value)}
                      min="0"
                      max={puntosAsignados}
                      step="0.5"
                      className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-white/90 text-sm mb-2">
                      Comentario (opcional)
                    </label>
                    <textarea
                      value={comentarioInput}
                      onChange={(e) => setComentarioInput(e.target.value)}
                      className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      onClick={() => handleCalificarDesarrollo((respuesta as RespuestaDesarrollo)._id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition-all"
                    >
                      Guardar Calificación
                    </motion.button>
                    <motion.button
                      onClick={() => {
                        setCalificando(null);
                        setPuntosInput('');
                        setComentarioInput('');
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
                    >
                      Cancelar
                    </motion.button>
                  </div>
                </div>
              ) : (
                <motion.button
                  onClick={() => {
                    setCalificando((respuesta as RespuestaDesarrollo)._id);
                    setPuntosInput(puntosAsignados.toString());
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-3 rounded-lg font-semibold transition-all"
                >
                  📝 Calificar Respuesta
                </motion.button>
              )
            )}
          </div>
        )}

        {/* Emparejamiento */}
        {pregunta.tipo_pregunta === 'emparejamiento' && Array.isArray(respuesta) && (
          <div className="space-y-2">
            {pares.map(par => {
              const resp = (respuesta as RespuestaEmparejamiento[]).find(r => r.id_par === par._id);
              const esCorrecta = resp?.es_correcto;

              return (
                <div
                  key={par._id}
                  className={`p-3 rounded-lg border-2 ${
                    esCorrecta
                      ? 'bg-green-500/20 border-green-400/60 text-green-200'
                      : 'bg-red-500/20 border-red-400/60 text-red-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {esCorrecta ? '✅' : '❌'}
                    <span>{par.texto_pregunta}</span>
                    <span className="mx-2">→</span>
                    <span>{par.texto_respuesta}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!respuesta && (
          <div className="text-white/40 italic">Sin respuesta</div>
        )}
      </div>
    </motion.div>
  );
};

export default CalificarExamenPage;
