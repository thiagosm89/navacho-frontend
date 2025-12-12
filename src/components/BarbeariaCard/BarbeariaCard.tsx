import { useState } from 'react'
import './BarbeariaCard.css'

interface Avaliacao {
  id: number
  cliente: string
  nota: number
  comentario: string
  data: string
}

interface Coordenadas {
  latitude: number
  longitude: number
}

interface Barbearia {
  id: number
  nome: string
  endereco: string
  cidade: string
  telefone: string
  imagem?: string
  avaliacaoMedia: number
  totalAvaliacoes: number
  avaliacoes: Avaliacao[]
  horarioFuncionamento: string
  servicos: string[]
  coordenadas: Coordenadas
  distancia?: number
}

interface BarbeariaCardProps {
  barbearia: Barbearia
}

const BarbeariaCard = ({ barbearia }: BarbeariaCardProps) => {
  const [mostrarAvaliacoes, setMostrarAvaliacoes] = useState(false)

  const renderizarEstrelas = (nota: number) => {
    const estrelas = []
    const notaInteira = Math.floor(nota)
    const temMeia = nota % 1 >= 0.5

    for (let i = 0; i < 5; i++) {
      if (i < notaInteira) {
        estrelas.push(<span key={i} className="estrela estrela-preenchida">★</span>)
      } else if (i === notaInteira && temMeia) {
        estrelas.push(<span key={i} className="estrela estrela-meia">★</span>)
      } else {
        estrelas.push(<span key={i} className="estrela estrela-vazia">★</span>)
      }
    }
    return estrelas
  }

  const formatarData = (data: string) => {
    const date = new Date(data)
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  return (
    <div className="barbearia-card">
      <div className="barbearia-card-header">
        <div className="barbearia-header-top">
          <h2 className="barbearia-nome">{barbearia.nome}</h2>
          {barbearia.distancia !== undefined && (
            <span className="barbearia-distancia">
              📍 {barbearia.distancia < 1 
                ? `${Math.round(barbearia.distancia * 1000)}m` 
                : `${barbearia.distancia.toFixed(1)}km`}
            </span>
          )}
        </div>
        <div className="barbearia-avaliacao">
          <div className="avaliacao-estrelas">
            {renderizarEstrelas(barbearia.avaliacaoMedia)}
          </div>
          <span className="avaliacao-media">{barbearia.avaliacaoMedia.toFixed(1)}</span>
          <span className="avaliacao-total">({barbearia.totalAvaliacoes} avaliações)</span>
        </div>
      </div>

      <div className="barbearia-info">
        <div className="info-item">
          <span className="info-icon">📍</span>
          <span>{barbearia.endereco}, {barbearia.cidade}</span>
        </div>
        <div className="info-item">
          <span className="info-icon">📞</span>
          <span>{barbearia.telefone}</span>
        </div>
        <div className="info-item">
          <span className="info-icon">🕐</span>
          <span>{barbearia.horarioFuncionamento}</span>
        </div>
      </div>

      <div className="barbearia-servicos">
        <h3 className="servicos-title">Serviços oferecidos:</h3>
        <div className="servicos-tags">
          {barbearia.servicos.map((servico, index) => (
            <span key={index} className="servico-tag">{servico}</span>
          ))}
        </div>
      </div>

      <div className="barbearia-actions">
        <button className="btn-agendar">Agendar Horário</button>
        <button 
          className="btn-avaliacoes"
          onClick={() => setMostrarAvaliacoes(!mostrarAvaliacoes)}
        >
          {mostrarAvaliacoes ? 'Ocultar' : 'Ver'} Avaliações ({barbearia.avaliacoes.length})
        </button>
      </div>

      {mostrarAvaliacoes && (
        <div className="barbearia-avaliacoes">
          <h3 className="avaliacoes-title">Avaliações dos Clientes</h3>
          {barbearia.avaliacoes.map((avaliacao) => (
            <div key={avaliacao.id} className="avaliacao-item">
              <div className="avaliacao-header">
                <span className="avaliacao-cliente">{avaliacao.cliente}</span>
                <div className="avaliacao-meta">
                  <div className="avaliacao-estrelas-pequenas">
                    {renderizarEstrelas(avaliacao.nota)}
                  </div>
                  <span className="avaliacao-data">{formatarData(avaliacao.data)}</span>
                </div>
              </div>
              <p className="avaliacao-comentario">{avaliacao.comentario}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default BarbeariaCard

