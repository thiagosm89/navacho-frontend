import './FeatureCard.css'

interface FeatureCardProps {
  icon: string
  title: string
  description: string
  color: 'verde' | 'marrom' | 'vermelho'
}

const FeatureCard = ({ icon, title, description, color }: FeatureCardProps) => {
  const colorClass = `feature-card--${color}`

  return (
    <div className={`feature-card ${colorClass}`}>
      <div className="feature-icon">{icon}</div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-description">{description}</p>
    </div>
  )
}

export default FeatureCard

