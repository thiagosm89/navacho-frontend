import './ResumoIA.css'

interface ResumoIAProps {
  avaliacoes: Array<{
    nota: number
    comentario: string
  }>
}

const ResumoIA = ({ avaliacoes }: ResumoIAProps) => {
  // Simular análise de IA baseada nas avaliações
  const gerarResumo = () => {
    if (avaliacoes.length === 0) {
      return 'Ainda não há avaliações suficientes para gerar um resumo.'
    }

    const notas = avaliacoes.map(a => a.nota)
    const media = notas.reduce((a, b) => a + b, 0) / notas.length
    const comentarios = avaliacoes.map(a => a.comentario.toLowerCase())

    // Análise simples baseada em palavras-chave
    const palavrasPositivas = ['excelente', 'ótimo', 'bom', 'satisfeito', 'recomendo', 'profissional', 'limpo', 'organizado', 'qualidade']
    const palavrasNegativas = ['ruim', 'demorou', 'problema', 'insatisfeito', 'não recomendo']

    let pontosPositivos: string[] = []
    let pontosNegativos: string[] = []

    comentarios.forEach(comentario => {
      palavrasPositivas.forEach(palavra => {
        if (comentario.includes(palavra) && !pontosPositivos.includes(palavra)) {
          pontosPositivos.push(palavra)
        }
      })
      palavrasNegativas.forEach(palavra => {
        if (comentario.includes(palavra) && !pontosNegativos.includes(palavra)) {
          pontosNegativos.push(palavra)
        }
      })
    })

    const resumo: string[] = []

    if (media >= 4.5) {
      resumo.push(`Com uma avaliação média de ${media.toFixed(1)} estrelas, esta barbearia recebe avaliações muito positivas.`)
    } else if (media >= 4.0) {
      resumo.push(`Com uma avaliação média de ${media.toFixed(1)} estrelas, esta barbearia tem uma boa reputação entre os clientes.`)
    } else {
      resumo.push(`Com uma avaliação média de ${media.toFixed(1)} estrelas, há espaço para melhorias.`)
    }

    if (pontosPositivos.length > 0) {
      const principais = pontosPositivos.slice(0, 3).join(', ')
      resumo.push(`Os clientes destacam principalmente: ${principais}.`)
    }

    if (pontosNegativos.length > 0 && media < 4.5) {
      resumo.push(`Alguns pontos mencionados que podem ser melhorados: ${pontosNegativos.join(', ')}.`)
    }

    if (resumo.length === 1) {
      resumo.push('Os clientes valorizam a qualidade do serviço e o atendimento profissional.')
    }

    return resumo.join(' ')
  }

  return (
    <div className="resumo-ia">
      <div className="resumo-ia-header">
        <span className="resumo-ia-icon">🤖</span>
        <h4 className="resumo-ia-title">Resumo por IA</h4>
      </div>
      <p className="resumo-ia-texto">{gerarResumo()}</p>
    </div>
  )
}

export default ResumoIA

