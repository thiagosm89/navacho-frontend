import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import LayoutAdmin from '../components/LayoutAdmin/LayoutAdmin'
import LoadingBarber from '../components/LoadingBarber/LoadingBarber'
import { obterPerfisDisponiveis, PerfilUsuario } from '../utils/perfilUtils'
import logomarcaImg from '../assets/logomarca_preto.png'
import './SelecionarPerfil.css'

const SelecionarPerfil = () => {
  const navigate = useNavigate()
  const [perfis, setPerfis] = useState<PerfilUsuario[]>([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    // Verificar se está autenticado
    const usuarioStr = localStorage.getItem('usuario')
    const token = localStorage.getItem('access_token')

    if (!usuarioStr || !token) {
      navigate('/login', { replace: true })
      return
    }

    try {
      const usuario = JSON.parse(usuarioStr)
      const perfisDisponiveis = obterPerfisDisponiveis(usuario)

      // Se tiver apenas um perfil, redirecionar direto
      if (perfisDisponiveis.length === 1) {
        navigate(perfisDisponiveis[0].path, { replace: true })
        return
      }

      setPerfis(perfisDisponiveis)
    } catch (error) {
      console.error('Erro ao carregar perfis:', error)
      navigate('/login', { replace: true })
    } finally {
      setCarregando(false)
    }
  }, [navigate])

  const handleSelecionarPerfil = (perfil: PerfilUsuario) => {
    // Salvar perfil selecionado no localStorage
    localStorage.setItem('perfil_selecionado', JSON.stringify(perfil))
    navigate(perfil.path, { replace: true })
  }

  if (carregando) {
    return (
      <LayoutAdmin>
        <div className="selecionar-perfil-loading">
          <LoadingBarber size="large" text="Carregando perfis..." />
        </div>
      </LayoutAdmin>
    )
  }

  return (
    <LayoutAdmin>
      <div className="selecionar-perfil-container">
        <div className="selecionar-perfil-header">
          <div className="selecionar-perfil-logo">
            <img
              src={typeof logomarcaImg === 'string' ? logomarcaImg : '/logomarca_preto.png'}
              alt="NaRégua Logo"
              className="selecionar-perfil-logo-image"
            />
          </div>
          <h1 className="selecionar-perfil-title">Selecione um Perfil</h1>
          <p className="selecionar-perfil-subtitle">
            Você possui múltiplos perfis. Escolha qual deseja acessar:
          </p>
        </div>

        <div className="perfis-grid">
          {perfis.map((perfil) => (
            <button
              key={perfil.papel}
              className="perfil-card"
              onClick={() => handleSelecionarPerfil(perfil)}
            >
              <div className="perfil-icon">{perfil.icon}</div>
              <h3 className="perfil-label">{perfil.label}</h3>
              <p className="perfil-descricao">{perfil.descricao}</p>
            </button>
          ))}
        </div>
      </div>
    </LayoutAdmin>
  )
}

export default SelecionarPerfil

