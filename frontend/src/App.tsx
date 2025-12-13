import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CategoriasPage from './pages/CategoriasPage';
import CiclosPage from './pages/CiclosPage';
import UsuariosPage from './pages/UsuariosPage';
import PreguntasPage from './pages/PreguntasPage';
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
                <PreguntasPage />
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
