import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Examen, Ciclo } from '../types';
import { examenService, cicloService } from '../services/dataService';

const ExamenesPage = () => {
  const [examenes, setExamenes] = useState<Examen[]>([]);
  const [ciclos, setCiclos] = useState<Ciclo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    id_ciclo: '',
    fecha_inicio: '',
    fecha_fin: '',
    duracion_minutos: '',
    intentos_permitidos: '1',
    calificacion_minima: '',
    mostrar_resultados: true,
    aleatorizar_preguntas: false,
    aleatorizar_opciones: false,
    activo: true,
  });
  const navigate = useNavigate();
  const { user } = useAuth();

  // Verificar privilegios
  const userPrivileges = user?.privilegios?.map(p => p.id_privilegio.nombre_privilegio || p.id_privilegio.nombre) || [];
  const canEdit = userPrivileges.includes('superadmin') || userPrivileges.includes('editor');
  const isEstudiante = userPrivileges.includes('estudiante');

  useEffect(() => {
    fetchExamenes();
    if (canEdit) {
      fetchCiclos();
    }
  }, []);

  const fetchExamenes = async () => {
    try {
      setIsLoading(true);
      const response = await examenService.getAll();
      setExamenes(response.data);
      setError('');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Error al cargar exámenes');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCiclos = async () => {
    try {
      const response = await cicloService.getAll();
      setCiclos(response.data);
    } catch (err: unknown) {
      console.error('Error al cargar ciclos:', err);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (!formData.fecha_inicio || !formData.fecha_fin) {
        setError('Las fechas de inicio y fin son obligatorias');
        return;
      }

      const dataToSend: any = {
        titulo: formData.titulo,
        id_ciclo: formData.id_ciclo,
        fecha_inicio: formData.fecha_inicio,
        fecha_fin: formData.fecha_fin,
        intentos_permitidos: parseInt(formData.intentos_permitidos) || 1,
        mostrar_resultados: formData.mostrar_resultados,
        aleatorizar_preguntas: formData.aleatorizar_preguntas,
        aleatorizar_opciones: formData.aleatorizar_opciones,
        activo: formData.activo,
      };

      if (formData.descripcion) {
        dataToSend.descripcion = formData.descripcion;
      }

      if (formData.duracion_minutos) {
        dataToSend.duracion_minutos = parseInt(formData.duracion_minutos);
      }

      if (formData.calificacion_minima) {
        dataToSend.calificacion_minima = parseFloat(formData.calificacion_minima);
      }

      if (editingId) {
        await examenService.update(editingId, dataToSend);
      } else {
        await examenService.create(dataToSend);
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({
        titulo: '',
        descripcion: '',
        id_ciclo: '',
        fecha_inicio: '',
        fecha_fin: '',
        duracion_minutos: '',
        intentos_permitidos: '1',
        calificacion_minima: '',
        mostrar_resultados: true,
        aleatorizar_preguntas: false,
        aleatorizar_opciones: false,
        activo: true,
      });
      setError('');
      fetchExamenes();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string; error?: string } } };
      setError(error.response?.data?.error || error.response?.data?.message || 'Error al guardar examen');
    }
  };

  const handleEdit = (examen: Examen) => {
    if (!canEdit) return;

    setEditingId(examen._id);

    const formatDateForInput = (dateString: string) => {
      const date = new Date(dateString);
      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const day = String(date.getUTCDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    setFormData({
      titulo: examen.titulo,
      descripcion: examen.descripcion || '',
      id_ciclo: typeof examen.id_ciclo === 'object' ? examen.id_ciclo._id : examen.id_ciclo,
      fecha_inicio: formatDateForInput(examen.fecha_inicio),
      fecha_fin: formatDateForInput(examen.fecha_fin),
      duracion_minutos: examen.duracion_minutos?.toString() || '',
      intentos_permitidos: examen.intentos_permitidos.toString(),
      calificacion_minima: examen.calificacion_minima?.toString() || '',
      mostrar_resultados: examen.mostrar_resultados,
      aleatorizar_preguntas: examen.aleatorizar_preguntas,
      aleatorizar_opciones: examen.aleatorizar_opciones,
      activo: examen.activo,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!canEdit) return;
    if (!window.confirm('¿Estás seguro de eliminar este examen?')) return;
    try {
      await examenService.delete(id);
      fetchExamenes();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Error al eliminar examen');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      titulo: '',
      descripcion: '',
      id_ciclo: '',
      fecha_inicio: '',
      fecha_fin: '',
      duracion_minutos: '',
      intentos_permitidos: '1',
      calificacion_minima: '',
      mostrar_resultados: true,
      aleatorizar_preguntas: false,
      aleatorizar_opciones: false,
      activo: true,
    });
    setError('');
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No definida';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      timeZone: 'UTC'
    });
  };

  const getExamenStatus = (examen: Examen) => {
    const now = new Date();
    const inicio = new Date(examen.fecha_inicio);
    const fin = new Date(examen.fecha_fin);

    if (!examen.activo) return { text: 'Inactivo', color: 'bg-gray-500/30 text-gray-200 border-gray-400/50' };
    if (now < inicio) return { text: 'Próximo', color: 'bg-blue-500/30 text-blue-200 border-blue-400/50' };
    if (now >= inicio && now <= fin) return { text: 'En Curso', color: 'bg-green-500/30 text-green-200 border-green-400/50' };
    return { text: 'Finalizado', color: 'bg-red-500/30 text-red-200 border-red-400/50' };
  };

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900">
      <div className="relative z-10 w-full h-full flex flex-col overflow-y-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center px-8 py-6 bg-gradient-to-r from-green-900/30 to-emerald-900/30 backdrop-blur-md border-b border-white/10"
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
                <span className="text-5xl">📝</span>
                Exámenes
              </h1>
            </div>
          </div>
          
          {canEdit && (
            <button
              onClick={() => {
                setEditingId(null);
                setFormData({
                  titulo: '',
                  descripcion: '',
                  id_ciclo: '',
                  fecha_inicio: '',
                  fecha_fin: '',
                  duracion_minutos: '',
                  intentos_permitidos: '1',
                  calificacion_minima: '',
                  mostrar_resultados: true,
                  aleatorizar_preguntas: false,
                  aleatorizar_opciones: false,
                  activo: true,
                });
                setShowForm(true);
              }}
              className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-medium shadow-lg transition-all"
            >
              + Nuevo Examen
            </button>
          )}
        </motion.div>

        {/* Content */}
        <div className="flex-1 px-8 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Form Modal */}
            {showForm && canEdit && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                onClick={handleCancel}
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white/10 backdrop-blur-2xl rounded-2xl p-8 border border-white/20 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                  style={{
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                  }}
                >
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 bg-red-500/20 border border-red-500/50 text-red-100 px-4 py-3 rounded-xl text-sm"
                    >
                      {error}
                    </motion.div>
                  )}

                  <h2 className="text-3xl font-bold text-white mb-6">
                    {editingId ? 'Editar Examen' : 'Nuevo Examen'}
                  </h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-white/90 mb-2">
                          Título del Examen
                        </label>
                        <input
                          type="text"
                          value={formData.titulo}
                          onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                          required
                          className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                          placeholder="Ej: Examen Final de Matemáticas"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-white/90 mb-2">
                          Descripción (opcional)
                        </label>
                        <textarea
                          value={formData.descripcion}
                          onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                          className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                          placeholder="Describe el examen..."
                          rows={3}
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-white/90 mb-2">
                          Ciclo
                        </label>
                        <select
                          value={formData.id_ciclo}
                          onChange={(e) => setFormData({ ...formData, id_ciclo: e.target.value })}
                          required
                          className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        >
                          <option value="">Seleccionar ciclo</option>
                          {ciclos.filter(c => c.activo).map(ciclo => (
                            <option key={ciclo._id} value={ciclo._id} className="bg-gray-800">
                              {ciclo.nombre_ciclo}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white/90 mb-2">
                          Fecha Inicio
                        </label>
                        <input
                          type="date"
                          value={formData.fecha_inicio}
                          onChange={(e) => setFormData({ ...formData, fecha_inicio: e.target.value })}
                          required
                          className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white/90 mb-2">
                          Fecha Fin
                        </label>
                        <input
                          type="date"
                          value={formData.fecha_fin}
                          onChange={(e) => setFormData({ ...formData, fecha_fin: e.target.value })}
                          required
                          className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white/90 mb-2">
                          Duración (minutos)
                        </label>
                        <input
                          type="number"
                          value={formData.duracion_minutos}
                          onChange={(e) => setFormData({ ...formData, duracion_minutos: e.target.value })}
                          min="0"
                          className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                          placeholder="60"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white/90 mb-2">
                          Intentos Permitidos
                        </label>
                        <input
                          type="number"
                          value={formData.intentos_permitidos}
                          onChange={(e) => setFormData({ ...formData, intentos_permitidos: e.target.value })}
                          min="1"
                          required
                          className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-white/90 mb-2">
                          Calificación Mínima (%)
                        </label>
                        <input
                          type="number"
                          value={formData.calificacion_minima}
                          onChange={(e) => setFormData({ ...formData, calificacion_minima: e.target.value })}
                          min="0"
                          max="100"
                          step="0.1"
                          className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                          placeholder="70"
                        />
                      </div>

                      <div className="col-span-2 space-y-3">
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            id="mostrar_resultados"
                            checked={formData.mostrar_resultados}
                            onChange={(e) => setFormData({ ...formData, mostrar_resultados: e.target.checked })}
                            className="w-5 h-5 rounded border-white/30 bg-white/10 text-green-500 focus:ring-green-500 focus:ring-offset-0"
                          />
                          <label htmlFor="mostrar_resultados" className="text-white/90 font-medium">
                            Mostrar Resultados
                          </label>
                        </div>

                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            id="aleatorizar_preguntas"
                            checked={formData.aleatorizar_preguntas}
                            onChange={(e) => setFormData({ ...formData, aleatorizar_preguntas: e.target.checked })}
                            className="w-5 h-5 rounded border-white/30 bg-white/10 text-green-500 focus:ring-green-500 focus:ring-offset-0"
                          />
                          <label htmlFor="aleatorizar_preguntas" className="text-white/90 font-medium">
                            Aleatorizar Preguntas
                          </label>
                        </div>

                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            id="aleatorizar_opciones"
                            checked={formData.aleatorizar_opciones}
                            onChange={(e) => setFormData({ ...formData, aleatorizar_opciones: e.target.checked })}
                            className="w-5 h-5 rounded border-white/30 bg-white/10 text-green-500 focus:ring-green-500 focus:ring-offset-0"
                          />
                          <label htmlFor="aleatorizar_opciones" className="text-white/90 font-medium">
                            Aleatorizar Opciones
                          </label>
                        </div>

                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            id="activo"
                            checked={formData.activo}
                            onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                            className="w-5 h-5 rounded border-white/30 bg-white/10 text-green-500 focus:ring-green-500 focus:ring-offset-0"
                          />
                          <label htmlFor="activo" className="text-white/90 font-medium">
                            Activo
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all border border-white/20"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-medium shadow-lg transition-all"
                      >
                        {editingId ? 'Actualizar' : 'Crear'}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            )}

            {/* Exámenes Grid */}
            {isLoading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-white/20 border-t-white"></div>
                <p className="text-white/70 mt-4">Cargando exámenes...</p>
              </div>
            ) : examenes.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-white/70 text-lg">No hay exámenes registrados</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                {examenes.map((examen, index) => {
                  const status = getExamenStatus(examen);
                  const ciclo = typeof examen.id_ciclo === 'object' ? examen.id_ciclo : null;

                  return (
                    <motion.div
                      key={examen._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white/5 backdrop-blur-2xl rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all group"
                      style={{
                        boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.3)'
                      }}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-white group-hover:text-green-300 transition-colors">
                            {examen.titulo}
                          </h3>
                          {examen.descripcion && (
                            <p className="text-white/60 text-sm mt-1">{examen.descripcion}</p>
                          )}
                        </div>
                        
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                          {status.text}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="mb-4 space-y-2">
                        {ciclo && (
                          <div className="flex items-center gap-2 text-white/70 text-sm">
                            <span className="text-green-300">📅 Ciclo:</span>
                            <span>{ciclo.nombre_ciclo}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-white/70 text-sm">
                          <span className="text-green-300">🗓️ Inicio:</span>
                          <span>{formatDate(examen.fecha_inicio)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/70 text-sm">
                          <span className="text-green-300">🗓️ Fin:</span>
                          <span>{formatDate(examen.fecha_fin)}</span>
                        </div>
                        {examen.duracion_minutos && (
                          <div className="flex items-center gap-2 text-white/70 text-sm">
                            <span className="text-green-300">⏱️ Duración:</span>
                            <span>{examen.duracion_minutos} minutos</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-white/70 text-sm">
                          <span className="text-green-300">🔄 Intentos:</span>
                          <span>{examen.intentos_permitidos}</span>
                        </div>
                      </div>

                      {/* Botones */}
                      {canEdit ? (
                        <div className="flex gap-2 mt-4">
                          <motion.button
                            onClick={() => handleEdit(examen)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex-1 bg-blue-500/20 hover:bg-blue-500/40 text-blue-200 rounded-lg transition-all border border-blue-400/30 flex items-center justify-center text-xs font-medium py-2"
                            title="Editar examen"
                          >
                            Editar
                          </motion.button>
                          <motion.button
                            onClick={() => handleDelete(examen._id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex-1 bg-red-500/20 hover:bg-red-500/40 text-red-200 rounded-lg transition-all border border-red-400/30 flex items-center justify-center text-xs font-medium py-2"
                            title="Eliminar examen"
                          >
                            Eliminar
                          </motion.button>
                        </div>
                      ) : isEstudiante && status.text === 'En Curso' ? (
                        <div className="mt-4">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg transition-all flex items-center justify-center text-sm font-medium py-3"
                            title="Resolver examen"
                          >
                            📝 Resolver Examen
                          </motion.button>
                        </div>
                      ) : null}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamenesPage;
