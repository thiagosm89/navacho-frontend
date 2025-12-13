import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import logomarcaImg from '../assets/logomarca_preto.png'
import './Login.css'

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    setCarregando(true)

    try {
      // TODO: Integrar com API do backend
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
      
      // Redirecionar para a página anterior ou fallback
      const from = (location.state as { from?: string })?.from
      
      // Se veio de outra página (não é a própria página de login), volta para lá
      if (from && from !== '/login') {
        navigate(from, { replace: true })
      } else {
        // Tenta voltar no histórico do navegador
        // Se não houver histórico, vai para barbearias como fallback
        navigate(-1)
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

