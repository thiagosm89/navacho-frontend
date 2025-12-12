import logomarcaImg from '../../assets/logomarca.png'
import './Hero.css'

const Hero = () => {
  // Tentar usar a importação, se falhar usar caminho público
  const logoSrc = typeof logomarcaImg === 'string' ? logomarcaImg : '/logomarca.png'
  
  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-logo-wrapper">
            <img 
              src={logoSrc} 
              alt="Navacho Logo" 
              className="hero-logo"
            />
          </div>
          <h1 className="hero-title">
            <span className="title-main">Navacho</span>
          </h1>
          <p className="hero-description">
            Simplifique o agendamento, gerencie sua barbearia com eficiência e conecte-se com 
            <strong> clientes</strong> e <strong>fornecedores</strong> em um só lugar. 
            <strong> Navacho</strong> oferece ferramentas completas para barbeiros e donos de 
            barbearias crescerem seus negócios, mantendo viva a tradição gaúcha com tecnologia de ponta.
          </p>
          <div className="hero-buttons">
            <button 
              className="btn-hero-primary"
              onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'login' } }))}
            >
              Começar Agora
            </button>
            <button className="btn-hero-secondary">Saiba Mais</button>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-image-wrapper">
            <img 
              src={logoSrc} 
              alt="Navacho - Plataforma de Agendamento" 
              className="hero-image-main"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
