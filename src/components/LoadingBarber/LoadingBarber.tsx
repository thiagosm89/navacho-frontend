import './LoadingBarber.css'

interface LoadingBarberProps {
  size?: 'small' | 'medium' | 'large'
  text?: string
}

const LoadingBarber = ({ size = 'medium', text }: LoadingBarberProps) => {
  return (
    <div className={`loading-barber-container ${size}`}>
      <div className="barber-tools">
        <div className="scissors-wrapper">
          <div className="scissors">
            <div className="scissor-blade scissor-left">
              <div className="blade-edge"></div>
            </div>
            <div className="scissor-handle scissor-handle-left"></div>
            <div className="scissor-pivot"></div>
            <div className="scissor-handle scissor-handle-right"></div>
            <div className="scissor-blade scissor-right">
              <div className="blade-edge"></div>
            </div>
          </div>
        </div>
        <div className="hair-strands">
          <div className="hair-strand strand-1"></div>
          <div className="hair-strand strand-2"></div>
          <div className="hair-strand strand-3"></div>
          <div className="hair-strand strand-4"></div>
        </div>
        <div className="comb">
          <div className="comb-teeth">
            <div className="tooth"></div>
            <div className="tooth"></div>
            <div className="tooth"></div>
            <div className="tooth"></div>
            <div className="tooth"></div>
            <div className="tooth"></div>
            <div className="tooth"></div>
            <div className="tooth"></div>
          </div>
          <div className="comb-handle"></div>
        </div>
      </div>
      {text && <p className="loading-barber-text">{text}</p>}
    </div>
  )
}

export default LoadingBarber

