import FeatureCard from '../FeatureCard/FeatureCard'
import './Features.css'

const Features = () => {
  const features = [
    {
      icon: '✂️',
      title: 'Para Barbeiros',
      description: 'Gerencie sua agenda, clientes e serviços de forma simples e eficiente. Aumente sua produtividade e organize seu negócio com ferramentas desenvolvidas especialmente para você.',
      color: 'verde'
    },
    {
      icon: '👤',
      title: 'Para Clientes',
      description: 'Agende seus cortes e serviços com facilidade. Encontre os melhores barbeiros da sua região e gerencie todos os seus agendamentos em um só lugar, sem complicação.',
      color: 'marrom'
    },
    {
      icon: '📦',
      title: 'Para Fornecedores',
      description: 'Conecte-se diretamente com barbearias e barbeiros. Expanda seu mercado, aumente suas vendas e fortaleça relacionamentos através da nossa plataforma.',
      color: 'vermelho'
    }
  ]

  return (
    <section id="funcionalidades" className="features">
      <div className="features-container">
        <div className="features-header">
          <h2 className="features-title">Como o Navacho Conecta</h2>
          <p className="features-subtitle">
            Uma plataforma completa que une barbeiros, clientes e fornecedores em um só lugar
          </p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
