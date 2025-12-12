import { useState } from 'react'
import './Header.css'

const Header = () => {
  const [menuAberto, setMenuAberto] = useState(false)

  const handleLoginClick = () => {
    window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'login' } }))
    setMenuAberto(false)
  }

  const toggleMenu = () => {
    setMenuAberto(!menuAberto)
  }

  const fecharMenu = () => {
    setMenuAberto(false)
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
          <a href="#sobre" className="nav-link" onClick={fecharMenu}>Sobre</a>
          <a href="#funcionalidades" className="nav-link" onClick={fecharMenu}>Funcionalidades</a>
          <a href="#contato" className="nav-link" onClick={fecharMenu}>Contato</a>
        </nav>
        <button className="btn-primary" onClick={handleLoginClick}>Entrar</button>
      </div>
    </header>
  )
}

export default Header

