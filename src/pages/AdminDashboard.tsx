import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import LayoutAdmin from '../components/LayoutAdmin/LayoutAdmin'
import LoadingBarber from '../components/LoadingBarber/LoadingBarber'
import { adminService, MetricasAdmin } from '../services/adminService'
import './AdminDashboard.css'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const [metricas, setMetricas] = useState<MetricasAdmin | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    // Verificar se o usuário está autenticado como admin
    const usuarioStr = localStorage.getItem('usuario')
    if (!usuarioStr) {
      navigate('/login')
      return
    }

    try {
      const usuario = JSON.parse(usuarioStr)
      // Verificar se o usuário tem o papel ADMIN
      const papeis: string[] = usuario?.papeis || (usuario?.papel ? [usuario.papel] : [])
      
      if (!papeis.includes('ADMIN')) {
        navigate('/login')
        return
      }
    } catch (error) {
      navigate('/login')
      return
    }

    const carregarMetricas = async () => {
      try {
        const dados = await adminService.buscarMetricas()
        setMetricas(dados)
      } catch (error) {
        setErro(error instanceof Error ? error.message : 'Erro ao carregar métricas')
        // Se não autorizado, redirecionar para login
        if (error instanceof Error && error.message.includes('Não autorizado')) {
          navigate('/login')
        }
      } finally {
        setCarregando(false)
      }
    }

    carregarMetricas()
  }, [navigate])

  if (carregando) {
    return (
      <LayoutAdmin>
        <div className="dashboard-loading">
          <LoadingBarber size="large" text="Carregando métricas..." />
        </div>
      </LayoutAdmin>
    )
  }

  if (erro) {
    return (
      <LayoutAdmin>
        <div className="dashboard-error">
          <p>{erro}</p>
        </div>
      </LayoutAdmin>
    )
  }

  return (
    <LayoutAdmin>
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Dashboard Administrativo</h1>
          <p className="dashboard-subtitle">Visão geral do sistema NaRéguaÍ</p>
        </div>

        {metricas && (
          <>
            {/* Cards de Métricas de Barbearias */}
            <section className="dashboard-section">
              <h2 className="section-title">Status das Barbearias</h2>
              <div className="metrics-grid">
                <div className="metric-card metric-card-ativa">
                  <div className="metric-icon">✓</div>
                  <div className="metric-content">
                    <h3 className="metric-label">Ativas</h3>
                    <p className="metric-value">{metricas.barbearias.ativas}</p>
                  </div>
                </div>

                <div className="metric-card metric-card-inativa">
                  <div className="metric-icon">○</div>
                  <div className="metric-content">
                    <h3 className="metric-label">Inativas</h3>
                    <p className="metric-value">{metricas.barbearias.inativas}</p>
                  </div>
                </div>

                <div className="metric-card metric-card-pendente">
                  <div className="metric-icon">⏳</div>
                  <div className="metric-content">
                    <h3 className="metric-label">Pendentes de Pagamento</h3>
                    <p className="metric-value">{metricas.barbearias.pendentesPagamento}</p>
                  </div>
                </div>

                <div className="metric-card metric-card-bloqueada">
                  <div className="metric-icon">🚫</div>
                  <div className="metric-content">
                    <h3 className="metric-label">Bloqueadas</h3>
                    <p className="metric-value">{metricas.barbearias.bloqueadas}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Funil de Vendas */}
            <section className="dashboard-section">
              <h2 className="section-title">Funil de Vendas</h2>
              <div className="funil-container">
                <div className="funil-stage funil-visitantes">
                  <div className="funil-label">
                    <span>Visitantes</span>
                    <span className="funil-value">{metricas.funilVendas.visitantes}</span>
                  </div>
                  <div className="funil-bar" style={{ width: '100%' }}></div>
                </div>

                <div className="funil-stage funil-leads">
                  <div className="funil-label">
                    <span>Leads</span>
                    <span className="funil-value">{metricas.funilVendas.leads}</span>
                  </div>
                  <div className="funil-bar" style={{ width: `${(metricas.funilVendas.leads / metricas.funilVendas.visitantes) * 100}%` }}></div>
                </div>

                <div className="funil-stage funil-agendamentos">
                  <div className="funil-label">
                    <span>Agendamentos</span>
                    <span className="funil-value">{metricas.funilVendas.agendamentos}</span>
                  </div>
                  <div className="funil-bar" style={{ width: `${(metricas.funilVendas.agendamentos / metricas.funilVendas.visitantes) * 100}%` }}></div>
                </div>

                <div className="funil-stage funil-confirmados">
                  <div className="funil-label">
                    <span>Confirmados</span>
                    <span className="funil-value">{metricas.funilVendas.confirmados}</span>
                  </div>
                  <div className="funil-bar" style={{ width: `${(metricas.funilVendas.confirmados / metricas.funilVendas.visitantes) * 100}%` }}></div>
                </div>

                <div className="funil-stage funil-concluidos">
                  <div className="funil-label">
                    <span>Concluídos</span>
                    <span className="funil-value">{metricas.funilVendas.concluidos}</span>
                  </div>
                  <div className="funil-bar" style={{ width: `${(metricas.funilVendas.concluidos / metricas.funilVendas.visitantes) * 100}%` }}></div>
                </div>

                <div className="funil-stage funil-cancelados">
                  <div className="funil-label">
                    <span>Cancelados</span>
                    <span className="funil-value">{metricas.funilVendas.cancelados}</span>
                  </div>
                  <div className="funil-bar" style={{ width: `${(metricas.funilVendas.cancelados / metricas.funilVendas.visitantes) * 100}%` }}></div>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </LayoutAdmin>
  )
}

export default AdminDashboard

