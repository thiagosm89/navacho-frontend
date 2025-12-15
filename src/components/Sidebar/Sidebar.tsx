import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import logomarcaImg from '../../assets/logomarca_preto.png'
import { menuItems } from '../../config/menuItems'
import { temRole, PapelUsuario } from '../../types/roles'
import './Sidebar.css'

const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [menuAberto, setMenuAberto] = useState(false)
  const [usuarioRole, setUsuarioRole] = useState<PapelUsuario | undefined>(undefined)

  useEffect(() => {
    // Carregar role do usuário do localStorage
    const usuarioStr = localStorage.getItem('usuario')
    if (usuarioStr) {
      try {
        const usuario = JSON.parse(usuarioStr)
        setUsuarioRole(usuario.papel as PapelUsuario)
      } catch (error) {
        console.error('Erro ao carregar usuário:', error)
      }
    }

    // Fechar menu ao redimensionar para desktop
    const handleResize = () => {
      if (window.innerWidth > 968) {
        setMenuAberto(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('usuario')
    navigate('/login', { replace: true })
  }

  // Filtrar itens do menu baseado na role do usuário
  const itensVisiveis = menuItems.filter((item) => {
    // Se não especificar roles, todos podem ver
    if (!item.roles || item.roles.length === 0) {
      return true
    }
    // Verificar se o usuário tem uma das roles necessárias
    return temRole(usuarioRole, item.roles)
  })

  const isActive = (path: string) => location.pathname === path

  return (
    <>
      {/* Botão hambúrguer para mobile */}
      <button
        className="sidebar-toggle"
        onClick={() => setMenuAberto(!menuAberto)}
        aria-label="Toggle menu"
      >
        <span className={`hamburguer-line ${menuAberto ? 'ativo' : ''}`}></span>
        <span className={`hamburguer-line ${menuAberto ? 'ativo' : ''}`}></span>
        <span className={`hamburguer-line ${menuAberto ? 'ativo' : ''}`}></span>
      </button>

      {/* Overlay para mobile */}
      {menuAberto && (
        <div
          className="sidebar-overlay"
          onClick={() => setMenuAberto(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${menuAberto ? 'aberto' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <img
              src={typeof logomarcaImg === 'string' ? logomarcaImg : '/logomarca_preto.png'}
              alt="NaRéguaÍ Logo"
              className="sidebar-logo-image"
            />
          </div>
        </div>

        <nav className="sidebar-nav">
          {itensVisiveis.map((item) => (
            <button
              key={item.path}
              className={`sidebar-item ${isActive(item.path) ? 'ativo' : ''}`}
              onClick={() => {
                navigate(item.path)
                setMenuAberto(false)
              }}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button
            className="sidebar-item sidebar-logout"
            onClick={handleLogout}
          >
            <span className="sidebar-icon">🚪</span>
            <span className="sidebar-label">Sair</span>
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar

