import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { Categoria, Subcategoria } from '../types';
import { categoriaService, subcategoriaService } from '../services/dataService';

const CategoriasPage = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showSubcategoriaForm, setShowSubcategoriaForm] = useState(false);
  const [selectedCategoriaId, setSelectedCategoriaId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState({
    nombre_categoria: '',
    activo: true,
  });
  const [subcategoriaFormData, setSubcategoriaFormData] = useState({
    nombre_subcategoria: '',
    descripcion: '',
    activo: true,
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      setIsLoading(true);
      const response = await categoriaService.getAll();
      
      // Cargar subcategorías para cada categoría
      const categoriasConSubcategorias = await Promise.all(
        response.data.map(async (categoria) => {
          try {
            const subcategoriasResponse = await subcategoriaService.getByCategoria(categoria._id);
            return {
              ...categoria,
              subcategorias: subcategoriasResponse.data || [],
            };
          } catch {
            return {
              ...categoria,
              subcategorias: [],
            };
          }
        })
      );
      
      setCategorias(categoriasConSubcategorias);
      setError('');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Error al cargar categorías');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await categoriaService.update(editingId, formData);
      } else {
        await categoriaService.create(formData);
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({ nombre_categoria: '', activo: true });
      fetchCategorias();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Error al guardar categoría');
    }
  };

  const handleEdit = (categoria: Categoria) => {
    setEditingId(categoria._id);
    setFormData({
      nombre_categoria: categoria.nombre_categoria,
      activo: categoria.activo,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de eliminar esta categoría?')) return;
    try {
      await categoriaService.delete(id);
      fetchCategorias();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Error al eliminar categoría');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ nombre_categoria: '', activo: true });
  };

  const handleAddSubcategoria = (categoriaId: string) => {
    setSelectedCategoriaId(categoriaId);
    setSubcategoriaFormData({ nombre_subcategoria: '', descripcion: '', activo: true });
    setShowSubcategoriaForm(true);
  };

  const handleSubmitSubcategoria = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedCategoriaId) return;
    
    try {
      await subcategoriaService.create({
        ...subcategoriaFormData,
        id_categoria: selectedCategoriaId,
      });
      setShowSubcategoriaForm(false);
      setSelectedCategoriaId(null);
      setSubcategoriaFormData({ nombre_subcategoria: '', descripcion: '', activo: true });
      fetchCategorias();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Error al crear subcategoría');
    }
  };

  const handleCancelSubcategoria = () => {
    setShowSubcategoriaForm(false);
    setSelectedCategoriaId(null);
    setSubcategoriaFormData({ nombre_subcategoria: '', descripcion: '', activo: true });
  };

  const handleDeleteSubcategoria = async (subcategoriaId: string) => {
    if (!window.confirm('¿Estás seguro de eliminar esta subcategoría?')) return;
    try {
      await subcategoriaService.delete(subcategoriaId);
      fetchCategorias();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Error al eliminar subcategoría');
    }
  };

  const toggleSubcategorias = (categoriaId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoriaId)) {
        newSet.delete(categoriaId);
      } else {
        newSet.add(categoriaId);
      }
      return newSet;
    });
  };

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-gradient-to-br from-blue-900 via-cyan-900 to-teal-900">
      <div className="relative z-10 w-full h-full flex flex-col overflow-y-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center px-8 py-6 bg-gradient-to-r from-blue-900/30 to-cyan-900/30 backdrop-blur-md border-b border-white/10"
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
                <span className="text-5xl">📚</span>
                Categorías
              </h1>
            </div>
          </div>
          
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-xl font-medium shadow-lg transition-all"
          >
            + Nueva Categoría
          </button>
        </motion.div>

        {/* Content */}
        <div className="flex-1 px-8 py-8">
          <div className="max-w-7xl mx-auto">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 bg-red-500/20 border border-red-500/50 text-red-100 px-6 py-4 rounded-xl"
              >
                {error}
              </motion.div>
            )}

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
                  <h2 className="text-3xl font-bold text-white mb-6">
                    {editingId ? 'Editar Categoría' : 'Nueva Categoría'}
                  </h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-2">
                        Nombre de la Categoría
                      </label>
                      <input
                        type="text"
                        value={formData.nombre_categoria}
                        onChange={(e) => setFormData({ ...formData, nombre_categoria: e.target.value })}
                        required
                        className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                        placeholder="Ej: Matemáticas"
                      />
                    </div>

                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="activo"
                        checked={formData.activo}
                        onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                        className="w-5 h-5 rounded border-white/30 bg-white/10 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-0"
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
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-xl font-medium shadow-lg transition-all"
                      >
                        {editingId ? 'Actualizar' : 'Crear'}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            )}

            {/* Subcategoría Form Modal */}
            <AnimatePresence>
              {showSubcategoriaForm && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                  onClick={handleCancelSubcategoria}
                >
                  <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white/10 backdrop-blur-2xl rounded-2xl p-8 border border-white/20 max-w-md w-full"
                    style={{
                      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                    }}
                  >
                    <h2 className="text-3xl font-bold text-white mb-6">
                      Nueva Subcategoría
                    </h2>
                    
                    <form onSubmit={handleSubmitSubcategoria} className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-white/90 mb-2">
                          Nombre de la Subcategoría
                        </label>
                        <input
                          type="text"
                          value={subcategoriaFormData.nombre_subcategoria}
                          onChange={(e) => setSubcategoriaFormData({ ...subcategoriaFormData, nombre_subcategoria: e.target.value })}
                          required
                          className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                          placeholder="Ej: Álgebra"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white/90 mb-2">
                          Descripción (opcional)
                        </label>
                        <textarea
                          value={subcategoriaFormData.descripcion}
                          onChange={(e) => setSubcategoriaFormData({ ...subcategoriaFormData, descripcion: e.target.value })}
                          className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all resize-none"
                          placeholder="Describe la subcategoría..."
                          rows={3}
                        />
                      </div>

                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="subcategoria_activo"
                          checked={subcategoriaFormData.activo}
                          onChange={(e) => setSubcategoriaFormData({ ...subcategoriaFormData, activo: e.target.checked })}
                          className="w-5 h-5 rounded border-white/30 bg-white/10 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-0"
                        />
                        <label htmlFor="subcategoria_activo" className="text-white/90 font-medium">
                          Activo
                        </label>
                      </div>

                      <div className="flex space-x-4">
                        <button
                          type="button"
                          onClick={handleCancelSubcategoria}
                          className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all border border-white/20"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-xl font-medium shadow-lg transition-all"
                        >
                          Crear
                        </button>
                      </div>
                    </form>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Categories Grid */}
            {isLoading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-white/20 border-t-white"></div>
                <p className="text-white/70 mt-4">Cargando categorías...</p>
              </div>
            ) : categorias.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-white/70 text-lg">No hay categorías registradas</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                {categorias.map((categoria, index) => (
                  <motion.div
                    key={categoria._id}
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
                        <h3 className="text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {categoria.nombre_categoria}
                        </h3>
                        
                        {/* Subtítulo de Subcategorías (siempre visible, clicable) */}
                        <button
                          onClick={() => toggleSubcategorias(categoria._id)}
                          className="flex items-center gap-1 mt-1 text-white/80 hover:text-white transition-colors bg-transparent"
                        >
                          <span className="text-xs">
                            Subcategorías ({categoria.subcategorias?.length || 0})
                          </span>
                          <span className="text-xs">
                            {expandedCategories.has(categoria._id) ? '▲' : '▼'}
                          </span>
                        </button>
                      </div>
                      
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        categoria.activo 
                          ? 'bg-green-500/30 text-green-200 border border-green-400/50' 
                          : 'bg-red-500/30 text-red-200 border border-red-400/50'
                      }`}>
                        {categoria.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>

                    {/* Lista de Subcategorías (colapsable) */}
                    <AnimatePresence>
                      {categoria.subcategorias && categoria.subcategorias.length > 0 && expandedCategories.has(categoria._id) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mb-4 overflow-hidden"
                        >
                          <div className="space-y-1">
                            {categoria.subcategorias.map((sub: Subcategoria) => (
                              <div
                                key={sub._id}
                                className="flex items-center justify-between bg-white/5 px-3 py-2 rounded-lg border border-white/10"
                              >
                                <span className="text-white/80 text-sm">{sub.nombre_subcategoria}</span>
                                <div className="flex items-center gap-2">
                                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                                    sub.activo 
                                      ? 'bg-green-500/20 text-green-300' 
                                      : 'bg-red-500/20 text-red-300'
                                  }`}>
                                    {sub.activo ? '✓' : '✗'}
                                  </span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteSubcategoria(sub._id);
                                    }}
                                    className="px-2 py-1 bg-red-500/20 hover:bg-red-500/40 text-red-200 rounded text-xs transition-all border border-red-400/30"
                                    title="Eliminar subcategoría"
                                  >
                                    Eliminar
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex gap-2 mt-4">
                      <motion.button
                        onClick={() => handleAddSubcategoria(categoria._id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 px-4 py-2.5 bg-green-500/20 hover:bg-green-500/40 text-green-200 rounded-lg font-medium transition-all border border-green-400/30 flex items-center justify-center gap-2"
                        title="Añadir subcategoría"
                      >
                        <span className="text-sm">+ Añadir subcategoría</span>
                      </motion.button>
                      <motion.button
                        onClick={() => handleEdit(categoria)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-20 h-10 bg-blue-500/20 hover:bg-blue-500/40 text-blue-200 rounded-lg transition-all border border-blue-400/30 flex items-center justify-center text-xs font-medium"
                        title="Editar categoría"
                      >
                        Editar
                      </motion.button>
                      <motion.button
                        onClick={() => handleDelete(categoria._id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-20 h-10 bg-red-500/20 hover:bg-red-500/40 text-red-200 rounded-lg transition-all border border-red-400/30 flex items-center justify-center text-xs font-medium"
                        title="Eliminar categoría"
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

export default CategoriasPage;
