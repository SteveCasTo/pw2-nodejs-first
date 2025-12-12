import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import EndpointCard from '../components/dashboard/EndpointCard';
import type { DashboardCard } from '../types';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [expandedPrivilege, setExpandedPrivilege] = useState<number | null>(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const dashboardCards: DashboardCard[] = [
    {
      id: 'categorias',
      title: 'Categorías',
      description: 'Gestionar categorías de preguntas y exámenes',
      icon: '📚',
      route: '/categorias',
      color: 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20',
    },
    {
      id: 'preguntas',
      title: 'Preguntas',
      description: 'Crear y administrar preguntas del banco',
      icon: '❓',
      route: '/preguntas',
      color: 'bg-gradient-to-br from-purple-500/20 to-pink-500/20',
    },
    {
      id: 'examenes',
      title: 'Exámenes',
      description: 'Gestionar exámenes y evaluaciones',
      icon: '📝',
      route: '/examenes',
      color: 'bg-gradient-to-br from-green-500/20 to-emerald-500/20',
    },
    {
      id: 'usuarios',
      title: 'Usuarios',
      description: 'Administrar usuarios y privilegios',
      icon: '👥',
      route: '/usuarios',
      color: 'bg-gradient-to-br from-orange-500/20 to-red-500/20',
      requiredPrivilege: 'superadmin',
    },
    {
      id: 'ciclos',
      title: 'Ciclos',
      description: 'Gestionar ciclos académicos',
      icon: '📅',
      route: '/ciclos',
      color: 'bg-gradient-to-br from-indigo-500/20 to-blue-500/20',
    },
    {
      id: 'contenidos',
      title: 'Contenidos',
      description: 'Administrar contenido educativo',
      icon: '📖',
      route: '/contenidos',
      color: 'bg-gradient-to-br from-teal-500/20 to-cyan-500/20',
    },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      <div className="relative z-10 w-full h-full flex flex-col overflow-y-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center px-8 py-6 bg-gradient-to-r from-purple-900/30 to-indigo-900/30 backdrop-blur-md border-b border-white/10"
        >
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl font-bold text-white"
              style={{
                textShadow: '0 2px 20px rgba(0,0,0,0.5)',
              }}
            >
              {getGreeting()}, {user?.nombre}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-white/90 text-sm mt-1"
            >
              Bienvenido a <span className="font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">FormifyX</span>
            </motion.p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="px-6 py-2.5 bg-red-500/90 hover:bg-red-600 backdrop-blur-lg text-white rounded-xl font-medium shadow-lg transition-all border border-red-400/30"
          >
            Cerrar Sesión
          </motion.button>
        </motion.div>

        {/* Main Content - Centered */}
        <div className="flex-1 flex items-center justify-center px-4 md:px-8 py-8">
          <div className="w-full max-w-7xl mx-auto">
            {/* User Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 backdrop-blur-2xl rounded-2xl p-8 mb-12 border border-white/10 shadow-2xl hover:border-white/20 transition-all"
              style={{
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.1)'
              }}
            >
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-4xl shadow-lg">
                  👤
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-white mb-1">
                    {user?.nombre} {user?.apellido_paterno || ''}
                  </h2>
                  <p className="text-white/70 text-lg mb-3">{user?.correo_electronico}</p>
                  <div className="flex flex-wrap gap-2">
                    {user?.privilegios && user.privilegios.length > 0 ? (
                      user.privilegios.map((priv, idx) => (
                        priv.activo && (
                          <motion.button
                            key={idx}
                            onClick={() => setExpandedPrivilege(expandedPrivilege === idx ? null : idx)}
                            className="relative overflow-hidden px-4 py-1.5 bg-purple-500/30 rounded-full text-sm text-white border border-purple-400/50 font-medium cursor-pointer hover:bg-purple-500/40 transition-colors"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            layout
                            transition={{ 
                              layout: { duration: 0.3, ease: "easeInOut" }
                            }}
                          >
                            <motion.div 
                              className="flex items-center gap-2 whitespace-nowrap"
                              layout="position"
                            >
                              <span>{priv.id_privilegio.nombre}</span>
                              <AnimatePresence>
                                {expandedPrivilege === idx && priv.id_privilegio.descripcion && (
                                  <motion.span
                                    initial={{ width: 0, opacity: 0 }}
                                    animate={{ width: "auto", opacity: 1 }}
                                    exit={{ width: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="text-white/80 border-l border-white/30 pl-2"
                                  >
                                    - {priv.id_privilegio.descripcion}
                                  </motion.span>
                                )}
                              </AnimatePresence>
                            </motion.div>
                          </motion.button>
                        )
                      ))
                    ) : (
                      <span className="text-white/50 text-sm">Sin privilegios</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Dashboard Title */}
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-bold text-white mb-8 text-center"
              style={{
                textShadow: '0 2px 20px rgba(0,0,0,0.5)',
              }}
            >
              🎯 Módulos Disponibles
            </motion.h2>

            {/* Cards Grid - Centered */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {dashboardCards.map((card, index) => (
                <EndpointCard key={card.id} card={card} index={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
