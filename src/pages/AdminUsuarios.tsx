import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import LayoutAdmin from '../components/LayoutAdmin/LayoutAdmin'
import LoadingBarber from '../components/LoadingBarber/LoadingBarber'
import { usuarioService, Usuario, ListaUsuariosResponse } from '../services/usuarioService'
import { PapelUsuario } from '../types/roles'
import './AdminUsuarios.css'

const AdminUsuarios = () => {
  const navigate = useNavigate()
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [busca, setBusca] = useState('')
  const [filtroPapel, setFiltroPapel] = useState<PapelUsuario | ''>('')
  const [filtroAtivo, setFiltroAtivo] = useState<string>('')
  const [pagina, setPagina] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [total, setTotal] = useState(0)
  const [usuarioLogadoId, setUsuarioLogadoId] = useState<string | null>(null)
  const itensPorPagina = 10

  useEffect(() => {
    // Verificar se o usuário está autenticado como admin
    const usuarioStr = localStorage.getItem('usuario')
    if (!usuarioStr) {
      navigate('/login')
      return
    }

    try {
      const usuario = JSON.parse(usuarioStr)
      if (usuario.papel !== 'ADMIN') {
        navigate('/login')
        return
      }
      setUsuarioLogadoId(usuario.id)
    } catch {
      navigate('/login')
      return
    }

    carregarUsuarios()
  }, [navigate, pagina, filtroPapel, filtroAtivo])

  const carregarUsuarios = async () => {
    setCarregando(true)
    setErro('')

    try {
      const params: any = {
        pagina,
        limite: itensPorPagina,
      }

      if (busca) {
        params.busca = busca
      }
      if (filtroPapel) {
        params.papel = filtroPapel
      }
      if (filtroAtivo !== '') {
        params.ativo = filtroAtivo === 'true'
      }

      const dados: ListaUsuariosResponse = await usuarioService.listarUsuarios(params)
      setUsuarios(dados.usuarios)
      setTotalPaginas(dados.totalPaginas)
      setTotal(dados.total)
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao carregar usuários')
      if (error instanceof Error && error.message.includes('Não autorizado')) {
        navigate('/login')
      }
    } finally {
      setCarregando(false)
    }
  }

  const handleBuscar = () => {
    setPagina(1)
    carregarUsuarios()
  }

  const handleLimparFiltros = async () => {
    // Limpar todos os filtros
    setBusca('')
    setFiltroPapel('')
    setFiltroAtivo('')
    setPagina(1)
    
    // Aguardar um tick para garantir que os estados foram atualizados
    await new Promise(resolve => setTimeout(resolve, 0))
    
    // Recarregar com parâmetros limpos (sem filtros)
    setCarregando(true)
    setErro('')
    
    try {
      const dados: ListaUsuariosResponse = await usuarioService.listarUsuarios({
        pagina: 1,
        limite: itensPorPagina,
      })
      setUsuarios(dados.usuarios)
      setTotalPaginas(dados.totalPaginas)
      setTotal(dados.total)
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao carregar usuários')
      if (error instanceof Error && error.message.includes('Não autorizado')) {
        navigate('/login')
      }
    } finally {
      setCarregando(false)
    }
  }

  // Verificar se há filtros ativos
  const temFiltrosAtivos = busca !== '' || filtroPapel !== '' || filtroAtivo !== ''

  const handleToggleStatus = async (usuarioId: string, ativoAtual: boolean, papelUsuario: PapelUsuario) => {
    // Verificar se está tentando desativar a si mesmo
    if (usuarioId === usuarioLogadoId && ativoAtual) {
      alert('Você não pode desativar a si mesmo')
      return
    }

    // Se for administrador e estiver tentando desativar
    if (papelUsuario === 'ADMIN' && ativoAtual) {
      try {
        // Verificar se há outros administradores ativos
        const totalAdminsAtivos = await usuarioService.contarAdministradoresAtivos(usuarioId)
        
        if (totalAdminsAtivos === 0) {
          alert('Não é possível desativar este administrador. Deve haver pelo menos um administrador ativo no sistema.')
          return
        }
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Erro ao verificar administradores')
        return
      }
    }

    try {
      await usuarioService.atualizarStatusUsuario(usuarioId, !ativoAtual)
      // Recarregar lista
      carregarUsuarios()
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erro ao atualizar status')
    }
  }

  const handleMudarPapel = async (usuarioId: string, novoPapel: PapelUsuario) => {
    // Verificar se está tentando alterar o próprio papel
    if (usuarioId === usuarioLogadoId) {
      alert('Você não pode alterar seu próprio papel')
      return
    }

    if (!confirm(`Tem certeza que deseja alterar o papel deste usuário?`)) {
      return
    }

    try {
      await usuarioService.atualizarPapelUsuario(usuarioId, novoPapel)
      // Recarregar lista
      carregarUsuarios()
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erro ao atualizar papel')
    }
  }

  const getPapelLabel = (papel: PapelUsuario): string => {
    const labels: Record<PapelUsuario, string> = {
      ADMIN: 'Administrador',
      ADMIN_BARBEARIA: 'Admin Barbearia',
      BARBEIRO: 'Barbeiro',
      CLIENTE: 'Cliente',
      FORNECEDOR: 'Fornecedor',
    }
    return labels[papel] || papel
  }

  const getPapelBadgeClass = (papel: PapelUsuario): string => {
    const classes: Record<PapelUsuario, string> = {
      ADMIN: 'badge-admin',
      ADMIN_BARBEARIA: 'badge-admin-barbearia',
      BARBEIRO: 'badge-barbeiro',
      CLIENTE: 'badge-cliente',
      FORNECEDOR: 'badge-fornecedor',
    }
    return classes[papel] || 'badge-default'
  }

  if (carregando && usuarios.length === 0) {
    return (
      <LayoutAdmin>
        <div className="admin-usuarios-loading">
          <LoadingBarber size="large" text="Carregando usuários..." />
        </div>
      </LayoutAdmin>
    )
  }

  return (
    <LayoutAdmin>
      <div className="admin-usuarios-container">
        <div className="admin-usuarios-header">
          <h1 className="admin-usuarios-title">Gerenciar Usuários</h1>
          <p className="admin-usuarios-subtitle">Total de {total} usuários cadastrados</p>
        </div>

        {/* Filtros e Busca */}
        <div className="admin-usuarios-filtros">
          <div className="filtro-busca">
            <input
              type="text"
              placeholder="Buscar por nome ou email..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleBuscar()}
              className="input-busca"
            />
            <button onClick={handleBuscar} className="btn-buscar">
              🔍 Buscar
            </button>
            {temFiltrosAtivos && (
              <button onClick={handleLimparFiltros} className="btn-limpar-filtros">
                🗑️ Limpar Filtros
              </button>
            )}
          </div>

          <div className="filtros-row">
            <select
              value={filtroPapel}
              onChange={(e) => {
                setFiltroPapel(e.target.value as PapelUsuario | '')
                setPagina(1)
              }}
              className="select-filtro"
            >
              <option value="">Todos os papéis</option>
              <option value="ADMIN">Administrador</option>
              <option value="ADMIN_BARBEARIA">Admin Barbearia</option>
              <option value="BARBEIRO">Barbeiro</option>
              <option value="CLIENTE">Cliente</option>
              <option value="FORNECEDOR">Fornecedor</option>
            </select>

            <select
              value={filtroAtivo}
              onChange={(e) => {
                setFiltroAtivo(e.target.value)
                setPagina(1)
              }}
              className="select-filtro"
            >
              <option value="">Todos os status</option>
              <option value="true">Ativos</option>
              <option value="false">Inativos</option>
            </select>
          </div>
        </div>

        {erro && (
          <div className="admin-usuarios-erro">
            <p>{erro}</p>
          </div>
        )}

        {/* Tabela de Usuários */}
        <div className="admin-usuarios-table-container">
          <table className="admin-usuarios-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Telefone</th>
                <th>Papel</th>
                <th>Status</th>
                <th>Cadastrado em</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.length === 0 ? (
                <tr>
                  <td colSpan={7} className="empty-state">
                    Nenhum usuário encontrado
                  </td>
                </tr>
              ) : (
                usuarios.map((usuario) => (
                  <tr key={usuario.id}>
                    <td>{usuario.nome}</td>
                    <td>{usuario.email}</td>
                    <td>{usuario.telefone || '-'}</td>
                    <td>
                      <span className={`badge ${getPapelBadgeClass(usuario.papel)}`}>
                        {getPapelLabel(usuario.papel)}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${usuario.ativo ? 'ativo' : 'inativo'}`}>
                        {usuario.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td>{new Date(usuario.criado_em).toLocaleDateString('pt-BR')}</td>
                    <td>
                      <div className="acoes-cell">
                        <button
                          onClick={() => handleToggleStatus(usuario.id, usuario.ativo, usuario.papel)}
                          className={`btn-acao ${usuario.ativo ? 'btn-desativar' : 'btn-ativar'}`}
                          title={usuario.ativo ? 'Desativar' : 'Ativar'}
                          disabled={usuario.id === usuarioLogadoId && usuario.ativo}
                        >
                          {usuario.ativo ? '🚫' : '✅'}
                        </button>
                        <select
                          value={usuario.papel}
                          onChange={(e) => handleMudarPapel(usuario.id, e.target.value as PapelUsuario)}
                          className="select-papel"
                          title={usuario.id === usuarioLogadoId ? 'Você não pode alterar seu próprio papel' : 'Alterar papel'}
                          disabled={usuario.id === usuarioLogadoId}
                        >
                          <option value="ADMIN">Administrador</option>
                          <option value="ADMIN_BARBEARIA">Admin Barbearia</option>
                          <option value="BARBEIRO">Barbeiro</option>
                          <option value="CLIENTE">Cliente</option>
                          <option value="FORNECEDOR">Fornecedor</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        {totalPaginas > 1 && (
          <div className="admin-usuarios-paginacao">
            <button
              onClick={() => setPagina(pagina - 1)}
              disabled={pagina === 1}
              className="btn-pagina"
            >
              ← Anterior
            </button>
            <div className="paginacao-numeros">
              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((numero) => (
                <button
                  key={numero}
                  className={`btn-pagina-numero ${pagina === numero ? 'ativo' : ''}`}
                  onClick={() => setPagina(numero)}
                >
                  {numero}
                </button>
              ))}
            </div>
            <button
              onClick={() => setPagina(pagina + 1)}
              disabled={pagina === totalPaginas}
              className="btn-pagina"
            >
              Próxima →
            </button>
            <span className="info-pagina">
              Página {pagina} de {totalPaginas} ({total} usuários)
            </span>
          </div>
        )}
      </div>
    </LayoutAdmin>
  )
}

export default AdminUsuarios

