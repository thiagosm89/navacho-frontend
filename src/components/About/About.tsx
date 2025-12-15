import './About.css'

const About = () => {
  return (
    <section id="sobre" className="about">
      <div className="about-container">
        <div className="about-content">
          <h2 className="about-title">Sobre o NaRéguaÍ</h2>
          <div className="about-text">
            <p className="about-paragraph">
              O <strong>NaRéguaÍ</strong> nasceu da paixão por transformar visuais 
              e elevar a autoestima através de cuidados de excelência. Acreditamos que um bom visual 
              não é apenas estética, é confiança, é identidade, é expressão pessoal.
            </p>
            <p className="about-paragraph">
              Nossa plataforma conecta pessoas que buscam qualidade e estilo aos melhores 
              <strong> barbeiros</strong> e <strong>barbearias</strong>, facilitando o agendamento 
              e oferecendo uma experiência completa. Também aproximamos <strong>fornecedores </strong> 
              das barbearias, criando uma rede completa que fortalece toda a cadeia de cuidados do visual.
            </p>
            <p className="about-paragraph">
              Com o NaRéguaÍ, você tem em mãos uma ferramenta poderosa para encontrar profissionais 
              que entendem que cada corte é único, cada estilo é pessoal, e que transformar o visual 
              é transformar sua confiança e autoestima.
            </p>
          </div>
        </div>
        <div className="about-visual">
          <div className="about-card">
            <div className="card-icon">🎯</div>
            <h3>Missão</h3>
            <p>Ser referência em cuidados do visual de qualidade, conectando pessoas que valorizam excelência aos melhores profissionais e estabelecendo um novo padrão em barbearias e serviços.</p>
          </div>
          <div className="about-card">
            <div className="card-icon">🌟</div>
            <h3>Visão</h3>
            <p>Ser a principal plataforma de agendamento e conexão para barbearias e barbeiros do Brasil, reconhecida por elevar a qualidade e o padrão dos cuidados do visual.</p>
          </div>
          <div className="about-card">
            <div className="card-icon">💪</div>
            <h3>Valores</h3>
            <p>Excelência, qualidade, inovação e respeito pela individualidade. Valorizamos o trabalho artesanal, a atenção aos detalhes e a tecnologia que potencializa a transformação.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
