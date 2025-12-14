import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Register from './pages/Register'
import Barbearias from './pages/Barbearias'
import AdminDashboard from './pages/AdminDashboard'
import AdminUsuarios from './pages/AdminUsuarios'
import SelecionarPerfil from './pages/SelecionarPerfil'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Register />} />
      <Route path="/barbearias" element={<Barbearias />} />
      <Route 
        path="/admin/dashboard" 
        element={
          <ProtectedRoute roles={['ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/usuarios" 
        element={
          <ProtectedRoute roles={['ADMIN']}>
            <AdminUsuarios />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/selecionar-perfil" 
        element={
          <ProtectedRoute>
            <SelecionarPerfil />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App

