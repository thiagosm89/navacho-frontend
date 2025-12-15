import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import LayoutAdmin from '../components/LayoutAdmin/LayoutAdmin'
import LoadingBarber from '../components/LoadingBarber/LoadingBarber'
import Modal from '../components/Modal/Modal'
import { barbeariaService, Agendamento, CriarAgendamentoRequest, Barbeiro, Servico } from '../services/barbeariaService'
import { estoqueService, ItemEstoque } from '../services/estoqueService'
import './AgendamentosBarbearia.css'

const AgendamentosBarbearia = () => {
  const navigate = useNavigate()
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])
  const [barbeiros, setBarbeiros] = useState<Barbeiro[]>([])
  const [servicos, setServicos] = useState<Servico[]>([])
  const [produtosVendaveis, setProdutosVendaveis] = useState<ItemEstoque[]>([])
  const [produtosAgendamento, setProdutosAgendamento] = useState<Map<string, number>>(new Map())
  const [servicosAgendamento, setServicosAgendamento] = useState<Map<string, string[]>>(new Map())
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [mostrarModalAtendimento, setMostrarModalAtendimento] = useState(false)
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState<Agendamento | null>(null)
  const [filtroStatus, setFiltroStatus] = useState<string>('')
  const [filtroBarbeiro, setFiltroBarbeiro] = useState<string>('')
  const [filtroData, setFiltroData] = useState<string>('')
  const [dataSelecionada, setDataSelecionada] = useState<Date>(new Date())
  const [mesAtual, setMesAtual] = useState<Date>(new Date())
  const dataParaRestaurarRef = useRef<string | null>(null)
  const [formData, setFormData] = useState<CriarAgendamentoRequest>({
    cliente_id: '',
    barbeiro_id: '',
    servico: '',
    data_hora: '',
    observacoes: '',
  })
  const [servicosSelecionadosForm, setServicosSelecionadosForm] = useState<string[]>([])

  useEffect(() => {
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

    carregarDados()
  }, [navigate])

  const identificarServicosDoAgendamento = (agendamento: Agendamento, servicosDisponiveis: Servico[]): string[] => {
    // O campo servico contém os nomes dos serviços separados por " + "
    // Exemplo: "Corte + Barba" ou "Barba"
    const nomesServicos = agendamento.servico.split('+').map(s => s.trim())
    const servicosIds: string[] = []
    
    // Para cada nome de serviço, encontrar o ID correspondente
    nomesServicos.forEach(nomeServico => {
      const servicoEncontrado = servicosDisponiveis.find(s => 
        s.nome.toLowerCase().trim() === nomeServico.toLowerCase().trim()
      )
      if (servicoEncontrado) {
        servicosIds.push(servicoEncontrado.id)
      }
    })
    
    return servicosIds
  }

  const carregarDados = async () => {
    setCarregando(true)
    setErro('')
    try {
      const [agendamentosData, barbeirosData, servicosData] = await Promise.all([
        barbeariaService.listarAgendamentos({
          status: filtroStatus || undefined,
          barbeiro_id: filtroBarbeiro || undefined,
        }),
        barbeariaService.listarBarbeiros(),
        barbeariaService.listarServicos(),
      ])
      setAgendamentos(agendamentosData)
      setBarbeiros(barbeirosData)
      const servicosAtivos = servicosData.filter(s => s.ativo)
      setServicos(servicosAtivos)
      
      // Recuperar serviços selecionados dos agendamentos existentes
      const novoMapServicos = new Map<string, string[]>()
      agendamentosData.forEach(agendamento => {
        const servicosIds = identificarServicosDoAgendamento(agendamento, servicosAtivos)
        if (servicosIds.length > 0) {
          novoMapServicos.set(agendamento.id, servicosIds)
        }
      })
      setServicosAgendamento(novoMapServicos)
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao carregar dados')
      if (error instanceof Error && error.message.includes('Não autorizado')) {
        navigate('/login')
      }
    } finally {
      setCarregando(false)
    }
  }

  const carregarProdutosVendaveis = async () => {
    try {
      const produtos = await estoqueService.listarProdutosVendaveis()
      setProdutosVendaveis(produtos)
    } catch (error) {
      console.error('Erro ao carregar produtos vendáveis:', error)
    }
  }

  const isHojeSelecionado = () => {
    if (!filtroData) return false
    const hoje = new Date()
    const dataSelecionada = parsearDataLocal(filtroData)
    return hoje.toDateString() === dataSelecionada.toDateString()
  }

  useEffect(() => {
    if (filtroData) {
      const hoje = new Date()
      const dataSelecionada = parsearDataLocal(filtroData)
      const ehHoje = hoje.toDateString() === dataSelecionada.toDateString()
      
      if (ehHoje) {
        carregarProdutosVendaveis()
      } else {
        setProdutosVendaveis([])
        setProdutosAgendamento(new Map())
      }
    } else {
      setProdutosVendaveis([])
      setProdutosAgendamento(new Map())
    }
  }, [filtroData])

  useEffect(() => {
    if (!carregando) {
      carregarDados()
    }
  }, [filtroStatus, filtroBarbeiro])

  // Restaurar data selecionada após recarregar dados (quando necessário)
  useEffect(() => {
    if (!carregando && dataParaRestaurarRef.current) {
      const dataParaRestaurar = dataParaRestaurarRef.current
      dataParaRestaurarRef.current = null
      setFiltroData(dataParaRestaurar)
      const dataRestaurada = parsearDataLocal(dataParaRestaurar)
      setDataSelecionada(dataRestaurada)
    }
  }, [carregando])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')

    if (!formData.cliente_id || !formData.barbeiro_id || !formData.data_hora) {
      setErro('Preencha todos os campos obrigatórios')
      return
    }

    if (servicosSelecionadosForm.length === 0) {
      setErro('Selecione pelo menos um serviço')
      return
    }

    try {
      // Criar string com os nomes dos serviços selecionados para o campo servico
      const nomesServicos = servicosSelecionadosForm
        .map(id => servicos.find(s => s.id === id)?.nome)
        .filter(Boolean)
        .join(' + ')
      
      const agendamentoCriado = await barbeariaService.criarAgendamento({
        ...formData,
        servico: nomesServicos || 'Serviços selecionados',
      })
      
      // Adicionar os serviços selecionados automaticamente ao agendamento criado
      if (agendamentoCriado && servicosSelecionadosForm.length > 0) {
        const novoMap = new Map(servicosAgendamento)
        novoMap.set(agendamentoCriado.id, servicosSelecionadosForm)
        setServicosAgendamento(novoMap)
      }
      
      setMostrarFormulario(false)
      setFormData({
        cliente_id: '',
        barbeiro_id: '',
        servico: '',
        data_hora: '',
        observacoes: '',
      })
      setServicosSelecionadosForm([])
      
      // Recarregar dados para atualizar a lista
      await carregarDados()
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao criar agendamento')
    }
  }

  const calcularTotalAgendamento = (agendamentoId: string): number => {
    let total = 0
    
    // Adicionar serviços adicionais
    const servicosAdicionais = servicosAgendamento.get(agendamentoId) || []
    servicosAdicionais.forEach(servicoId => {
      const servico = servicos.find(s => s.id === servicoId)
      if (servico) {
        total += servico.preco
      }
    })
    
    // Adicionar produtos
    produtosVendaveis.forEach(produto => {
      const quantidade = produtosAgendamento.get(`${agendamentoId}-${produto.id}`) || 0
      if (quantidade > 0 && produto.preco_unitario) {
        total += produto.preco_unitario * quantidade
      }
    })
    
    return total
  }

  const obterItensAgendamento = (agendamentoId: string) => {
    const itens: Array<{ tipo: 'servico' | 'produto', nome: string, preco: number, quantidade?: number }> = []
    
    // Serviços adicionais
    const servicosAdicionais = servicosAgendamento.get(agendamentoId) || []
    servicosAdicionais.forEach(servicoId => {
      const servico = servicos.find(s => s.id === servicoId)
      if (servico) {
        itens.push({
          tipo: 'servico',
          nome: servico.nome,
          preco: servico.preco
        })
      }
    })
    
    // Produtos
    produtosVendaveis.forEach(produto => {
      const quantidade = produtosAgendamento.get(`${agendamentoId}-${produto.id}`) || 0
      if (quantidade > 0 && produto.preco_unitario) {
        itens.push({
          tipo: 'produto',
          nome: produto.nome,
          preco: produto.preco_unitario,
          quantidade
        })
      }
    })
    
    return itens
  }

  const abrirModalAtendimento = (agendamento: Agendamento) => {
    setAgendamentoSelecionado(agendamento)
    setMostrarModalAtendimento(true)
  }

  const handleAdicionarServico = (agendamentoId: string, servicoId: string) => {
    const servicosAtuais = servicosAgendamento.get(agendamentoId) || []
    if (!servicosAtuais.includes(servicoId)) {
      const novoMap = new Map(servicosAgendamento)
      novoMap.set(agendamentoId, [...servicosAtuais, servicoId])
      setServicosAgendamento(novoMap)
    }
  }

  const handleRemoverServico = (agendamentoId: string, servicoId: string) => {
    const servicosAtuais = servicosAgendamento.get(agendamentoId) || []
    const novoMap = new Map(servicosAgendamento)
    novoMap.set(agendamentoId, servicosAtuais.filter(id => id !== servicoId))
    setServicosAgendamento(novoMap)
  }

  const handleAtualizarStatus = async (id: string, novoStatus: Agendamento['status']) => {
    // Salvar a data selecionada antes de atualizar para restaurar após recarregar
    if (filtroData) {
      dataParaRestaurarRef.current = filtroData
    }
    
    try {
      // Se estiver concluindo, calcular e exibir o total
      if (novoStatus === 'CONCLUIDO') {
        const agendamento = agendamentos.find(a => a.id === id)
        if (agendamento) {
          const total = calcularTotalAgendamento(id)
          const servicosAdicionais = servicosAgendamento.get(agendamento.id) || []
          const produtosSelecionados = produtosVendaveis
            .map(produto => {
              const quantidade = produtosAgendamento.get(`${agendamento.id}-${produto.id}`) || 0
              return quantidade > 0 ? { nome: produto.nome, quantidade, preco: produto.preco_unitario || 0 } : null
            })
            .filter(p => p !== null)
          
          let resumo = `Resumo do Atendimento:\n\n`
          resumo += `Cliente: ${agendamento.cliente_nome}\n`
          resumo += `Serviço Principal: ${agendamento.servico}\n\n`
          
          if (servicosAdicionais.length > 0) {
            resumo += `Serviços Adicionais:\n`
            servicosAdicionais.forEach(servicoId => {
              const servico = servicos.find(s => s.id === servicoId)
              if (servico) {
                resumo += `  - ${servico.nome}: R$ ${servico.preco.toFixed(2)}\n`
              }
            })
            resumo += `\n`
          }
          
          if (produtosSelecionados.length > 0) {
            resumo += `Produtos:\n`
            produtosSelecionados.forEach(produto => {
              if (produto) {
                resumo += `  - ${produto.nome} (${produto.quantidade}x): R$ ${(produto.preco * produto.quantidade).toFixed(2)}\n`
              }
            })
            resumo += `\n`
          }
          
          resumo += `Total Adicional: R$ ${total.toFixed(2)}\n\n`
          resumo += `Deseja concluir o atendimento?`
          
          const confirmar = window.confirm(resumo)
          if (!confirmar) {
            return
          }
        }
      }
      
      await barbeariaService.atualizarStatusAgendamento(id, novoStatus)
      
      // Limpar produtos e serviços do agendamento após concluir
      if (novoStatus === 'CONCLUIDO') {
        const novoMapProdutos = new Map(produtosAgendamento)
        const novoMapServicos = new Map(servicosAgendamento)
        
        produtosVendaveis.forEach(produto => {
          novoMapProdutos.delete(`${id}-${produto.id}`)
        })
        novoMapServicos.delete(id)
        
        setProdutosAgendamento(novoMapProdutos)
        setServicosAgendamento(novoMapServicos)
      }
      
      // Recarregar dados (a restauração da data será feita pelo useEffect quando carregando mudar para false)
      await carregarDados()
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao atualizar status')
    }
  }

  // Função auxiliar para formatar data no timezone local (evita problemas de UTC)
  const formatarDataLocal = (data: Date): string => {
    const ano = data.getFullYear()
    const mes = String(data.getMonth() + 1).padStart(2, '0')
    const dia = String(data.getDate()).padStart(2, '0')
    return `${ano}-${mes}-${dia}`
  }

  // Função auxiliar para converter string YYYY-MM-DD para Date local (evita problemas de UTC)
  const parsearDataLocal = (dataStr: string): Date => {
    const [ano, mes, dia] = dataStr.split('-').map(Number)
    // Criar data com horário meio-dia para evitar problemas de timezone
    return new Date(ano, mes - 1, dia, 12, 0, 0, 0)
  }

  // Funções auxiliares do calendário
  const getDiasDoMes = (data: Date) => {
    const ano = data.getFullYear()
    const mes = data.getMonth()
    const primeiroDia = new Date(ano, mes, 1)
    const ultimoDia = new Date(ano, mes + 1, 0)
    const diasNoMes = ultimoDia.getDate()
    const diaInicialSemana = primeiroDia.getDay()
    
    const dias: (Date | null)[] = []
    
    // Adicionar dias vazios do início
    for (let i = 0; i < diaInicialSemana; i++) {
      dias.push(null)
    }
    
    // Adicionar dias do mês - criar com horário 12:00:00 para evitar problemas de timezone
    for (let dia = 1; dia <= diasNoMes; dia++) {
      const dataDia = new Date(ano, mes, dia, 12, 0, 0, 0)
      dias.push(dataDia)
    }
    
    return dias
  }

  const getAgendamentosDoDia = (data: Date | null) => {
    if (!data) return []
    // Normalizar a data para meia-noite local para comparação precisa
    const ano = data.getFullYear()
    const mes = data.getMonth()
    const dia = data.getDate()
    const dataNormalizada = new Date(ano, mes, dia, 12, 0, 0, 0)
    const dataStr = formatarDataLocal(dataNormalizada)
    
    return agendamentos.filter((ag) => {
      // Converter a data do agendamento para data local para comparação
      const agData = new Date(ag.data_hora)
      const agAno = agData.getFullYear()
      const agMes = agData.getMonth()
      const agDia = agData.getDate()
      const agDataNormalizada = new Date(agAno, agMes, agDia, 12, 0, 0, 0)
      const agDataStr = formatarDataLocal(agDataNormalizada)
      
      if (agDataStr !== dataStr) return false
      if (filtroStatus && ag.status !== filtroStatus) return false
      if (filtroBarbeiro && ag.barbeiro_id !== filtroBarbeiro) return false
      return true
    })
  }

  const isHoje = (data: Date | null) => {
    if (!data) return false
    const hoje = new Date()
    return data.toDateString() === hoje.toDateString()
  }

  const isMesAtual = (data: Date | null) => {
    if (!data) return false
    return data.getMonth() === mesAtual.getMonth() && data.getFullYear() === mesAtual.getFullYear()
  }

  const navegarMes = (direcao: 'anterior' | 'proximo') => {
    const novoMes = new Date(mesAtual)
    if (direcao === 'anterior') {
      novoMes.setMonth(novoMes.getMonth() - 1)
    } else {
      novoMes.setMonth(novoMes.getMonth() + 1)
    }
    setMesAtual(novoMes)
  }

  const selecionarDia = (data: Date | null) => {
    if (data && isMesAtual(data)) {
      // Criar uma nova data com apenas dia/mês/ano para evitar problemas de horário
      const ano = data.getFullYear()
      const mes = data.getMonth()
      const dia = data.getDate()
      const dataLimpa = new Date(ano, mes, dia, 12, 0, 0, 0)
      
      setDataSelecionada(dataLimpa)
      // Usar formatação local para evitar problemas de timezone
      const dataStr = formatarDataLocal(dataLimpa)
      setFiltroData(dataStr)
    }
  }

  const agendamentosFiltrados = agendamentos.filter((ag) => {
    if (filtroStatus && ag.status !== filtroStatus) return false
    if (filtroBarbeiro && ag.barbeiro_id !== filtroBarbeiro) return false
    if (filtroData) {
      const dataAgendamento = new Date(ag.data_hora)
      const agDataStr = formatarDataLocal(dataAgendamento)
      if (agDataStr !== filtroData) return false
    }
    return true
  })

  const agendamentosDiaSelecionado = filtroData 
    ? agendamentosFiltrados.filter((ag) => {
        const dataAgendamento = new Date(ag.data_hora)
        return formatarDataLocal(dataAgendamento) === filtroData
      })
    : []

  if (carregando) {
    return (
      <LayoutAdmin>
        <div className="agendamentos-loading">
          <LoadingBarber size="large" text="Carregando atendimentos..." />
        </div>
      </LayoutAdmin>
    )
  }

  return (
    <LayoutAdmin>
      <div className="agendamentos-container">
        <div className="agendamentos-header">
          <h1 className="agendamentos-title">Atendimentos</h1>
          <button
            className="btn-novo-agendamento"
            onClick={() => setMostrarFormulario(true)}
          >
            + Novo Atendimento
          </button>
        </div>

        {erro && (
          <div className="agendamentos-erro">
            <p>{erro}</p>
          </div>
        )}

        {/* Calendário */}
        <div className="calendario-wrapper">
          <div className="calendario-header">
            <button 
              className="btn-navegar-mes"
              onClick={() => navegarMes('anterior')}
              aria-label="Mês anterior"
            >
              ←
            </button>
            <h2 className="calendario-mes-ano">
              {mesAtual.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            </h2>
            <button 
              className="btn-navegar-mes"
              onClick={() => navegarMes('proximo')}
              aria-label="Próximo mês"
            >
              →
            </button>
          </div>

          <div className="calendario-semana-header">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((dia) => (
              <div key={dia} className="dia-semana-header">
                {dia}
              </div>
            ))}
          </div>

          <div className="calendario-grid">
            {getDiasDoMes(mesAtual).map((dia, index) => {
              const agendamentosDia = getAgendamentosDoDia(dia)
              const temAgendamentos = agendamentosDia.length > 0
              // Normalizar a data do dia para comparação precisa (usar meio-dia para evitar problemas de timezone)
              const diaNormalizado = dia ? formatarDataLocal(new Date(dia.getFullYear(), dia.getMonth(), dia.getDate(), 12, 0, 0, 0)) : ''
              const selecionado = dia && filtroData && diaNormalizado === filtroData
              
              return (
                <div
                  key={index}
                  className={`calendario-dia ${!dia ? 'dia-vazio' : ''} ${!isMesAtual(dia) ? 'dia-outro-mes' : ''} ${isHoje(dia) ? 'dia-hoje' : ''} ${selecionado ? 'dia-selecionado' : ''} ${temAgendamentos ? 'dia-com-agendamentos' : ''}`}
                  onClick={() => selecionarDia(dia)}
                >
                  {dia && (
                    <>
                      <span className="dia-numero">{dia.getDate()}</span>
                      {temAgendamentos && (
                        <div className="dia-agendamentos-cards">
                          {agendamentosDia.slice(0, 2).map((ag, idx) => (
                            <div
                              key={idx}
                              className={`agendamento-card-mini status-${ag.status.toLowerCase()}`}
                              title={`${ag.cliente_nome} - ${ag.servico}`}
                            >
                              <span className="card-mini-horario">
                                {new Date(ag.data_hora).toLocaleTimeString('pt-BR', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                              <span className="card-mini-cliente">{ag.cliente_nome}</span>
                            </div>
                          ))}
                          {agendamentosDia.length > 2 && (
                            <div className="card-mini-mais">
                              +{agendamentosDia.length - 2} mais
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Filtros */}
        <div className="filtros-container">
          <div className="filtro-group">
            <label>Status</label>
            <select
              value={filtroStatus}
              onChange={(e) => {
                setFiltroStatus(e.target.value)
              }}
            >
              <option value="">Todos</option>
              <option value="PENDENTE">Pendente</option>
              <option value="CONFIRMADO">Confirmado</option>
              <option value="EM_ANDAMENTO">Em Andamento</option>
              <option value="CONCLUIDO">Concluído</option>
              <option value="CANCELADO">Cancelado</option>
            </select>
          </div>

          <div className="filtro-group">
            <label>Barbeiro</label>
            <select
              value={filtroBarbeiro}
              onChange={(e) => {
                setFiltroBarbeiro(e.target.value)
              }}
            >
              <option value="">Todos</option>
              {barbeiros.map((barbeiro) => (
                <option key={barbeiro.id} value={barbeiro.id}>
                  {barbeiro.nome}
                </option>
              ))}
            </select>
          </div>

          {filtroData && (
            <div className="filtro-group">
              <label>Data Selecionada</label>
              <button
                className="btn-limpar-data"
                onClick={() => {
                  setFiltroData('')
                  setDataSelecionada(new Date())
                }}
              >
                ✕ {parsearDataLocal(filtroData).toLocaleDateString('pt-BR')}
              </button>
            </div>
          )}
        </div>

        <Modal
          isOpen={mostrarFormulario}
          onClose={() => {
            setMostrarFormulario(false)
            setErro('')
            setFormData({
              cliente_id: '',
              barbeiro_id: '',
              servico: '',
              data_hora: '',
              observacoes: '',
            })
            setServicosSelecionadosForm([])
          }}
          title="Novo Atendimento"
          size="medium"
        >
          {erro && (
            <div className="agendamentos-erro" style={{ marginBottom: '1.5rem' }}>
              <p>{erro}</p>
            </div>
          )}
          <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="cliente_id">ID do Cliente *</label>
                <input
                  type="text"
                  id="cliente_id"
                  value={formData.cliente_id}
                  onChange={(e) => setFormData({ ...formData, cliente_id: e.target.value })}
                  required
                  placeholder="ID do cliente"
                />
              </div>

              <div className="form-group">
                <label htmlFor="barbeiro_id">Barbeiro *</label>
                <select
                  id="barbeiro_id"
                  value={formData.barbeiro_id}
                  onChange={(e) => setFormData({ ...formData, barbeiro_id: e.target.value })}
                  required
                >
                  <option value="">Selecione um barbeiro</option>
                  {barbeiros.map((barbeiro) => (
                    <option key={barbeiro.id} value={barbeiro.id}>
                      {barbeiro.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Serviços *</label>
                <div className="servicos-checkbox-group">
                  {servicos.length === 0 ? (
                    <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.875rem' }}>
                      Nenhum serviço cadastrado. Cadastre serviços primeiro.
                    </p>
                  ) : (
                    servicos.map((servico) => (
                      <label key={servico.id} className="servico-checkbox-label">
                        <input
                          type="checkbox"
                          checked={servicosSelecionadosForm.includes(servico.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setServicosSelecionadosForm([...servicosSelecionadosForm, servico.id])
                            } else {
                              setServicosSelecionadosForm(servicosSelecionadosForm.filter(id => id !== servico.id))
                            }
                          }}
                        />
                        <span className="servico-checkbox-text">
                          <span className="servico-checkbox-nome">{servico.nome}</span>
                          <span className="servico-checkbox-preco">R$ {servico.preco.toFixed(2)}</span>
                        </span>
                      </label>
                    ))
                  )}
                </div>
                {servicosSelecionadosForm.length > 0 && (
                  <p className="form-hint">
                    {servicosSelecionadosForm.length} serviço(s) selecionado(s)
                  </p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="data_hora">Data e Hora *</label>
                <input
                  type="datetime-local"
                  id="data_hora"
                  value={formData.data_hora}
                  onChange={(e) => setFormData({ ...formData, data_hora: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="observacoes">Observações</label>
                <textarea
                  id="observacoes"
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  rows={3}
                  placeholder="Observações adicionais..."
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-salvar">
                  Criar Atendimento
                </button>
                <button
                  type="button"
                  className="btn-cancelar"
                  onClick={() => {
                    setMostrarFormulario(false)
                    setFormData({
                      cliente_id: '',
                      barbeiro_id: '',
                      servico: '',
                      data_hora: '',
                      observacoes: '',
                    })
                    setServicosSelecionadosForm([])
                  }}
                >
                  Cancelar
                </button>
            </div>
          </form>
        </Modal>

        {/* Lista de Atendimentos - Apenas quando um dia for selecionado */}
        {filtroData && (
          <div className="agendamentos-list">
            {agendamentosDiaSelecionado.length === 0 ? (
              <div className="empty-state">
                <p>Nenhum atendimento para {parsearDataLocal(filtroData).toLocaleDateString('pt-BR')}</p>
              </div>
            ) : (
              <>
                <h3 className="agendamentos-dia-titulo">
                  Atendimentos de {parsearDataLocal(filtroData).toLocaleDateString('pt-BR', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long' 
                  })}
                </h3>
                <div className="agendamentos-lista-detalhada">
                  {agendamentosDiaSelecionado
                    .sort((a, b) => new Date(a.data_hora).getTime() - new Date(b.data_hora).getTime())
                    .map((agendamento) => (
                      <div key={agendamento.id} className="agendamento-card">
                        <div className="agendamento-header">
                          <div className="agendamento-header-left">
                            <div className="agendamento-horario">
                              {new Date(agendamento.data_hora).toLocaleTimeString('pt-BR', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </div>
                            <div className="agendamento-info-basica">
                              <div className="agendamento-cliente-barbeiro">
                                <h3 className="agendamento-cliente">
                                  {agendamento.cliente_nome}
                                </h3>
                                <p className="agendamento-barbeiro">💇 {agendamento.barbeiro_nome}</p>
                              </div>
                              {/* Lista de Itens Adicionados - Logo abaixo do nome */}
                              {obterItensAgendamento(agendamento.id).length > 0 && (
                                <div className="itens-adicionados-section">
                                  <div className="itens-adicionados-grid">
                                    {obterItensAgendamento(agendamento.id).map((item, index) => (
                                      <div key={index} className="item-adicionado-card">
                                        <div className="item-adicionado-icon">
                                          {item.tipo === 'servico' ? '✂️' : '🛍️'}
                                        </div>
                                        <div className="item-adicionado-info">
                                          <span className="item-nome">{item.nome}</span>
                                          {item.quantidade && item.quantidade > 1 && (
                                            <span className="item-quantidade-badge">{item.quantidade}x</span>
                                          )}
                                        </div>
                                        <span className="item-preco">
                                          R$ {(item.preco * (item.quantidade || 1)).toFixed(2)}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                  <div className="itens-total">
                                    <span className="itens-total-label">Total Adicional:</span>
                                    <span className="itens-total-valor">
                                      R$ {calcularTotalAgendamento(agendamento.id).toFixed(2)}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          <span className={`badge-status status-${agendamento.status.toLowerCase()}`}>
                            {agendamento.status}
                          </span>
                        </div>
                        
                        {agendamento.observacoes && (
                          <div className="agendamento-observacoes-wrapper">
                            <p className="agendamento-observacoes">📝 {agendamento.observacoes}</p>
                          </div>
                        )}
                        
                        <div className="agendamento-actions">
                          {isHojeSelecionado() && (
                            <button
                              className="btn-vender"
                              onClick={() => abrirModalAtendimento(agendamento)}
                            >
                              💼 Vender
                            </button>
                          )}
                          {agendamento.status === 'PENDENTE' && (
                            <>
                              <button
                                className="btn-confirmar"
                                onClick={() => handleAtualizarStatus(agendamento.id, 'CONFIRMADO')}
                              >
                                ✓ Confirmar
                              </button>
                              <button
                                className="btn-cancelar-agendamento"
                                onClick={() => handleAtualizarStatus(agendamento.id, 'CANCELADO')}
                              >
                                ✕ Cancelar
                              </button>
                            </>
                          )}
                          {agendamento.status === 'CONFIRMADO' && (
                            <button
                              className="btn-iniciar"
                              onClick={() => handleAtualizarStatus(agendamento.id, 'EM_ANDAMENTO')}
                            >
                              ▶ Iniciar
                            </button>
                          )}
                          {agendamento.status === 'EM_ANDAMENTO' && (
                            <button
                              className="btn-concluir"
                              onClick={() => handleAtualizarStatus(agendamento.id, 'CONCLUIDO')}
                            >
                              ✓ Concluir
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Modal de Atendimento - Adicionar Produtos e Serviços */}
        <Modal
          isOpen={mostrarModalAtendimento}
          onClose={() => {
            setMostrarModalAtendimento(false)
            setAgendamentoSelecionado(null)
          }}
          title={agendamentoSelecionado ? `Atendimento - ${agendamentoSelecionado.cliente_nome}` : 'Atendimento'}
          size="large"
        >
          {agendamentoSelecionado && (
            <div className="modal-atendimento-content">
              <div className="modal-atendimento-info">
                <p><strong>Serviço Principal:</strong> {agendamentoSelecionado.servico}</p>
                <p><strong>Barbeiro:</strong> {agendamentoSelecionado.barbeiro_nome}</p>
              </div>

              {/* Serviços Adicionais */}
              {servicos.length > 0 && (
                <div className="modal-servicos-section">
                  <h4 className="modal-section-titulo">✂️ Serviços Adicionais</h4>
                  <div className="modal-servicos-lista">
                    {servicos.map((servico) => {
                      const servicosAdicionais = servicosAgendamento.get(agendamentoSelecionado.id) || []
                      const adicionado = servicosAdicionais.includes(servico.id)
                      return (
                        <div key={servico.id} className="modal-servico-item">
                          <div className="modal-item-info">
                            <span className="modal-item-nome">{servico.nome}</span>
                            <span className="modal-item-preco">R$ {servico.preco.toFixed(2)}</span>
                          </div>
                          {adicionado ? (
                            <button
                              className="btn-remover-item"
                              onClick={() => handleRemoverServico(agendamentoSelecionado.id, servico.id)}
                            >
                              ✕ Remover
                            </button>
                          ) : (
                            <button
                              className="btn-adicionar-item"
                              onClick={() => handleAdicionarServico(agendamentoSelecionado.id, servico.id)}
                            >
                              + Adicionar
                            </button>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Produtos Vendáveis */}
              {produtosVendaveis.length > 0 && (
                <div className="modal-produtos-section">
                  <h4 className="modal-section-titulo">🛍️ Produtos</h4>
                  <div className="modal-produtos-lista">
                    {produtosVendaveis.map((produto) => {
                      const quantidade = produtosAgendamento.get(`${agendamentoSelecionado.id}-${produto.id}`) || 0
                      return (
                        <div key={produto.id} className="modal-produto-item">
                          <div className="modal-item-info">
                            <span className="modal-item-nome">{produto.nome}</span>
                            {produto.preco_unitario && (
                              <span className="modal-item-preco">R$ {produto.preco_unitario.toFixed(2)}</span>
                            )}
                          </div>
                          <div className="modal-produto-controls">
                            <button
                              className="btn-quantidade-modal"
                              onClick={() => {
                                const novaQuantidade = Math.max(0, quantidade - 1)
                                const novoMap = new Map(produtosAgendamento)
                                if (novaQuantidade === 0) {
                                  novoMap.delete(`${agendamentoSelecionado.id}-${produto.id}`)
                                } else {
                                  novoMap.set(`${agendamentoSelecionado.id}-${produto.id}`, novaQuantidade)
                                }
                                setProdutosAgendamento(novoMap)
                              }}
                              disabled={quantidade === 0}
                            >
                              −
                            </button>
                            <span className="modal-quantidade">{quantidade}</span>
                            <button
                              className="btn-quantidade-modal"
                              onClick={() => {
                                const novaQuantidade = quantidade + 1
                                const novoMap = new Map(produtosAgendamento)
                                novoMap.set(`${agendamentoSelecionado.id}-${produto.id}`, novaQuantidade)
                                setProdutosAgendamento(novoMap)
                              }}
                              disabled={produto.quantidade === 0}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Resumo */}
              {calcularTotalAgendamento(agendamentoSelecionado.id) > 0 && (
                <div className="modal-resumo">
                  <div className="modal-resumo-total">
                    <span className="modal-resumo-label">Total Adicional:</span>
                    <span className="modal-resumo-valor">
                      R$ {calcularTotalAgendamento(agendamentoSelecionado.id).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </Modal>
      </div>
    </LayoutAdmin>
  )
}

export default AgendamentosBarbearia

