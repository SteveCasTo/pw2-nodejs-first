import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CategoriasPage from './pages/CategoriasPage';
import CiclosPage from './pages/CiclosPage';
import UsuariosPage from './pages/UsuariosPage';
import ExamenesPage from './pages/ExamenesPage';
import GestionarPreguntasPage from './pages/GestionarPreguntasPage';
import ResolverExamenPage from './pages/ResolverExamenPage';
import CalificarExamenPage from './pages/CalificarExamenPage';
import IntentosExamenPage from './pages/IntentosExamenPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/categorias"
            element={
              <ProtectedRoute>
                <CategoriasPage />
              </ProtectedRoute>
            }
          />
          
          {/* Placeholder routes for other modules */}
          <Route
            path="/preguntas"
            element={
              <ProtectedRoute>
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500">
                  <div className="text-center text-white">
                    <h1 className="text-4xl font-bold mb-4">Módulo de Preguntas</h1>
                    <p className="text-xl">En desarrollo...</p>
                    <a href="/dashboard" className="mt-4 inline-block px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg">
                      Volver al Dashboard
                    </a>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/examenes"
            element={
              <ProtectedRoute>
                <ExamenesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/examenes/:examenId/preguntas"
            element={
              <ProtectedRoute>
                <GestionarPreguntasPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/examenes/:examenId/intentos"
            element={
              <ProtectedRoute>
                <IntentosExamenPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/examenes/:examenId/resolver"
            element={
              <ProtectedRoute>
                <ResolverExamenPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/examenes/calificar/:intentoId"
            element={
              <ProtectedRoute>
                <CalificarExamenPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/usuarios"
            element={
              <ProtectedRoute>
                <UsuariosPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ciclos"
            element={
              <ProtectedRoute>
                <CiclosPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contenidos"
            element={
              <ProtectedRoute>
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-500 to-cyan-500">
                  <div className="text-center text-white">
                    <h1 className="text-4xl font-bold mb-4">Módulo de Contenidos</h1>
                    <p className="text-xl">En desarrollo...</p>
                    <a href="/dashboard" className="mt-4 inline-block px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg">
                      Volver al Dashboard
                    </a>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
          
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* 404 */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
