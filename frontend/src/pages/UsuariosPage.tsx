import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { UsuarioAdmin, UserPrivilege } from '../types';
import { usuarioService } from '../services/dataService';

const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState<UsuarioAdmin[]>([]);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedPrivilegio, setSelectedPrivilegio] = useState<string>('');
  const [filteredUsuarios, setFilteredUsuarios] = useState<UsuarioAdmin[]>([]);
  const [formData, setFormData] = useState({
    nombre: '',
    correo_electronico: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await usuarioService.getAll();
      setUsuarios(response.data);
      setError('');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Error al cargar usuarios');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await usuarioService.update(editingId, { nombre: formData.nombre });
      } else {
        await usuarioService.create(formData);
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({ nombre: '', correo_electronico: '' });
      fetchUsuarios();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Error al guardar usuario');
    }
  };

  const handleEdit = (usuario: UsuarioAdmin) => {
    setEditingId(usuario._id);
    setFormData({
      nombre: usuario.nombre || '',
      correo_electronico: usuario.correo_electronico || '',
    });
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingId(null);
    setFormData({ nombre: '', correo_electronico: '' });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de desactivar este usuario?')) return;
    try {
      await usuarioService.delete(id);
      fetchUsuarios();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Error al desactivar usuario');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ nombre: '', correo_electronico: '' });
  };

  const openModal = (privilegioNombre: string) => {
    setSelectedPrivilegio(privilegioNombre);
    
    // Filtrar usuarios que tengan ese privilegio
    const filtered = usuarios.filter(usuario => 
      usuario.privilegios?.some(priv => priv.id_privilegio.nombre === privilegioNombre)
    );
    setFilteredUsuarios(filtered);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setShowForm(false);
    setSelectedPrivilegio('');
    setFilteredUsuarios([]);
    setEditingId(null);
    setFormData({ nombre: '', correo_electronico: '' });
  };

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-gradient-to-br from-orange-900 via-red-900 to-pink-900">
      <div className="relative z-10 w-full h-full flex flex-col overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center px-8 py-6 bg-gradient-to-r from-orange-900/30 to-red-900/30 backdrop-blur-md border-b border-white/10"
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
                <span className="text-5xl">👥</span>
                Usuarios
              </h1>
            </div>
          </div>
        </motion.div>

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

            {showModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                onClick={closeModal}
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white/10 backdrop-blur-2xl rounded-2xl p-8 border border-white/20 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
                  style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
                >
                  {!showForm ? (
                    <>
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <h2 className="text-3xl font-bold text-white">Usuarios - {selectedPrivilegio}</h2>
                          <p className="text-white/60 text-sm mt-1">
                            {filteredUsuarios.length} {filteredUsuarios.length === 1 ? 'usuario encontrado' : 'usuarios encontrados'}
                          </p>
                        </div>
                        <button onClick={closeModal} className="text-white/60 hover:text-white text-2xl">
                          ✕
                        </button>
                      </div>

                      <button
                        onClick={handleAddNew}
                        className="mb-4 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-medium shadow-lg transition-all flex items-center justify-center gap-2"
                      >
                        <span className="text-xl">+</span>
                        Añadir Nuevo Usuario
                      </button>

                      <div className="flex-1 overflow-y-auto space-y-3">
                        {filteredUsuarios.length > 0 ? (
                          filteredUsuarios.map((usuario) => (
                            <div
                              key={usuario._id}
                              className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10 hover:border-white/30 transition-all flex justify-between items-center"
                            >
                              <div className="flex-1">
                                <h3 className="text-lg font-bold text-white">
                                  {usuario.nombre || 'Sin nombre'}
                                </h3>
                                <p className="text-white/60 text-sm">{usuario.correo_electronico}</p>
                              </div>
                              
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEdit(usuario)}
                                  className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/40 text-blue-200 rounded-lg transition-all border border-blue-400/30 text-sm font-medium"
                                >
                                  Editar
                                </button>
                                <button
                                  onClick={() => handleDelete(usuario._id)}
                                  className="px-4 py-2 bg-red-500/20 hover:bg-red-500/40 text-red-200 rounded-lg transition-all border border-red-400/30 text-sm font-medium"
                                >
                                  Eliminar
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-12">
                            <p className="text-white/60 text-lg">No hay usuarios con este privilegio</p>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <h2 className="text-3xl font-bold text-white mb-6">
                        {editingId ? 'Editar Usuario' : 'Nuevo Usuario'}
                      </h2>
                      
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-white/90 mb-2">Nombre</label>
                          <input
                            type="text"
                            value={formData.nombre}
                            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                            className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                            placeholder="Nombre del usuario"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-white/90 mb-2">Correo Electrónico</label>
                          <input
                            type="email"
                            value={formData.correo_electronico}
                            onChange={(e) => setFormData({ ...formData, correo_electronico: e.target.value })}
                            className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                            placeholder="correo@ejemplo.com"
                            required
                            disabled={!!editingId}
                          />
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
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl font-medium shadow-lg transition-all"
                          >
                            {editingId ? 'Actualizar' : 'Crear'}
                          </button>
                        </div>
                      </form>
                    </>
                  )}
                </motion.div>
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
              {usuarios.map((usuario, index) => {
                const privilegioPrincipal = usuario.privilegios && usuario.privilegios.length > 0 
                  ? usuario.privilegios[0].id_privilegio.nombre 
                  : '';
                
                return (
                  <motion.div
                    key={usuario._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => privilegioPrincipal && openModal(privilegioPrincipal)}
                    className="bg-white/5 backdrop-blur-2xl rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all group cursor-pointer"
                    style={{ boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.3)' }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white group-hover:text-orange-300 transition-colors">
                          {usuario.nombre || 'Sin nombre'}
                        </h3>
                        <p className="text-white/60 text-sm mt-1">{usuario.correo_electronico}</p>
                        
                        <div className="mt-3 space-y-1">
                          {usuario.privilegios && usuario.privilegios.length > 0 ? (
                            usuario.privilegios.map((priv: UserPrivilege) => (
                              <div key={priv._id} className="text-white/70 text-xs">
                                • {priv.id_privilegio.descripcion || priv.id_privilegio.nombre}
                              </div>
                            ))
                          ) : (
                            <p className="text-white/50 text-xs italic">Sin privilegios asignados</p>
                          )}
                        </div>
                      </div>
                      
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        usuario.activo 
                          ? 'bg-green-500/30 text-green-200 border border-green-400/50' 
                          : 'bg-red-500/30 text-red-200 border border-red-400/50'
                      }`}>
                        {usuario.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsuariosPage;
