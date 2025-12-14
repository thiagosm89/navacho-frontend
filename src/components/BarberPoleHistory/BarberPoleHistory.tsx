import barberPoleImg from '../../assets/barber-pole.png'
import './BarberPoleHistory.css'

const BarberPoleHistory = () => {
  return (
    <section id="curiosidades" className="barber-pole-history">
      <div className="barber-pole-history-container">
        <div className="barber-pole-history-content">
          <h2 className="barber-pole-history-title">A Origem do Barber Pole</h2>
          
          <div className="barber-pole-image-wrapper">
            <img 
              src={barberPoleImg} 
              alt="Barber Pole - Poste de Barbearia Tradicional" 
              className="barber-pole-image"
            />
          </div>
          
          <div className="barber-pole-history-text">
            <p>
              O <strong>Barber Pole</strong> (poste de barbearia) é um dos símbolos mais reconhecidos 
              do mundo, representando a tradição e a arte da barbearia há séculos.
            </p>

            <div className="barber-pole-history-section">
              <h3 className="barber-pole-history-subtitle">Origens Medievais</h3>
              <p>
                Durante a Idade Média, os barbeiros não apenas cortavam cabelos e faziam barbas, 
                mas também realizavam procedimentos médicos como sangrias e extrações de dentes. 
                O poste de barbearia surgiu como uma forma de identificar esses estabelecimentos.
              </p>
            </div>

            <div className="barber-pole-history-section">
              <h3 className="barber-pole-history-subtitle">O Significado das Cores</h3>
              <p>
                As cores tradicionais do Barber Pole têm significados históricos profundos:
              </p>
              <ul className="barber-pole-history-list">
                <li>
                  <strong>Vermelho:</strong> Representava o sangue das sangrias realizadas pelos barbeiros-cirurgiões.
                </li>
                <li>
                  <strong>Branco:</strong> Simbolizava as bandagens usadas nos procedimentos médicos.
                </li>
                <li>
                  <strong>Azul:</strong> Adicionado posteriormente, representa as veias durante os procedimentos de sangria.
                </li>
              </ul>
            </div>

            <div className="barber-pole-history-section">
              <h3 className="barber-pole-history-subtitle">A Evolução</h3>
              <p>
                Com o tempo, a medicina se separou da barbearia, mas o símbolo permaneceu como 
                uma marca de tradição e excelência. Hoje, o Barber Pole continua sendo um símbolo 
                universal de barbearias profissionais, conectando o passado histórico com o presente moderno.
              </p>
            </div>

            <div className="barber-pole-history-footer">
              <p className="barber-pole-history-quote">
                "Um símbolo que transcende gerações, representando a arte, a tradição e a excelência 
                no cuidado masculino."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BarberPoleHistory

