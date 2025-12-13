import Logo from '../Logo/Logo'
import './Footer.css'

const Footer = () => {
  return (
    <footer id="contato" className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <Logo />
          </div>
          <div className="footer-section">
            <h4 className="footer-title">Links Rápidos</h4>
            <ul className="footer-links">
              <li><a href="#sobre">Sobre</a></li>
              <li><a href="#funcionalidades">Funcionalidades</a></li>
              <li><a href="#contato">Contato</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4 className="footer-title">Contato</h4>
            <ul className="footer-links">
              <li>contato@naregua.com.br</li>
              <li>(51) 99999-9999</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 NaRégua. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

