import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import { obterPerfisDisponiveis, obterDashboardPadrao } from '../utils/perfilUtils'
import { PapelUsuario } from '../types/roles'
import logomarcaImg from '../assets/logomarca_preto.png'
import './Login.css'

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  // Verificar se já está logado ao montar o componente
  useEffect(() => {
    const token = localStorage.getItem('access_token')
    const usuarioStr = localStorage.getItem('usuario')

    if (token && usuarioStr) {
      try {
        const usuario = JSON.parse(usuarioStr)
        const perfis = obterPerfisDisponiveis(usuario)

        // Se tiver múltiplos perfis, redirecionar para seleção
        if (perfis.length > 1) {
          navigate('/selecionar-perfil', { replace: true })
          return
        }

        // Se tiver apenas um perfil, redirecionar para o dashboard
        if (perfis.length === 1) {
          navigate(perfis[0].path, { replace: true })
          return
        }

        // Fallback: redirecionar para dashboard padrão
        const papel = usuario.papel as PapelUsuario
        navigate(obterDashboardPadrao(papel), { replace: true })
      } catch (error) {
        // Se houver erro ao parsear, limpar e continuar na tela de login
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('usuario')
      }
    }
  }, [navigate])


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    setCarregando(true)

    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.mensagem || 'Erro ao fazer login')
      }

      const data = await response.json()
      // Salvar tokens
      localStorage.setItem('access_token', data.access_token)
      localStorage.setItem('refresh_token', data.refresh_token)
      
      // Salvar informações do usuário
      if (data.usuario) {
        localStorage.setItem('usuario', JSON.stringify(data.usuario))
      }
      
      // Verificar perfis disponíveis
      const perfis = obterPerfisDisponiveis(data.usuario)
      
      // Se tiver múltiplos perfis, redirecionar para seleção
      if (perfis.length > 1) {
        navigate('/selecionar-perfil', { replace: true })
        return
      }
      
      // Se tiver apenas um perfil, redirecionar direto
      if (perfis.length === 1) {
        navigate(perfis[0].path, { replace: true })
        return
      }
      
      // Fallback: redirecionar para dashboard padrão baseado no papel
      const papel = data.usuario?.papel as PapelUsuario
      if (papel) {
        navigate(obterDashboardPadrao(papel), { replace: true })
      } else {
        navigate('/barbearias', { replace: true })
      }
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao fazer login')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="login-page">
      <Header />
      <div className="login-page-content">
        <div className="login-container">
        <div className="login-header">
          <div className="login-logo-wrapper">
            <img 
              src={typeof logomarcaImg === 'string' ? logomarcaImg : '/logomarca_preto.png'} 
              alt="NaRégua Logo" 
              className="login-logo-image"
            />
          </div>
          <p className="login-subtitle">Entre na sua conta para continuar</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {erro && (
            <div className="login-error">
              {erro}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              disabled={carregando}
            />
          </div>

          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <input
              type="password"
              id="senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              required
              disabled={carregando}
            />
          </div>

          <button 
            type="submit" 
            className="btn-login"
            disabled={carregando}
          >
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>

          <div className="login-footer">
            <p className="login-register">
              Não tem uma conta?{' '}
              <a 
                href="#"
                className="login-link"
                onClick={(e) => {
                  e.preventDefault()
                  navigate('/cadastro', { state: { from: location.pathname } })
                }}
              >
                Cadastre-se
              </a>
            </p>
          </div>
        </form>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Login

