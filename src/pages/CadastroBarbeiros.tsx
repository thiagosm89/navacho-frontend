import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import LayoutAdmin from '../components/LayoutAdmin/LayoutAdmin'
import LoadingBarber from '../components/LoadingBarber/LoadingBarber'
import Modal from '../components/Modal/Modal'
import { barbeariaService, Barbeiro, CriarBarbeiroRequest } from '../services/barbeariaService'
import './CadastroBarbeiros.css'

const CadastroBarbeiros = () => {
  const navigate = useNavigate()
  const [barbeiros, setBarbeiros] = useState<Barbeiro[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [formData, setFormData] = useState<CriarBarbeiroRequest>({
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    especialidades: [],
  })
  const [especialidadeInput, setEspecialidadeInput] = useState('')

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

    carregarBarbeiros()
  }, [navigate])

  const carregarBarbeiros = async () => {
    setCarregando(true)
    setErro('')
    try {
      const dados = await barbeariaService.listarBarbeiros()
      setBarbeiros(dados)
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao carregar barbeiros')
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

    if (!formData.nome || !formData.email) {
      setErro('Nome e email são obrigatórios')
      return
    }

    try {
      if (editandoId) {
        await barbeariaService.atualizarBarbeiro(editandoId, formData)
      } else {
        await barbeariaService.criarBarbeiro(formData)
      }
      setMostrarFormulario(false)
      setEditandoId(null)
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        cpf: '',
        especialidades: [],
      })
      carregarBarbeiros()
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao salvar barbeiro')
    }
  }

  const handleEditar = (barbeiro: Barbeiro) => {
    setFormData({
      nome: barbeiro.nome,
      email: barbeiro.email,
      telefone: barbeiro.telefone || '',
      cpf: barbeiro.cpf || '',
      especialidades: barbeiro.especialidades || [],
    })
    setEditandoId(barbeiro.id)
    setMostrarFormulario(true)
  }

  const handleExcluir = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este barbeiro?')) {
      return
    }

    try {
      await barbeariaService.excluirBarbeiro(id)
      carregarBarbeiros()
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao excluir barbeiro')
    }
  }

  const adicionarEspecialidade = () => {
    if (especialidadeInput.trim()) {
      setFormData({
        ...formData,
        especialidades: [...(formData.especialidades || []), especialidadeInput.trim()],
      })
      setEspecialidadeInput('')
    }
  }

  const removerEspecialidade = (index: number) => {
    const novasEspecialidades = [...(formData.especialidades || [])]
    novasEspecialidades.splice(index, 1)
    setFormData({
      ...formData,
      especialidades: novasEspecialidades,
    })
  }

  const formatarTelefone = (valor: string) => {
    const apenasDigitos = valor.replace(/\D/g, '')
    if (apenasDigitos.length <= 2) {
      return apenasDigitos
    } else if (apenasDigitos.length <= 7) {
      return `(${apenasDigitos.slice(0, 2)}) ${apenasDigitos.slice(2)}`
    } else {
      return `(${apenasDigitos.slice(0, 2)}) ${apenasDigitos.slice(2, 7)}-${apenasDigitos.slice(7, 11)}`
    }
  }

  const formatarCPF = (valor: string) => {
    const apenasDigitos = valor.replace(/\D/g, '')
    if (apenasDigitos.length <= 3) {
      return apenasDigitos
    } else if (apenasDigitos.length <= 6) {
      return `${apenasDigitos.slice(0, 3)}.${apenasDigitos.slice(3)}`
    } else if (apenasDigitos.length <= 9) {
      return `${apenasDigitos.slice(0, 3)}.${apenasDigitos.slice(3, 6)}.${apenasDigitos.slice(6)}`
    } else {
      return `${apenasDigitos.slice(0, 3)}.${apenasDigitos.slice(3, 6)}.${apenasDigitos.slice(6, 9)}-${apenasDigitos.slice(9, 11)}`
    }
  }

  if (carregando) {
    return (
      <LayoutAdmin>
        <div className="cadastro-barbeiros-loading">
          <LoadingBarber size="large" text="Carregando barbeiros..." />
        </div>
      </LayoutAdmin>
    )
  }

  return (
    <LayoutAdmin>
      <div className="cadastro-barbeiros-container">
        <div className="cadastro-barbeiros-header">
          <h1 className="cadastro-barbeiros-title">Gerenciar Barbeiros</h1>
          <button
            className="btn-novo-barbeiro"
            onClick={() => {
              setMostrarFormulario(true)
              setEditandoId(null)
              setFormData({
                nome: '',
                email: '',
                telefone: '',
                cpf: '',
                especialidades: [],
              })
            }}
          >
            + Novo Barbeiro
          </button>
        </div>

        {erro && (
          <div className="cadastro-barbeiros-erro">
            <p>{erro}</p>
          </div>
        )}

        <Modal
          isOpen={mostrarFormulario}
          onClose={() => {
            setMostrarFormulario(false)
            setEditandoId(null)
            setFormData({
              nome: '',
              email: '',
              telefone: '',
              cpf: '',
              especialidades: [],
            })
            setEspecialidadeInput('')
            setErro('')
          }}
          title={editandoId ? 'Editar Barbeiro' : 'Novo Barbeiro'}
          size="medium"
        >
          {erro && (
            <div className="cadastro-barbeiros-erro" style={{ marginBottom: '1.5rem' }}>
              <p>{erro}</p>
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nome">Nome Completo *</label>
              <input
                type="text"
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">E-mail *</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="telefone">Telefone</label>
                <input
                  type="tel"
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: formatarTelefone(e.target.value) })}
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div className="form-group">
                <label htmlFor="cpf">CPF</label>
                <input
                  type="text"
                  id="cpf"
                  value={formData.cpf}
                  onChange={(e) => setFormData({ ...formData, cpf: formatarCPF(e.target.value) })}
                  placeholder="000.000.000-00"
                  maxLength={14}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="especialidades">Especialidades</label>
              <div className="especialidades-input">
                <input
                  type="text"
                  id="especialidades"
                  value={especialidadeInput}
                  onChange={(e) => setEspecialidadeInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), adicionarEspecialidade())}
                  placeholder="Digite uma especialidade e pressione Enter"
                />
                <button type="button" onClick={adicionarEspecialidade}>
                  Adicionar
                </button>
              </div>
              <div className="especialidades-list">
                {formData.especialidades?.map((esp, index) => (
                  <span key={index} className="especialidade-tag">
                    {esp}
                    <button
                      type="button"
                      onClick={() => removerEspecialidade(index)}
                      className="remover-especialidade"
                    >
                      ×
                    </button>
                  </span>
                ))}
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
                    email: '',
                    telefone: '',
                    cpf: '',
                    especialidades: [],
                  })
                  setEspecialidadeInput('')
                }}
              >
                Cancelar
              </button>
            </div>
          </form>
        </Modal>

        <div className="barbeiros-list">
          {barbeiros.length === 0 ? (
            <div className="empty-state">
              <p>Nenhum barbeiro cadastrado</p>
            </div>
          ) : (
            <div className="barbeiros-grid">
              {barbeiros.map((barbeiro) => (
                <div key={barbeiro.id} className="barbeiro-card">
                  <div className="barbeiro-header">
                    <h3 className="barbeiro-nome">{barbeiro.nome}</h3>
                    <span className={`badge-status ${barbeiro.ativo ? 'ativo' : 'inativo'}`}>
                      {barbeiro.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                  <div className="barbeiro-info">
                    <p className="barbeiro-email">📧 {barbeiro.email}</p>
                    {barbeiro.telefone && (
                      <p className="barbeiro-telefone">📞 {barbeiro.telefone}</p>
                    )}
                    {barbeiro.especialidades && barbeiro.especialidades.length > 0 && (
                      <div className="barbeiro-especialidades">
                        {barbeiro.especialidades.map((esp, index) => (
                          <span key={index} className="especialidade-tag">
                            {esp}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="barbeiro-actions">
                    <button
                      className="btn-editar"
                      onClick={() => handleEditar(barbeiro)}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      className="btn-excluir"
                      onClick={() => handleExcluir(barbeiro.id)}
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

export default CadastroBarbeiros

