import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import LayoutAdmin from '../components/LayoutAdmin/LayoutAdmin'
import LoadingBarber from '../components/LoadingBarber/LoadingBarber'
import Modal from '../components/Modal/Modal'
import { estoqueService, ItemEstoque, CriarItemEstoqueRequest } from '../services/estoqueService'
import './EstoqueBarbearia.css'

const EstoqueBarbearia = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [itens, setItens] = useState<ItemEstoque[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const fechandoModalRef = useRef(false)
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [filtroCategoria, setFiltroCategoria] = useState<string>('')
  const [categoriasExpandidas, setCategoriasExpandidas] = useState<Set<string>>(new Set())
  const [categoriaInput, setCategoriaInput] = useState('')
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false)
  const [formData, setFormData] = useState<CriarItemEstoqueRequest>({
    nome: '',
    descricao: '',
    categoria: '',
    quantidade: 0,
    quantidade_minima: 0,
    unidade_medida: 'unidade',
    preco_unitario: 0,
    fornecedor: '',
    data_validade: '',
    vendavel: false,
  })

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

    carregarItens()
  }, [navigate])

  useEffect(() => {
    // Verificar se há um item específico para editar (vindo do dashboard)
    const itemId = searchParams.get('item')
    // Não abrir o modal se estamos fechando intencionalmente
    if (fechandoModalRef.current) {
      fechandoModalRef.current = false
      return
    }
    // Só abrir o modal se:
    // 1. Há um itemId na URL
    // 2. Os itens já foram carregados
    // 3. Não estamos editando outro item
    // 4. O modal não está aberto (para evitar reabertura ao fechar)
    if (itemId && itens.length > 0 && !editandoId && !mostrarFormulario) {
      const item = itens.find((i) => i.id === itemId)
      if (item) {
        setFormData({
          nome: item.nome,
          descricao: item.descricao || '',
          categoria: item.categoria,
          quantidade: item.quantidade,
          quantidade_minima: item.quantidade_minima,
          unidade_medida: item.unidade_medida,
          preco_unitario: item.preco_unitario || 0,
          fornecedor: item.fornecedor || '',
          data_validade: item.data_validade || '',
          vendavel: item.vendavel || false,
        })
        setCategoriaInput(item.categoria)
        setEditandoId(item.id)
        setMostrarFormulario(true)
      }
    }
  }, [itens, searchParams, editandoId, mostrarFormulario])

  const carregarItens = async () => {
    setCarregando(true)
    setErro('')
    try {
      const dados = await estoqueService.listarItens()
      setItens(dados)
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao carregar estoque')
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

    if (!formData.nome || !formData.categoria) {
      setErro('Nome e categoria são obrigatórios')
      return
    }

    try {
      if (editandoId) {
        await estoqueService.atualizarItem(editandoId, formData)
      } else {
        await estoqueService.criarItem(formData)
      }
      // Marcar que estamos fechando intencionalmente
      fechandoModalRef.current = true
      // Remover parâmetro 'item' da URL PRIMEIRO para evitar reabertura do modal
      if (searchParams.get('item')) {
        const newSearchParams = new URLSearchParams(searchParams)
        newSearchParams.delete('item')
        setSearchParams(newSearchParams, { replace: true })
      }
      setMostrarFormulario(false)
      setEditandoId(null)
      setCategoriaInput('')
      setFormData({
        nome: '',
        descricao: '',
        categoria: '',
        quantidade: 0,
        quantidade_minima: 0,
        unidade_medida: 'unidade',
        preco_unitario: 0,
        fornecedor: '',
        data_validade: '',
        vendavel: false,
      })
      carregarItens()
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao salvar item')
    }
  }

  const handleEditar = (item: ItemEstoque) => {
    setFormData({
      nome: item.nome,
      descricao: item.descricao || '',
      categoria: item.categoria,
      quantidade: item.quantidade,
      quantidade_minima: item.quantidade_minima,
      unidade_medida: item.unidade_medida,
      preco_unitario: item.preco_unitario || 0,
      fornecedor: item.fornecedor || '',
      data_validade: item.data_validade || '',
      vendavel: item.vendavel || false,
    })
    setCategoriaInput(item.categoria)
    setEditandoId(item.id)
    setMostrarFormulario(true)
  }

  const handleExcluir = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este item?')) {
      return
    }

    try {
      await estoqueService.excluirItem(id)
      carregarItens()
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao excluir item')
    }
  }

  const handleAdicionarQuantidade = async (id: string, quantidade: number) => {
    try {
      await estoqueService.adicionarQuantidade(id, quantidade)
      carregarItens()
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao adicionar quantidade')
    }
  }

  const handleRemoverQuantidade = async (id: string, quantidade: number) => {
    try {
      await estoqueService.removerQuantidade(id, quantidade)
      carregarItens()
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao remover quantidade')
    }
  }

  const getNivelCritico = (item: ItemEstoque): 'ok' | 'baixo' | 'muito_baixo' | 'zerado' => {
    if (item.quantidade === 0) return 'zerado'
    const percentual = (item.quantidade / item.quantidade_minima) * 100
    if (percentual <= 50) return 'muito_baixo'
    if (percentual <= 100) return 'baixo'
    return 'ok'
  }

  const itensFiltrados = filtroCategoria
    ? itens.filter((item) => item.categoria === filtroCategoria)
    : itens

  const categorias = Array.from(new Set(itensFiltrados.map((item) => item.categoria)))
  const todasCategorias = Array.from(new Set(itens.map((item) => item.categoria)))

  // Filtrar categorias baseado no input
  const categoriasFiltradas = categoriaInput
    ? todasCategorias.filter((cat) =>
        cat.toLowerCase().includes(categoriaInput.toLowerCase())
      )
    : todasCategorias

  const categoriaExiste = todasCategorias.some(
    (cat) => cat.toLowerCase() === categoriaInput.toLowerCase()
  )

  // Expandir todas as categorias por padrão quando os itens são carregados
  useEffect(() => {
    if (categorias.length > 0 && categoriasExpandidas.size === 0) {
      setCategoriasExpandidas(new Set(categorias))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itens.length])

  const toggleCategoria = (categoria: string) => {
    setCategoriasExpandidas((prev) => {
      const novo = new Set(prev)
      if (novo.has(categoria)) {
        novo.delete(categoria)
      } else {
        novo.add(categoria)
      }
      return novo
    })
  }

  const expandirTodas = () => {
    setCategoriasExpandidas(new Set(categorias))
  }

  const colapsarTodas = () => {
    setCategoriasExpandidas(new Set())
  }

  if (carregando) {
    return (
      <LayoutAdmin>
        <div className="estoque-loading">
          <LoadingBarber size="large" text="Carregando estoque..." />
        </div>
      </LayoutAdmin>
    )
  }

  return (
    <LayoutAdmin>
      <div className="estoque-container">
        <div className="estoque-header">
          <h1 className="estoque-title">Gerenciar Estoque</h1>
          <button
            className="btn-novo-item"
            onClick={() => {
              setMostrarFormulario(true)
              setEditandoId(null)
              setCategoriaInput('')
              setFormData({
                nome: '',
                descricao: '',
                categoria: '',
                quantidade: 0,
                quantidade_minima: 0,
                unidade_medida: 'unidade',
                preco_unitario: 0,
                fornecedor: '',
                data_validade: '',
                vendavel: false,
              })
            }}
          >
            + Novo Item
          </button>
        </div>

        {erro && (
          <div className="estoque-erro">
            <p>{erro}</p>
          </div>
        )}

        {/* Filtro */}
        <div className="filtro-visualizacao-container">
          <div className="filtro-container">
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

          <div className="arvore-actions">
            <button
              className="btn-expandir-todas"
              onClick={expandirTodas}
              title="Expandir todas as categorias"
            >
              ⬇️ Expandir Todas
            </button>
            <button
              className="btn-colapsar-todas"
              onClick={colapsarTodas}
              title="Colapsar todas as categorias"
            >
              ⬆️ Colapsar Todas
            </button>
          </div>
        </div>

        <Modal
          isOpen={mostrarFormulario}
          onClose={() => {
            // Marcar que estamos fechando intencionalmente
            fechandoModalRef.current = true
            // Remover parâmetro 'item' da URL PRIMEIRO para evitar reabertura do modal
            if (searchParams.get('item')) {
              const newSearchParams = new URLSearchParams(searchParams)
              newSearchParams.delete('item')
              setSearchParams(newSearchParams, { replace: true })
            }
            // Depois fechar o modal e limpar estados
            setMostrarFormulario(false)
            setEditandoId(null)
            setCategoriaInput('')
            setErro('')
            setFormData({
              nome: '',
              descricao: '',
              categoria: '',
              quantidade: 0,
              quantidade_minima: 0,
              unidade_medida: 'unidade',
              preco_unitario: 0,
              fornecedor: '',
              data_validade: '',
              vendavel: false,
            })
          }}
          title={editandoId ? 'Editar Item' : 'Novo Item'}
          size="large"
        >
          {erro && (
            <div className="estoque-erro" style={{ marginBottom: '1.5rem' }}>
              <p>{erro}</p>
            </div>
          )}
          <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nome">Nome *</label>
                  <input
                    type="text"
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group categoria-autocomplete-wrapper">
                  <label htmlFor="categoria">Categoria *</label>
                  <div className="categoria-autocomplete">
                    <input
                      type="text"
                      id="categoria"
                      value={categoriaInput}
                      onChange={(e) => {
                        const valor = e.target.value
                        setCategoriaInput(valor)
                        setFormData({ ...formData, categoria: valor })
                        setMostrarSugestoes(true)
                      }}
                      onFocus={() => {
                        if (categoriasFiltradas.length > 0) {
                          setMostrarSugestoes(true)
                        }
                      }}
                      onBlur={() => {
                        // Delay para permitir clique nas sugestões
                        setTimeout(() => setMostrarSugestoes(false), 200)
                      }}
                      required
                      placeholder="Digite ou selecione uma categoria"
                      autoComplete="off"
                    />
                    {mostrarSugestoes && categoriasFiltradas.length > 0 && (
                      <div className="categoria-sugestoes">
                        {categoriasFiltradas.map((categoria) => (
                          <div
                            key={categoria}
                            className="categoria-sugestao-item"
                            onMouseDown={(e) => {
                              e.preventDefault()
                              setCategoriaInput(categoria)
                              setFormData({ ...formData, categoria })
                              setMostrarSugestoes(false)
                            }}
                          >
                            {categoria}
                          </div>
                        ))}
                      </div>
                    )}
                    {categoriaInput && !categoriaExiste && (
                      <div className="categoria-nova-hint">
                        ✓ Criar nova categoria: "{categoriaInput}"
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="descricao">Descrição</label>
                <textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="quantidade">Quantidade Atual</label>
                  <input
                    type="number"
                    id="quantidade"
                    value={formData.quantidade}
                    onChange={(e) => setFormData({ ...formData, quantidade: Number(e.target.value) })}
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="quantidade_minima">Quantidade Mínima *</label>
                  <input
                    type="number"
                    id="quantidade_minima"
                    value={formData.quantidade_minima}
                    onChange={(e) => setFormData({ ...formData, quantidade_minima: Number(e.target.value) })}
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="unidade_medida">Unidade de Medida</label>
                  <select
                    id="unidade_medida"
                    value={formData.unidade_medida}
                    onChange={(e) => setFormData({ ...formData, unidade_medida: e.target.value })}
                  >
                    <option value="unidade">Unidade</option>
                    <option value="litro">Litro</option>
                    <option value="kg">Quilograma</option>
                    <option value="metro">Metro</option>
                    <option value="caixa">Caixa</option>
                    <option value="pacote">Pacote</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="preco_unitario">Preço Unitário (R$)</label>
                  <input
                    type="number"
                    id="preco_unitario"
                    value={formData.preco_unitario}
                    onChange={(e) => setFormData({ ...formData, preco_unitario: Number(e.target.value) })}
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="fornecedor">Fornecedor</label>
                  <input
                    type="text"
                    id="fornecedor"
                    value={formData.fornecedor}
                    onChange={(e) => setFormData({ ...formData, fornecedor: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="data_validade">Data de Validade</label>
                  <input
                    type="date"
                    id="data_validade"
                    value={formData.data_validade}
                    onChange={(e) => setFormData({ ...formData, data_validade: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.vendavel || false}
                    onChange={(e) => setFormData({ ...formData, vendavel: e.target.checked })}
                  />
                  <span>Produto pode ser vendido aos clientes</span>
                </label>
                <p className="form-hint">
                  Itens marcados como vendáveis aparecerão na tela de atendimento para venda aos clientes
                </p>
              </div>

            <div className="form-actions">
              <button type="submit" className="btn-salvar">
                {editandoId ? 'Atualizar' : 'Cadastrar'}
              </button>
              <button
                type="button"
                className="btn-cancelar"
                onClick={() => {
                  // Marcar que estamos fechando intencionalmente
                  fechandoModalRef.current = true
                  // Remover parâmetro 'item' da URL PRIMEIRO para evitar reabertura do modal
                  if (searchParams.get('item')) {
                    const newSearchParams = new URLSearchParams(searchParams)
                    newSearchParams.delete('item')
                    setSearchParams(newSearchParams, { replace: true })
                  }
                  setMostrarFormulario(false)
                  setEditandoId(null)
                  setCategoriaInput('')
                  setFormData({
                    nome: '',
                    descricao: '',
                    categoria: '',
                    quantidade: 0,
                    quantidade_minima: 0,
                    unidade_medida: 'unidade',
                    preco_unitario: 0,
                    fornecedor: '',
                    data_validade: '',
                    vendavel: false,
                  })
                }}
              >
                Cancelar
              </button>
            </div>
          </form>
        </Modal>

        <div className="itens-list">
          {itensFiltrados.length === 0 ? (
            <div className="empty-state">
              <p>Nenhum item encontrado no estoque</p>
            </div>
          ) : (
            // Visualização em Árvore por Categoria
            <div className="arvore-container">
              {categorias.map((categoria) => {
                const itensCategoria = itensFiltrados.filter(item => item.categoria === categoria)
                if (itensCategoria.length === 0) return null
                const expandida = categoriasExpandidas.has(categoria)

                return (
                  <div key={categoria} className="categoria-node">
                    <div 
                      className="categoria-header"
                      onClick={() => toggleCategoria(categoria)}
                      style={{ cursor: 'pointer' }}
                    >
                      <span className={`categoria-toggle ${expandida ? 'expandida' : ''}`}>
                        {expandida ? '▼' : '▶'}
                      </span>
                      <span className="categoria-icon">📁</span>
                      <h3 className="categoria-nome">{categoria}</h3>
                      <span className="categoria-count">({itensCategoria.length} {itensCategoria.length === 1 ? 'item' : 'itens'})</span>
                    </div>
                    {expandida && (
                      <div className="categoria-itens">
                        {itensCategoria.map((item) => {
                          const nivel = getNivelCritico(item)
                          return (
                            <div key={item.id} className={`arvore-item ${nivel !== 'ok' ? `critico-${nivel}` : ''}`}>
                              <div className="arvore-item-content">
                                <div className="arvore-item-main">
                                  <div className="arvore-item-linha">
                                    <span className="arvore-item-nome">{item.nome}</span>
                                    {nivel !== 'ok' && (
                                      <span className={`badge-nivel critico-${nivel}`}>
                                        {nivel === 'zerado' ? 'Zerado' : nivel === 'muito_baixo' ? 'Muito Baixo' : 'Baixo'}
                                      </span>
                                    )}
                                  </div>
                                  {item.descricao && (
                                    <p className="arvore-item-descricao">{item.descricao}</p>
                                  )}
                                  <div className="arvore-item-detalhes">
                                    <span className="arvore-detalhe">
                                      <strong>Quantidade:</strong> 
                                      <span className={nivel !== 'ok' ? `critico-${nivel}` : ''}>
                                        {item.quantidade} {item.unidade_medida}
                                      </span>
                                    </span>
                                    <span className="arvore-detalhe">
                                      <strong>Mínimo:</strong> {item.quantidade_minima} {item.unidade_medida}
                                    </span>
                                    {item.preco_unitario && (
                                      <span className="arvore-detalhe">
                                        <strong>Preço:</strong> R$ {item.preco_unitario.toFixed(2)}
                                      </span>
                                    )}
                                    {item.fornecedor && (
                                      <span className="arvore-detalhe">
                                        <strong>Fornecedor:</strong> {item.fornecedor}
                                      </span>
                                    )}
                                    {item.data_validade && (
                                      <span className="arvore-detalhe">
                                        <strong>Validade:</strong> {new Date(item.data_validade).toLocaleDateString('pt-BR')}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="arvore-item-actions">
                                  <div className="quantidade-actions">
                                    <button
                                      className="btn-quantidade"
                                      onClick={() => handleAdicionarQuantidade(item.id, 1)}
                                      title="Adicionar 1"
                                    >
                                      +
                                    </button>
                                    <button
                                      className="btn-quantidade"
                                      onClick={() => handleRemoverQuantidade(item.id, 1)}
                                      title="Remover 1"
                                    >
                                      −
                                    </button>
                                  </div>
                                  <button
                                    className="btn-editar"
                                    onClick={() => handleEditar(item)}
                                  >
                                    ✏️
                                  </button>
                                  <button
                                    className="btn-excluir"
                                    onClick={() => handleExcluir(item.id)}
                                  >
                                    🗑️
                                  </button>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </LayoutAdmin>
  )
}

export default EstoqueBarbearia

