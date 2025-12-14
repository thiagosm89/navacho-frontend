import { Navigate, useLocation } from 'react-router-dom'
import { obterPerfisDisponiveis, obterDashboardPadrao } from '../utils/perfilUtils'
import { PapelUsuario } from '../types/roles'

interface ProtectedRouteProps {
  children: React.ReactNode
  roles?: PapelUsuario[]
}

const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
  const location = useLocation()
  const token = localStorage.getItem('access_token')
  const usuarioStr = localStorage.getItem('usuario')

  // Se não estiver autenticado, redirecionar para login
  if (!token || !usuarioStr) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  try {
    const usuario = JSON.parse(usuarioStr)
    const papel = usuario.papel as PapelUsuario

    // Se especificou roles, verificar se o usuário tem uma delas
    if (roles && roles.length > 0) {
      if (!roles.includes(papel)) {
        // Usuário não tem permissão, redirecionar para dashboard padrão
        const perfis = obterPerfisDisponiveis(usuario)
        if (perfis.length > 0) {
          return <Navigate to={perfis[0].path} replace />
        }
        return <Navigate to={obterDashboardPadrao(papel)} replace />
      }
    }

    return <>{children}</>
  } catch (error) {
    // Erro ao parsear usuário, limpar e redirecionar para login
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('usuario')
    return <Navigate to="/login" replace />
  }
}

export default ProtectedRoute

