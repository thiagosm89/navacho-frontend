import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import LayoutAdmin from '../components/LayoutAdmin/LayoutAdmin'
import LoadingBarber from '../components/LoadingBarber/LoadingBarber'
import Modal from '../components/Modal/Modal'
import { barbeariaService, Servico, CriarServicoRequest } from '../services/barbeariaService'
import './ServicosBarbearia.css'

const ServicosBarbearia = () => {
  const navigate = useNavigate()
  const [servicos, setServicos] = useState<Servico[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [filtroCategoria, setFiltroCategoria] = useState<string>('')
  const [filtroAtivo, setFiltroAtivo] = useState<string>('')
  const [formData, setFormData] = useState<CriarServicoRequest>({
    nome: '',
    descricao: '',
    duracao_minutos: 30,
    preco: 0,
    categoria: '',
  })

  useEffect(() => {
    const usuarioStr = localStorage.getItem('usuario')
    if (!usuarioStr) {
      navigate('/login')
      return
    }

    try {
      const usuario = JSON.parse(usuarioStr)
      // Verificar se o usuário tem o papel ADMIN_BARBEARIA
      const papeis: string[] = usuario?.papeis || (usuario?.papel ? [usuario.papel] : [])
      if (!papeis.includes('ADMIN_BARBEARIA')) {
        navigate('/login')
        return
      }
    } catch {
      navigate('/login')
      return
    }

    carregarServicos()
  }, [navigate])

  const carregarServicos = async () => {
    setCarregando(true)
    setErro('')
    try {
      const dados = await barbeariaService.listarServicos()
      setServicos(dados)
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao carregar serviços')
      if (error instanceof Error && error.message.includes('Não autorizado')) {
        navigate('/login')
      }
    } finally {
      setCarregando(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')

    if (!formData.nome || formData.duracao_minutos <= 0 || formData.preco < 0) {
      setErro('Preencha todos os campos obrigatórios corretamente')
      return
    }

    try {
      if (editandoId) {
        await barbeariaService.atualizarServico(editandoId, formData)
      } else {
        await barbeariaService.criarServico(formData)
      }
      setMostrarFormulario(false)
      setEditandoId(null)
      setFormData({
        nome: '',
        descricao: '',
        duracao_minutos: 30,
        preco: 0,
        categoria: '',
      })
      carregarServicos()
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao salvar serviço')
    }
  }

  const handleEditar = (servico: Servico) => {
    setFormData({
      nome: servico.nome,
      descricao: servico.descricao || '',
      duracao_minutos: servico.duracao_minutos,
      preco: servico.preco,
      categoria: servico.categoria || '',
    })
    setEditandoId(servico.id)
    setMostrarFormulario(true)
  }

  const handleExcluir = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este serviço?')) {
      return
    }

    try {
      await barbeariaService.excluirServico(id)
      carregarServicos()
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao excluir serviço')
    }
  }

  const handleToggleStatus = async (id: string, ativoAtual: boolean) => {
    try {
      await barbeariaService.atualizarStatusServico(id, !ativoAtual)
      carregarServicos()
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao atualizar status')
    }
  }

  const formatarDuracao = (minutos: number) => {
    if (minutos < 60) {
      return `${minutos} min`
    }
    const horas = Math.floor(minutos / 60)
    const mins = minutos % 60
    if (mins === 0) {
      return `${horas}h`
    }
    return `${horas}h ${mins}min`
  }

  const categorias = Array.from(new Set(servicos.map((s) => s.categoria).filter(Boolean)))

  const servicosFiltrados = servicos.filter((servico) => {
    if (filtroCategoria && servico.categoria !== filtroCategoria) return false
    if (filtroAtivo !== '' && servico.ativo !== (filtroAtivo === 'true')) return false
    return true
  })

  if (carregando) {
    return (
      <LayoutAdmin>
        <div className="servicos-loading">
          <LoadingBarber size="large" text="Carregando serviços..." />
        </div>
      </LayoutAdmin>
    )
  }

  return (
    <LayoutAdmin>
      <div className="servicos-container">
        <div className="servicos-header">
          <h1 className="servicos-title">Gerenciar Serviços</h1>
          <button
            className="btn-novo-servico"
            onClick={() => {
              setMostrarFormulario(true)
              setEditandoId(null)
              setFormData({
                nome: '',
                descricao: '',
                duracao_minutos: 30,
                preco: 0,
                categoria: '',
              })
            }}
          >
            + Novo Serviço
          </button>
        </div>

        {erro && (
          <div className="servicos-erro">
            <p>{erro}</p>
          </div>
        )}

        {/* Filtros */}
        <div className="filtros-container">
          <div className="filtro-group">
            <label>Categoria</label>
            <select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
            >
              <option value="">Todas</option>
              {categorias.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="filtro-group">
            <label>Status</label>
            <select
              value={filtroAtivo}
              onChange={(e) => setFiltroAtivo(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="true">Ativos</option>
              <option value="false">Inativos</option>
            </select>
          </div>
        </div>

        <Modal
          isOpen={mostrarFormulario}
          onClose={() => {
            setMostrarFormulario(false)
            setEditandoId(null)
            setErro('')
            setFormData({
              nome: '',
              descricao: '',
              categoria: '',
              duracao_minutos: 30,
              preco: 0,
            })
          }}
          title={editandoId ? 'Editar Serviço' : 'Novo Serviço'}
          size="medium"
        >
          {erro && (
            <div className="servicos-erro" style={{ marginBottom: '1.5rem' }}>
              <p>{erro}</p>
            </div>
          )}
          <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nome">Nome do Serviço *</label>
                  <input
                    type="text"
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    required
                    placeholder="Ex: Corte Masculino"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="categoria">Categoria</label>
                  <input
                    type="text"
                    id="categoria"
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                    placeholder="Ex: Corte, Barba, etc"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="descricao">Descrição</label>
                <textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  rows={3}
                  placeholder="Descreva o serviço oferecido..."
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="duracao_minutos">Duração (minutos) *</label>
                  <input
                    type="number"
                    id="duracao_minutos"
                    value={formData.duracao_minutos}
                    onChange={(e) => setFormData({ ...formData, duracao_minutos: Number(e.target.value) })}
                    min="1"
                    required
                  />
                  <span className="form-hint">
                    {formatarDuracao(formData.duracao_minutos)}
                  </span>
                </div>

                <div className="form-group">
                  <label htmlFor="preco">Preço (R$) *</label>
                  <input
                    type="number"
                    id="preco"
                    value={formData.preco}
                    onChange={(e) => setFormData({ ...formData, preco: Number(e.target.value) })}
                    min="0"
                    step="0.01"
                    required
                    placeholder="0.00"
                  />
                </div>
              </div>

            <div className="form-actions">
              <button type="submit" className="btn-salvar">
                {editandoId ? 'Atualizar' : 'Cadastrar'}
              </button>
              <button
                type="button"
                className="btn-cancelar"
                onClick={() => {
                  setMostrarFormulario(false)
                  setEditandoId(null)
                  setFormData({
                    nome: '',
                    descricao: '',
                    categoria: '',
                    duracao_minutos: 30,
                    preco: 0,
                  })
                }}
              >
                Cancelar
              </button>
            </div>
          </form>
        </Modal>

        <div className="servicos-list">
          {servicosFiltrados.length === 0 ? (
            <div className="empty-state">
              <p>Nenhum serviço cadastrado</p>
            </div>
          ) : (
            <div className="servicos-grid">
              {servicosFiltrados.map((servico) => (
                <div key={servico.id} className={`servico-card ${!servico.ativo ? 'inativo' : ''}`}>
                  <div className="servico-header">
                    <h3 className="servico-nome">{servico.nome}</h3>
                    <span className={`badge-status ${servico.ativo ? 'ativo' : 'inativo'}`}>
                      {servico.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                  
                  {servico.categoria && (
                    <p className="servico-categoria">📁 {servico.categoria}</p>
                  )}
                  
                  {servico.descricao && (
                    <p className="servico-descricao">{servico.descricao}</p>
                  )}
                  
                  <div className="servico-info">
                    <div className="info-item">
                      <span className="info-label">⏱️ Duração:</span>
                      <span className="info-value">{formatarDuracao(servico.duracao_minutos)}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">💰 Preço:</span>
                      <span className="info-value">R$ {servico.preco.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="servico-actions">
                    <button
                      className={`btn-toggle-status ${servico.ativo ? 'btn-desativar' : 'btn-ativar'}`}
                      onClick={() => handleToggleStatus(servico.id, servico.ativo)}
                      title={servico.ativo ? 'Desativar' : 'Ativar'}
                    >
                      {servico.ativo ? '🚫' : '✅'}
                    </button>
                    <button
                      className="btn-editar"
                      onClick={() => handleEditar(servico)}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      className="btn-excluir"
                      onClick={() => handleExcluir(servico.id)}
                    >
                      🗑️ Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </LayoutAdmin>
  )
}

export default ServicosBarbearia

