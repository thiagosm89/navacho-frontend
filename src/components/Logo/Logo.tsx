import logomarcaImg from '../../assets/logomarca.png'
import './Logo.css'

const Logo = () => {
  // Tentar usar a importação, se falhar usar caminho público
  const logoSrc = typeof logomarcaImg === 'string' ? logomarcaImg : '/logomarca.png'
  
  return (
    <div className="logo">
      <img 
        src={logoSrc} 
        alt="Navacho Logo" 
        className="logo-image"
      />
      <span className="logo-text">Navacho</span>
    </div>
  )
}

export default Logo

