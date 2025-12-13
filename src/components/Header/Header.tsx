import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import IconGalpao from '../IconGalpao/IconGalpao'
import './Header.css'

const Header = () => {
  const [menuAberto, setMenuAberto] = useState(false)
  const navigate = useNavigate()

  const handleLoginClick = () => {
    navigate('/login', { state: { from: window.location.pathname } })
    setMenuAberto(false)
  }

  const handleHomeClick = () => {
    navigate('/')
    setMenuAberto(false)
    // Scroll para o topo da landing page
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 100)
  }

  const toggleMenu = () => {
    setMenuAberto(!menuAberto)
  }

  const fecharMenu = () => {
    setMenuAberto(false)
  }

  const handleSobreClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    fecharMenu()
    const currentPath = window.location.pathname
    if (currentPath === '/') {
      // Se já está na landing page, apenas scrolla para a seção
      const sobreSection = document.getElementById('sobre')
      if (sobreSection) {
        sobreSection.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      // Se está em outra página, armazena a seção e navega
      sessionStorage.setItem('scrollToSection', 'sobre')
      navigate('/')
    }
  }

  const handleFuncionalidadesClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    fecharMenu()
    const currentPath = window.location.pathname
    if (currentPath === '/') {
      // Se já está na landing page, apenas scrolla para a seção
      const funcionalidadesSection = document.getElementById('funcionalidades')
      if (funcionalidadesSection) {
        funcionalidadesSection.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      // Se está em outra página, armazena a seção e navega
      sessionStorage.setItem('scrollToSection', 'funcionalidades')
      navigate('/')
    }
  }

  const handleContatoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    fecharMenu()
    // Sempre scrolla para o rodapé da página atual (não navega para landing page)
    setTimeout(() => {
      const contatoSection = document.getElementById('contato')
      if (contatoSection) {
        contatoSection.scrollIntoView({ behavior: 'smooth' })
      }
    }, 100)
  }

  return (
    <header className="header">
      <div className="header-container">
        <button 
          className="menu-hamburguer"
          onClick={toggleMenu}
          aria-label="Menu"
        >
          <span className={`hamburguer-line ${menuAberto ? 'ativo' : ''}`}></span>
          <span className={`hamburguer-line ${menuAberto ? 'ativo' : ''}`}></span>
          <span className={`hamburguer-line ${menuAberto ? 'ativo' : ''}`}></span>
        </button>
        <nav className={`header-nav ${menuAberto ? 'aberto' : ''}`}>
          <Link 
            to="/"
            className="nav-link nav-link-home" 
            onClick={handleHomeClick}
            title="Início"
          >
            <IconGalpao />
          </Link>
          <a href="#sobre" className="nav-link" onClick={handleSobreClick}>Sobre</a>
          <a href="#funcionalidades" className="nav-link" onClick={handleFuncionalidadesClick}>Funcionalidades</a>
          <Link 
            to="/barbearias"
            className="nav-link" 
            onClick={fecharMenu}
          >
            Barbearias
          </Link>
          <Link 
            to="/cadastro"
            className="nav-link" 
            onClick={fecharMenu}
          >
            Cadastro
          </Link>
          <a href="#contato" className="nav-link" onClick={handleContatoClick}>Contato</a>
        </nav>
        <button className="btn-primary" onClick={handleLoginClick}>Entrar</button>
      </div>
    </header>
  )
}

export default Header

