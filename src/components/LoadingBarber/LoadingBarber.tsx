import './LoadingBarber.css'

interface LoadingBarberProps {
  size?: 'small' | 'medium' | 'large'
  text?: string
}

const LoadingBarber = ({ size = 'medium', text }: LoadingBarberProps) => {
  return (
    <div className={`loading-barber-container ${size}`}>
      <div className="barber-pole">
        <div className="barber-pole-stripe barber-pole-red"></div>
        <div className="barber-pole-stripe barber-pole-white"></div>
        <div className="barber-pole-stripe barber-pole-blue"></div>
      </div>
      {text && <p className="loading-barber-text">{text}</p>}
    </div>
  )
}

export default LoadingBarber

