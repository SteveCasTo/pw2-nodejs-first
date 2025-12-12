import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Examen, IntentoExamen } from '../types';
import { examenService, intentoExamenService } from '../services/dataService';

const IntentosExamenPage = () => {
  const { examenId } = useParams<{ examenId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [examen, setExamen] = useState<Examen | null>(null);
  const [intentos, setIntentos] = useState<IntentoExamen[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Verificar privilegios
  const userPrivileges = user?.privilegios?.map(p => p.id_privilegio.nombre_privilegio || p.id_privilegio.nombre) || [];
  const canView = userPrivileges.includes('superadmin') || 
                  userPrivileges.includes('editor') || 
                  userPrivileges.includes('organizador') ||
                  userPrivileges.includes('profesor');

  useEffect(() => {
    if (!canView) {
      navigate('/examenes');
      return;
    }
    fetchData();
  }, [examenId]);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      const [examenResponse, intentosResponse] = await Promise.all([
        examenService.getById(examenId!),
        intentoExamenService.getByExamen(examenId!),
      ]);

      setExamen(examenResponse.data);
      setIntentos(intentosResponse.data);
      setError('');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Error al cargar datos');
    } finally {
      setIsLoading(false);
    }
  };

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
            Intentos del Examen
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

        {/* Estadísticas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <div className="text-white/60 text-sm mb-2">Total Intentos</div>
            <div className="text-4xl font-bold text-white">{intentos.length}</div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <div className="text-white/60 text-sm mb-2">Completados</div>
            <div className="text-4xl font-bold text-green-300">
              {intentos.filter(i => i.completado).length}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <div className="text-white/60 text-sm mb-2">En Proceso</div>
            <div className="text-4xl font-bold text-yellow-300">
              {intentos.filter(i => !i.completado).length}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <div className="text-white/60 text-sm mb-2">Requieren Revisión</div>
            <div className="text-4xl font-bold text-orange-300">
              {intentos.filter(i => i.requiere_revision_manual).length}
            </div>
          </div>
        </motion.div>

        {/* Lista de intentos */}
        <div className="space-y-4">
          {intentos.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white/5 backdrop-blur-2xl rounded-2xl p-12 border border-white/10 text-center"
            >
              <p className="text-white/60 text-lg">
                Este examen no tiene intentos registrados aún.
              </p>
            </motion.div>
          ) : (
            intentos.map((intento, index) => (
              <motion.div
                key={intento._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/5 backdrop-blur-2xl rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="bg-blue-500/20 text-blue-200 font-bold rounded-lg px-4 py-2">
                        Intento #{intento.numero_intento}
                      </div>
                      
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        intento.completado
                          ? 'bg-green-500/20 text-green-200'
                          : 'bg-yellow-500/20 text-yellow-200'
                      }`}>
                        {intento.completado ? 'Completado' : 'En Proceso'}
                      </div>

                      {intento.requiere_revision_manual && (
                        <div className="px-3 py-1 rounded-full text-xs font-medium bg-orange-500/20 text-orange-200">
                          Requiere Revisión
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-white/60">Inicio:</span>
                        <div className="text-white font-medium">
                          {formatFecha(intento.fecha_inicio!)}
                        </div>
                      </div>

                      {intento.fecha_finalizacion && (
                        <div>
                          <span className="text-white/60">Finalización:</span>
                          <div className="text-white font-medium">
                            {formatFecha(intento.fecha_finalizacion)}
                          </div>
                        </div>
                      )}

                      {intento.calificacion !== undefined && intento.calificacion !== null && (
                        <div>
                          <span className="text-white/60">Calificación:</span>
                          <div className={`font-bold text-lg ${
                            intento.calificacion >= (examen.calificacion_minima || 60)
                              ? 'text-green-300'
                              : 'text-red-300'
                          }`}>
                            {intento.calificacion.toFixed(1)}%
                          </div>
                        </div>
                      )}

                      {intento.puntos_obtenidos !== undefined && intento.puntos_totales !== undefined && (
                        <div>
                          <span className="text-white/60">Puntos:</span>
                          <div className="text-white font-medium">
                            {intento.puntos_obtenidos.toFixed(2)} / {intento.puntos_totales.toFixed(2)}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {intento.completado && (
                    <motion.button
                      onClick={() => navigate(`/examenes/calificar/${intento._id}`)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg"
                    >
                      {intento.requiere_revision_manual ? '📝 Revisar y Calificar' : '👁️ Ver Detalles'}
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default IntentosExamenPage;
