import { useState, useEffect } from 'react'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'

function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'login'>('landing')

  useEffect(() => {
    // Verificar se há token salvo
    const token = localStorage.getItem('access_token')
    if (token) {
      // Se tiver token, pode redirecionar para dashboard ou manter na landing
      // Por enquanto, mantém na landing
    }

    // Função para navegar entre páginas (será substituída por React Router depois)
    const handleNavigation = (e: CustomEvent) => {
      setCurrentPage(e.detail.page)
    }
    
    window.addEventListener('navigate' as any, handleNavigation)
    return () => window.removeEventListener('navigate' as any, handleNavigation)
  }, [])

  if (currentPage === 'login') {
    return <Login />
  }

  return <LandingPage />
}

export default App

