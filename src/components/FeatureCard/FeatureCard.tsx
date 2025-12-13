import './FeatureCard.css'

interface FeatureCardProps {
  icon: string
  title: string
  description: string
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <div className="feature-card">
      <div className="feature-icon">{icon}</div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-description">{description}</p>
    </div>
  )
}

export default FeatureCard

