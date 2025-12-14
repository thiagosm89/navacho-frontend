import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Header from '../components/Header/Header'
import Hero from '../components/Hero/Hero'
import Features from '../components/Features/Features'
import About from '../components/About/About'
import BarberPoleHistory from '../components/BarberPoleHistory/BarberPoleHistory'
import Footer from '../components/Footer/Footer'
import './LandingPage.css'

const LandingPage = () => {
  const location = useLocation()

  useEffect(() => {
    // Verifica se há uma seção para scrollar (vindo de outra página via sessionStorage)
    const scrollToSection = sessionStorage.getItem('scrollToSection')
    if (scrollToSection) {
      sessionStorage.removeItem('scrollToSection')
      // Pequeno delay para garantir que o DOM está pronto
      setTimeout(() => {
        const element = document.getElementById(scrollToSection)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }, 300)
    } else if (location.hash) {
      // Se há hash na URL, scrolla para a seção
      setTimeout(() => {
        const element = document.querySelector(location.hash)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }, 300)
    }
  }, [location.hash])

  return (
    <div className="landing-page">
      <Header />
      <Hero />
      <Features />
      <About />
      <BarberPoleHistory />
      <Footer />
    </div>
  )
}

export default LandingPage

