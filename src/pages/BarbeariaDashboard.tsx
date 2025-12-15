import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import LayoutAdmin from '../components/LayoutAdmin/LayoutAdmin'
import LoadingBarber from '../components/LoadingBarber/LoadingBarber'
import { estoqueService, NotificacaoEstoque } from '../services/estoqueService'
import { barbeariaService, Agendamento, MetricasBarbearia } from '../services/barbeariaService'
import './BarbeariaDashboard.css'

const BarbeariaDashboard = () => {
  const navigate = useNavigate()
  const [notificacoes, setNotificacoes] = useState<NotificacaoEstoque[]>([])
  const [agendamentosHoje, setAgendamentosHoje] = useState<Agendamento[]>([])
  const [metricas, setMetricas] = useState<MetricasBarbearia | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    // Verificar se o usuário está autenticado como ADMIN_BARBEARIA
    const usuarioStr = localStorage.getItem('usuario')
    if (!usuarioStr) {
      navigate('/login')
      return
    }

    try {
      const usuario = JSON.parse(usuarioStr)
      if (usuario.papel !== 'ADMIN_BARBEARIA') {
        navigate('/login')
        return
      }
    } catch {
      navigate('/login')
      return
    }

    const carregarDados = async () => {
      try {
        // Carregar notificações de estoque, agendamentos e métricas em paralelo
        const [notifs, agendamentos, metricasData] = await Promise.all([
          estoqueService.obterNotificacoes(),
          barbeariaService.listarAgendamentos({
            data_inicio: new Date().toISOString().split('T')[0],
            status: 'CONFIRMADO'
          }),
          barbeariaService.obterMetricas()
        ])
        
        setNotificacoes(notifs)
        setAgendamentosHoje(agendamentos)
        setMetricas(metricasData)
      } catch (error) {
        setErro(error instanceof Error ? error.message : 'Erro ao carregar dados')
        if (error instanceof Error && error.message.includes('Não autorizado')) {
          navigate('/login')
        }
      } finally {
        setCarregando(false)
      }
    }

    carregarDados()
  }, [navigate])

  if (carregando) {
    return (
      <LayoutAdmin>
        <div className="barbearia-dashboard-loading">
          <LoadingBarber size="large" text="Carregando dashboard..." />
        </div>
      </LayoutAdmin>
    )
  }

  if (erro) {
    return (
      <LayoutAdmin>
        <div className="barbearia-dashboard-error">
          <p>{erro}</p>
        </div>
      </LayoutAdmin>
    )
  }

  const getNivelCriticoClass = (nivel: string) => {
    switch (nivel) {
      case 'zerado':
        return 'critico-zerado'
      case 'muito_baixo':
        return 'critico-muito-baixo'
      case 'baixo':
        return 'critico-baixo'
      default:
        return ''
    }
  }

  const getNivelCriticoLabel = (nivel: string) => {
    switch (nivel) {
      case 'zerado':
        return 'Zerado'
      case 'muito_baixo':
        return 'Muito Baixo'
      case 'baixo':
        return 'Baixo'
      default:
        return ''
    }
  }

  return (
    <LayoutAdmin>
      <div className="barbearia-dashboard-container">
        <div className="barbearia-dashboard-header">
          <h1 className="barbearia-dashboard-title">Dashboard da Barbearia</h1>
          <p className="barbearia-dashboard-subtitle">Visão geral e notificações importantes</p>
        </div>

        {/* Métricas de Clientes Atendidos */}
        {metricas && (
          <section className="dashboard-section">
            <h2 className="section-title">📊 Clientes Atendidos</h2>
            <div className="metricas-grid">
              <div className="metrica-card">
                <div className="metrica-icon">📅</div>
                <div className="metrica-content">
                  <h3 className="metrica-label">Hoje</h3>
                  <p className="metrica-value">{metricas.clientes_atendidos.dia}</p>
                  <span className="metrica-subtitle">clientes únicos</span>
                </div>
              </div>
              
              <div className="metrica-card">
                <div className="metrica-icon">📆</div>
                <div className="metrica-content">
                  <h3 className="metrica-label">Esta Semana</h3>
                  <p className="metrica-value">{metricas.clientes_atendidos.semana}</p>
                  <span className="metrica-subtitle">clientes únicos</span>
                </div>
              </div>
              
              <div className="metrica-card">
                <div className="metrica-icon">🗓️</div>
                <div className="metrica-content">
                  <h3 className="metrica-label">Este Mês</h3>
                  <p className="metrica-value">{metricas.clientes_atendidos.mes}</p>
                  <span className="metrica-subtitle">clientes únicos</span>
                </div>
              </div>
              
              <div className="metrica-card">
                <div className="metrica-icon">📈</div>
                <div className="metrica-content">
                  <h3 className="metrica-label">Este Ano</h3>
                  <p className="metrica-value">{metricas.clientes_atendidos.ano}</p>
                  <span className="metrica-subtitle">clientes únicos</span>
                </div>
              </div>
            </div>

            <div className="metricas-atendimentos">
              <h3 className="metricas-atendimentos-titulo">Total de Atendimentos</h3>
              <div className="atendimentos-grid">
                <div className="atendimento-item">
                  <span className="atendimento-periodo">Hoje:</span>
                  <span className="atendimento-valor">{metricas.atendimentos.dia}</span>
                </div>
                <div className="atendimento-item">
                  <span className="atendimento-periodo">Semana:</span>
                  <span className="atendimento-valor">{metricas.atendimentos.semana}</span>
                </div>
                <div className="atendimento-item">
                  <span className="atendimento-periodo">Mês:</span>
                  <span className="atendimento-valor">{metricas.atendimentos.mes}</span>
                </div>
                <div className="atendimento-item">
                  <span className="atendimento-periodo">Ano:</span>
                  <span className="atendimento-valor">{metricas.atendimentos.ano}</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Notificações de Estoque */}
        {notificacoes.length > 0 && (
          <section className="dashboard-section">
            <div className="section-header">
              <h2 className="section-title">
                ⚠️ Notificações de Estoque
                <span className="badge-notificacao">{notificacoes.length}</span>
              </h2>
              <button 
                className="btn-ver-estoque"
                onClick={() => navigate('/barbearia/estoque')}
              >
                Ver Estoque Completo →
              </button>
            </div>
            
            <div className="notificacoes-grid">
              {notificacoes.map((notif) => (
                <div 
                  key={notif.item.id} 
                  className={`notificacao-card ${getNivelCriticoClass(notif.nivel_critico)}`}
                >
                  <div className="notificacao-header">
                    <span className={`badge-nivel ${getNivelCriticoClass(notif.nivel_critico)}`}>
                      {getNivelCriticoLabel(notif.nivel_critico)}
                    </span>
                    <span className="notificacao-categoria">{notif.item.categoria}</span>
                  </div>
                  <h3 className="notificacao-item-nome">{notif.item.nome}</h3>
                  <div className="notificacao-info">
                    <div className="info-row">
                      <span className="info-label">Quantidade atual:</span>
                      <span className="info-value">{notif.item.quantidade} {notif.item.unidade_medida}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Mínimo:</span>
                      <span className="info-value">{notif.item.quantidade_minima} {notif.item.unidade_medida}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Restante:</span>
                      <span className={`info-value ${getNivelCriticoClass(notif.nivel_critico)}`}>
                        {notif.percentual_restante.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  <button 
                    className="btn-repor-estoque"
                    onClick={() => navigate(`/barbearia/estoque?item=${notif.item.id}`)}
                  >
                    Repor Estoque
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Agendamentos de Hoje */}
        <section className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">📅 Agendamentos de Hoje</h2>
            <button 
              className="btn-ver-agendamentos"
              onClick={() => navigate('/barbearia/agendamentos')}
            >
              Ver Todos →
            </button>
          </div>
          
          {agendamentosHoje.length === 0 ? (
            <div className="empty-state">
              <p>Nenhum agendamento confirmado para hoje</p>
            </div>
          ) : (
            <div className="agendamentos-list">
              {agendamentosHoje.slice(0, 5).map((agendamento) => (
                <div key={agendamento.id} className="agendamento-card">
                  <div className="agendamento-info">
                    <div className="agendamento-horario">
                      {new Date(agendamento.data_hora).toLocaleTimeString('pt-BR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                    <div className="agendamento-detalhes">
                      <h4 className="agendamento-cliente">{agendamento.cliente_nome}</h4>
                      <p className="agendamento-servico">{agendamento.servico}</p>
                      <p className="agendamento-barbeiro">Barbeiro: {agendamento.barbeiro_nome}</p>
                    </div>
                  </div>
                  <span className={`badge-status status-${agendamento.status.toLowerCase()}`}>
                    {agendamento.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Cards de Acesso Rápido */}
        <section className="dashboard-section">
          <h2 className="section-title">Acesso Rápido</h2>
          <div className="acesso-rapido-grid">
            <button 
              className="acesso-rapido-card"
              onClick={() => navigate('/barbearia/barbeiros')}
            >
              <div className="card-icon">💇</div>
              <h3>Gerenciar Barbeiros</h3>
              <p>Cadastrar e gerenciar barbeiros</p>
            </button>
            
            <button 
              className="acesso-rapido-card"
              onClick={() => navigate('/barbearia/agendamentos')}
            >
              <div className="card-icon">📅</div>
              <h3>Agendamentos</h3>
              <p>Visualizar e gerenciar agendamentos</p>
            </button>
            
            <button 
              className="acesso-rapido-card"
              onClick={() => navigate('/barbearia/estoque')}
            >
              <div className="card-icon">📦</div>
              <h3>Estoque</h3>
              <p>Gerenciar produtos e materiais</p>
            </button>
            
            <button 
              className="acesso-rapido-card"
              onClick={() => navigate('/barbearia/servicos')}
            >
              <div className="card-icon">✂️</div>
              <h3>Serviços</h3>
              <p>Cadastrar e gerenciar serviços oferecidos</p>
            </button>
          </div>
        </section>
      </div>
    </LayoutAdmin>
  )
}

export default BarbeariaDashboard

