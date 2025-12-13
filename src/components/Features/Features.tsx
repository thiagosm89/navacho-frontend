import FeatureCard from '../FeatureCard/FeatureCard'
import './Features.css'

const Features = () => {
  const features: Array<{
    icon: string
    title: string
    description: string
    color: 'verde' | 'marrom' | 'vermelho'
  }> = [
    {
      icon: '✂️',
      title: 'Para Barbeiros',
      description: 'Gerencie sua agenda, clientes e serviços de forma simples e eficiente. Aumente sua produtividade e organize seu negócio com ferramentas desenvolvidas especialmente para profissionais que valorizam a excelência.',
      color: 'verde' as const
    },
    {
      icon: '👤',
      title: 'Para Clientes',
      description: 'Agende seus cortes e serviços com facilidade. Encontre os melhores barbeiros e barbearias que entendem que um bom visual é essencial. Transforme seu estilo e eleve sua confiança.',
      color: 'marrom' as const
    },
    {
      icon: '📦',
      title: 'Para Fornecedores',
      description: 'Conecte-se diretamente com barbearias e barbeiros de qualidade. Expanda seu mercado, aumente suas vendas e fortaleça relacionamentos através da nossa plataforma.',
      color: 'vermelho' as const
    }
  ]

  return (
    <section id="funcionalidades" className="features">
      <div className="features-container">
        <div className="features-header">
          <h2 className="features-title">Como o TapaNoVisu Transforma</h2>
          <p className="features-subtitle">
            Uma plataforma completa que conecta você aos melhores profissionais e oferece cuidados de excelência
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
