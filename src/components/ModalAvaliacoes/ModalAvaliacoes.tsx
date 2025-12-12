import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { buscarAvaliacoes } from '../../services/mockAvaliacoesService'
import './ModalAvaliacoes.css'

interface Avaliacao {
  id: number
  cliente: string
  nota: number
  comentario: string
  data: string
}

interface ModalAvaliacoesProps {
  barbeariaId: number
  barbeariaNome: string
  avaliacaoMedia: number
  totalAvaliacoes: number
  onFechar: () => void
}

const ModalAvaliacoes = ({ 
  barbeariaId,
  barbeariaNome, 
  avaliacaoMedia, 
  totalAvaliacoes,
  onFechar 
}: ModalAvaliacoesProps) => {
  const [filtroEstrelas, setFiltroEstrelas] = useState<number | null>(null)
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([])
  const [paginaAtual, setPaginaAtual] = useState(1)
  const [totalAvaliacoesFiltradas, setTotalAvaliacoesFiltradas] = useState(0)
  const itensPorLote = 10 // Carregar 10 por vez
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const observerTargetRef = useRef<HTMLDivElement>(null)
  const [carregando, setCarregando] = useState(false)
  const [carregandoInicial, setCarregandoInicial] = useState(true)
  const [temMais, setTemMais] = useState(true)

  // Bloquear scroll do body quando o modal estiver aberto
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

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

  // Carregar avaliações iniciais
  useEffect(() => {
    const carregarAvaliacoesIniciais = async () => {
      setCarregandoInicial(true)
      try {
        const resultado = await buscarAvaliacoes(barbeariaId, 1, itensPorLote, filtroEstrelas)
        setAvaliacoes(resultado.avaliacoes)
        setTotalAvaliacoesFiltradas(resultado.total)
        setTemMais(resultado.temMais)
        setPaginaAtual(1)
      } catch (error) {
        console.error('Erro ao carregar avaliações:', error)
      } finally {
        setCarregandoInicial(false)
      }
    }

    carregarAvaliacoesIniciais()
  }, [barbeariaId, filtroEstrelas]) // Recarrega quando muda o filtro

  // Resetar quando mudar filtro
  const handleFiltroChange = (estrelas: number | null) => {
    setFiltroEstrelas(estrelas)
    setAvaliacoes([])
    setPaginaAtual(0)
    setCarregandoInicial(true)
    // O useEffect vai recarregar automaticamente quando filtroEstrelas mudar
  }

  // Função para carregar mais avaliações
  const carregarMais = useCallback(async () => {
    if (carregando || !temMais) return
    
    setCarregando(true)
    try {
      const proximaPagina = paginaAtual + 1
      const resultado = await buscarAvaliacoes(barbeariaId, proximaPagina, itensPorLote, filtroEstrelas)
      
      setAvaliacoes(prev => [...prev, ...resultado.avaliacoes])
      setPaginaAtual(proximaPagina)
      setTemMais(resultado.temMais)
    } catch (error) {
      console.error('Erro ao carregar mais avaliações:', error)
    } finally {
      setCarregando(false)
    }
  }, [carregando, temMais, paginaAtual, barbeariaId, filtroEstrelas, itensPorLote])

  // Intersection Observer para detectar quando chegar no final
  useEffect(() => {
    const currentTarget = observerTargetRef.current
    const scrollContainer = scrollContainerRef.current
    
    if (!currentTarget || carregandoInicial) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && temMais && !carregando) {
          carregarMais()
        }
      },
      {
        root: scrollContainer, // Usar o container de scroll do modal
        rootMargin: '200px', // Começar a carregar 200px antes do final
        threshold: 0.1
      }
    )

    // Pequeno delay para garantir que o DOM está pronto
    const timeoutId = setTimeout(() => {
      if (currentTarget) {
        observer.observe(currentTarget)
      }
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      if (currentTarget) {
        observer.unobserve(currentTarget)
      }
    }
  }, [temMais, carregando, carregarMais, carregandoInicial])

  // Renderizar o modal usando Portal diretamente no body para ser global
  const modalContent = (
    <div className="modal-overlay" onClick={onFechar}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Avaliações - {barbeariaNome}</h2>
          <button className="modal-close" onClick={onFechar}>×</button>
        </div>

        <div className="modal-body" ref={scrollContainerRef}>
          <div className="modal-stats">
            <div className="stat-item">
              <span className="stat-value">{avaliacaoMedia.toFixed(1)}</span>
              <span className="stat-label">Média</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{totalAvaliacoes}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{totalAvaliacoesFiltradas}</span>
              <span className="stat-label">Filtradas</span>
            </div>
          </div>

          <div className="modal-filtros">
            <span className="filtros-label">Filtrar por:</span>
            <div className="filtros-buttons">
              <button
                className={`filtro-btn ${filtroEstrelas === null ? 'ativo' : ''}`}
                onClick={() => handleFiltroChange(null)}
              >
                Todas
              </button>
              {[5, 4, 3, 2, 1].map(estrelas => (
                <button
                  key={estrelas}
                  className={`filtro-btn ${filtroEstrelas === estrelas ? 'ativo' : ''}`}
                  onClick={() => handleFiltroChange(estrelas)}
                >
                  {estrelas} {estrelas === 1 ? 'estrela' : 'estrelas'}
                </button>
              ))}
            </div>
          </div>

          <div className="modal-avaliacoes-list">
            {carregandoInicial ? (
              <div className="carregando-inicial">
                <div className="spinner"></div>
                <span>Carregando avaliações...</span>
              </div>
            ) : avaliacoes.length === 0 ? (
              <p className="sem-avaliacoes">Nenhuma avaliação encontrada com o filtro selecionado.</p>
            ) : (
              <>
                {avaliacoes.map((avaliacao) => (
                  <div key={avaliacao.id} className="avaliacao-item-modal">
                    <div className="avaliacao-header-modal">
                      <span className="avaliacao-cliente-modal">{avaliacao.cliente}</span>
                      <div className="avaliacao-meta-modal">
                        <div className="avaliacao-estrelas-modal">
                          {renderizarEstrelas(avaliacao.nota)}
                        </div>
                        <span className="avaliacao-data-modal">{formatarData(avaliacao.data)}</span>
                      </div>
                    </div>
                    <p className="avaliacao-comentario-modal">{avaliacao.comentario}</p>
                  </div>
                ))}
                
                {/* Elemento observado para scroll infinito */}
                {temMais && (
                  <div ref={observerTargetRef} className="scroll-observer">
                    {carregando && (
                      <div className="carregando-mais">
                        <div className="spinner"></div>
                        <span>Carregando mais avaliações do servidor...</span>
                      </div>
                    )}
                  </div>
                )}
                
                {!temMais && avaliacoes.length > 0 && (
                  <div className="fim-lista">
                    <p>Você viu todas as {totalAvaliacoesFiltradas} avaliações!</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  // Usar Portal para renderizar no body, fora da hierarquia do componente
  return createPortal(modalContent, document.body)
}

export default ModalAvaliacoes

