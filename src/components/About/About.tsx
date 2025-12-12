import './About.css'

const About = () => {
  return (
    <section id="sobre" className="about">
      <div className="about-container">
        <div className="about-content">
          <h2 className="about-title">Sobre o Navacho</h2>
          <div className="about-text">
            <p className="about-paragraph">
              O <strong>Navacho</strong> nasceu da paixão pela tradição gaúcha e pela 
              necessidade de modernizar o setor de barbearias no Rio Grande do Sul. 
              Unimos o melhor dos dois mundos: a autenticidade do trabalho artesanal 
              com a eficiência da tecnologia digital.
            </p>
            <p className="about-paragraph">
              Nossa plataforma conecta <strong>barbeiros</strong> a <strong>clientes</strong>, 
              facilitando o agendamento e a gestão de serviços de forma simples e intuitiva. 
              Também aproximamos <strong>fornecedores</strong> das barbearias, criando uma 
              rede completa de negócios que fortalece toda a cadeia produtiva do setor.
            </p>
            <p className="about-paragraph">
              Com o Navacho, você tem em mãos uma ferramenta poderosa para crescer seu 
              negócio, manter seus clientes satisfeitos e expandir suas conexões no mercado. 
              Tudo isso mantendo viva a essência e os valores da cultura gaúcha.
            </p>
          </div>
        </div>
        <div className="about-visual">
          <div className="about-card">
            <div className="card-icon">🎯</div>
            <h3>Missão</h3>
            <p>Conectar e fortalecer a comunidade de barbearias gaúchas através da tecnologia, preservando a tradição e valorizando o trabalho artesanal.</p>
          </div>
          <div className="about-card">
            <div className="card-icon">🌟</div>
            <h3>Visão</h3>
            <p>Ser a principal plataforma de gestão e conexão para barbearias do Brasil, começando pelo Rio Grande do Sul e expandindo nossa tradição gaúcha.</p>
          </div>
          <div className="about-card">
            <div className="card-icon">💪</div>
            <h3>Valores</h3>
            <p>Tradição, qualidade, inovação e respeito pela cultura gaúcha. Valorizamos o trabalho artesanal e a tecnologia que potencializa o crescimento.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
