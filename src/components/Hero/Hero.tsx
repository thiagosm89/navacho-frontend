import { useNavigate } from 'react-router-dom'
import logomarcaImg from '../../assets/logomarca_preto.png'
import barbeariaImg from '../../assets/barbearia.jpg'
import './Hero.css'

const Hero = () => {
  const navigate = useNavigate()
  // Tentar usar a importação, se falhar usar caminho público
  const logoSrc = typeof logomarcaImg === 'string' ? logomarcaImg : '/logomarca_preto.png'
  const barbeariaSrc = typeof barbeariaImg === 'string' ? barbeariaImg : '/barbearia.jpg'
  
  return (
    <section className="hero" style={{ '--barbearia-bg': `url(${barbeariaSrc})` } as React.CSSProperties}>
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-logo-wrapper">
            <img 
              src={logoSrc} 
              alt="TapaNoVisu Logo" 
              className="hero-logo"
            />
          </div>
          <p className="hero-description">
            A plataforma que conecta você aos melhores barbeiros e barbearias. 
            Oferecemos uma experiência completa para quem busca excelência em cuidados do visual. 
            Agende seus cortes, descubra profissionais de qualidade e encontre quem entende que uma apresentação impecável 
            é essencial para sua confiança e presença.
          </p>
          <div className="hero-buttons">
            <button 
              className="btn-hero-primary"
              onClick={() => navigate('/login', { state: { from: window.location.pathname } })}
            >
              Começar Agora
            </button>
            <button 
              className="btn-hero-secondary"
              onClick={() => navigate('/barbearias')}
            >
              Ver Barbearias
            </button>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-image-wrapper">
            <img 
              src={logoSrc} 
              alt="TapaNoVisu - Transformando Visuais com Excelência" 
              className="hero-image-main"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
