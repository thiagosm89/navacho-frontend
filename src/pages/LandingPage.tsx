import Header from '../components/Header/Header'
import Hero from '../components/Hero/Hero'
import Features from '../components/Features/Features'
import About from '../components/About/About'
import Footer from '../components/Footer/Footer'
import './LandingPage.css'

const LandingPage = () => {
  return (
    <div className="landing-page">
      <Header />
      <Hero />
      <Features />
      <About />
      <Footer />
    </div>
  )
}

export default LandingPage

