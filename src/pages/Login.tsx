import { useState } from 'react'
import logomarcaImg from '../assets/logomarca.png'
import './Login.css'

const Login = () => {
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
      
      // Redirecionar para dashboard
      window.location.href = '/dashboard'
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao fazer login')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="login-logo-wrapper">
            <img 
              src={typeof logomarcaImg === 'string' ? logomarcaImg : '/logomarca.png'} 
              alt="Navacho Logo" 
              className="login-logo-image"
            />
            <span className="login-logo-text">Navacho</span>
          </div>
          <h1 className="login-title">Bem-vindo</h1>
          <p className="login-subtitle">Entre com suas credenciais para continuar</p>
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
            <a 
              href="#" 
              className="login-link"
              onClick={(e) => {
                e.preventDefault()
                window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'landing' } }))
              }}
            >
              Voltar para a página inicial
            </a>
            <p className="login-register">
              Não tem uma conta?{' '}
              <a 
                href="#" 
                className="login-link"
                onClick={(e) => {
                  e.preventDefault()
                  // TODO: Implementar página de registro
                  alert('Página de registro em breve!')
                }}
              >
                Cadastre-se
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login

