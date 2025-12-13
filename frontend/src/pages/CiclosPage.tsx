import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { Ciclo } from '../types';
import { cicloService } from '../services/dataService';

const CiclosPage = () => {
  const [ciclos, setCiclos] = useState<Ciclo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nombre_ciclo: '',
    descripcion: '',
    fecha_inicio: '',
    fecha_fin: '',
    activo: true,
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchCiclos();
  }, []);

  const fetchCiclos = async () => {
    try {
      setIsLoading(true);
      const response = await cicloService.getAll();
      setCiclos(response.data);
      setError('');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Error al cargar ciclos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      // Validar que las fechas estén presentes
      if (!formData.fecha_inicio || !formData.fecha_fin) {
        setError('Las fechas de inicio y fin son obligatorias');
        return;
      }

      // Preparar datos para enviar
      const dataToSend: Record<string, unknown> = {
        nombre_ciclo: formData.nombre_ciclo,
        fecha_inicio: formData.fecha_inicio,
        fecha_fin: formData.fecha_fin,
        activo: formData.activo,
      };

      if (formData.descripcion) {
        dataToSend.descripcion = formData.descripcion;
      }

      if (editingId) {
        await cicloService.update(editingId, dataToSend);
      } else {
        await cicloService.create(dataToSend);
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({ nombre_ciclo: '', descripcion: '', fecha_inicio: '', fecha_fin: '', activo: true });
      fetchCiclos();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string; error?: string } } };
      setError(error.response?.data?.error || error.response?.data?.message || 'Error al guardar ciclo');
    }
  };

  const handleEdit = (ciclo: Ciclo) => {
    setEditingId(ciclo._id);
    
    // Formatear fechas sin problemas de zona horaria
    const formatDateForInput = (dateString: string) => {
      const date = new Date(dateString);
      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const day = String(date.getUTCDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    
    setFormData({
      nombre_ciclo: ciclo.nombre_ciclo,
      descripcion: ciclo.descripcion || '',
      fecha_inicio: ciclo.fecha_inicio ? formatDateForInput(ciclo.fecha_inicio) : '',
      fecha_fin: ciclo.fecha_fin ? formatDateForInput(ciclo.fecha_fin) : '',
      activo: ciclo.activo,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de eliminar este ciclo?')) return;
    try {
      await cicloService.delete(id);
      fetchCiclos();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Error al eliminar ciclo');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ nombre_ciclo: '', descripcion: '', fecha_inicio: '', fecha_fin: '', activo: true });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No definida';
    const date = new Date(dateString);
    // Usar UTC para evitar problemas de zona horaria
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      timeZone: 'UTC'
    });
  };

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900">
      <div className="relative z-10 w-full h-full flex flex-col overflow-y-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center px-8 py-6 bg-gradient-to-r from-indigo-900/30 to-blue-900/30 backdrop-blur-md border-b border-white/10"
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
                <span className="text-5xl">📅</span>
                Ciclos
              </h1>
            </div>
          </div>
          
          <button
            onClick={() => {
              setEditingId(null);
              setFormData({ nombre_ciclo: '', descripcion: '', fecha_inicio: '', fecha_fin: '', activo: true });
              setShowForm(true);
            }}
            className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white rounded-xl font-medium shadow-lg transition-all"
          >
            + Nuevo Ciclo
          </button>
        </motion.div>

        {/* Content */}
        <div className="flex-1 px-8 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Form Modal */}
            {showForm && (
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
                  className="bg-white/10 backdrop-blur-2xl rounded-2xl p-8 border border-white/20 max-w-md w-full"
                  style={{
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                  }}
                >
                  {/* Error message inside modal */}
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
                    {editingId ? 'Editar Ciclo' : 'Nuevo Ciclo'}
                  </h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-2">
                        Nombre del Ciclo
                      </label>
                      <input
                        type="text"
                        value={formData.nombre_ciclo}
                        onChange={(e) => setFormData({ ...formData, nombre_ciclo: e.target.value })}
                        required
                        pattern="^[1-4]/\d{4}$"
                        title="El formato debe ser: ciclo/año (Ejemplo: 1/2025)"
                        className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        placeholder="1/2025"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-2">
                        Descripción (opcional)
                      </label>
                      <textarea
                        value={formData.descripcion}
                        onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                        className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                        placeholder="Describe el ciclo..."
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-white/90 mb-2">
                          Fecha Inicio
                        </label>
                        <input
                          type="date"
                          value={formData.fecha_inicio}
                          onChange={(e) => setFormData({ ...formData, fecha_inicio: e.target.value })}
                          required
                          className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
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
                          className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="activo"
                        checked={formData.activo}
                        onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                        className="w-5 h-5 rounded border-white/30 bg-white/10 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-0"
                      />
                      <label htmlFor="activo" className="text-white/90 font-medium">
                        Activo
                      </label>
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
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white rounded-xl font-medium shadow-lg transition-all"
                      >
                        {editingId ? 'Actualizar' : 'Crear'}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            )}

            {/* Ciclos Grid */}
            {isLoading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-white/20 border-t-white"></div>
                <p className="text-white/70 mt-4">Cargando ciclos...</p>
              </div>
            ) : ciclos.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-white/70 text-lg">No hay ciclos registrados</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                {ciclos.map((ciclo, index) => (
                  <motion.div
                    key={ciclo._id}
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
                        <h3 className="text-2xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                          {ciclo.nombre_ciclo}
                        </h3>
                        {ciclo.descripcion && (
                          <p className="text-white/60 text-sm mt-1">{ciclo.descripcion}</p>
                        )}
                      </div>
                      
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        ciclo.activo 
                          ? 'bg-green-500/30 text-green-200 border border-green-400/50' 
                          : 'bg-red-500/30 text-red-200 border border-red-400/50'
                      }`}>
                        {ciclo.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>

                    {/* Fechas */}
                    <div className="mb-4 space-y-2">
                      <div className="flex items-center gap-2 text-white/70 text-sm">
                        <span className="text-indigo-300">📅 Inicio:</span>
                        <span>{formatDate(ciclo.fecha_inicio)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/70 text-sm">
                        <span className="text-indigo-300">📅 Fin:</span>
                        <span>{formatDate(ciclo.fecha_fin)}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <motion.button
                        onClick={() => handleEdit(ciclo)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 bg-blue-500/20 hover:bg-blue-500/40 text-blue-200 rounded-lg transition-all border border-blue-400/30 flex items-center justify-center text-xs font-medium py-2"
                        title="Editar ciclo"
                      >
                        Editar
                      </motion.button>
                      <motion.button
                        onClick={() => handleDelete(ciclo._id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 bg-red-500/20 hover:bg-red-500/40 text-red-200 rounded-lg transition-all border border-red-400/30 flex items-center justify-center text-xs font-medium py-2"
                        title="Eliminar ciclo"
                      >
                        Eliminar
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CiclosPage;
