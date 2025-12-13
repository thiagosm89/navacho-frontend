import logomarcaImg from '../../assets/logomarca_preto.png'
import './Logo.css'

const Logo = () => {
  // Tentar usar a importação, se falhar usar caminho público
  const logoSrc = typeof logomarcaImg === 'string' ? logomarcaImg : '/logomarca_preto.png'
  
  return (
    <div className="logo">
      <img 
        src={logoSrc} 
        alt="TapaNoVisu Logo" 
        className="logo-image"
      />
      <span className="logo-text">TapaNoVisu</span>
    </div>
  )
}

export default Logo

