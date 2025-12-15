import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import './Modal.css'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: 'small' | 'medium' | 'large'
}

const Modal = ({ isOpen, onClose, title, children, size = 'medium' }: ModalProps) => {
  // Bloquear scroll do body quando o modal estiver aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Fechar modal ao pressionar ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const modalContent = (
    <div className="modal-overlay-form" onClick={onClose}>
      <div 
        className={`modal-content-form modal-size-${size}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header-form">
          <h2 className="modal-title-form">{title}</h2>
          <button className="modal-close-form" onClick={onClose} aria-label="Fechar modal">
            ×
          </button>
        </div>
        <div className="modal-body-form">
          {children}
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}

export default Modal

