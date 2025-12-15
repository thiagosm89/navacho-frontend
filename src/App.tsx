import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Register from './pages/Register'
import Barbearias from './pages/Barbearias'
import AdminDashboard from './pages/AdminDashboard'
import AdminUsuarios from './pages/AdminUsuarios'
import SelecionarPerfil from './pages/SelecionarPerfil'
import BarbeariaDashboard from './pages/BarbeariaDashboard'
import CadastroBarbeiros from './pages/CadastroBarbeiros'
import AgendamentosBarbearia from './pages/AgendamentosBarbearia'
import EstoqueBarbearia from './pages/EstoqueBarbearia'
import ServicosBarbearia from './pages/ServicosBarbearia'
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
      <Route 
        path="/barbearia/dashboard" 
        element={
          <ProtectedRoute roles={['ADMIN_BARBEARIA']}>
            <BarbeariaDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/barbearia/barbeiros" 
        element={
          <ProtectedRoute roles={['ADMIN_BARBEARIA']}>
            <CadastroBarbeiros />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/barbearia/agendamentos" 
        element={
          <ProtectedRoute roles={['ADMIN_BARBEARIA']}>
            <AgendamentosBarbearia />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/barbearia/estoque" 
        element={
          <ProtectedRoute roles={['ADMIN_BARBEARIA']}>
            <EstoqueBarbearia />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/barbearia/servicos" 
        element={
          <ProtectedRoute roles={['ADMIN_BARBEARIA']}>
            <ServicosBarbearia />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App

