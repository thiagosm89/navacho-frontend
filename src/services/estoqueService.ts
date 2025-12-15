import { API_BASE_URL } from '../config/api'

export interface ItemEstoque {
  id: string
  nome: string
  descricao?: string
  categoria: string
  quantidade: number
  quantidade_minima: number
  unidade_medida: string // 'unidade', 'litro', 'kg', etc
  preco_unitario?: number
  fornecedor?: string
  data_validade?: string
  vendavel: boolean
  criado_em: string
  atualizado_em: string
}

export interface CriarItemEstoqueRequest {
  nome: string
  descricao?: string
  categoria: string
  quantidade: number
  quantidade_minima: number
  unidade_medida: string
  preco_unitario?: number
  fornecedor?: string
  data_validade?: string
  vendavel?: boolean
}

export interface NotificacaoEstoque {
  item: ItemEstoque
  nivel_critico: 'baixo' | 'muito_baixo' | 'zerado'
  percentual_restante: number
}

export const estoqueService = {
  async listarItens(): Promise<ItemEstoque[]> {
    const token = localStorage.getItem('access_token')
    
    if (!token) {
      throw new Error('Token de autenticação não encontrado')
    }

    const response = await fetch(`${API_BASE_URL}/barbearia/estoque`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Não autorizado. Faça login novamente.')
      }
      throw new Error('Erro ao listar itens do estoque')
    }

    return await response.json()
  },

  async criarItem(dados: CriarItemEstoqueRequest): Promise<ItemEstoque> {
    const token = localStorage.getItem('access_token')
    
    if (!token) {
      throw new Error('Token de autenticação não encontrado')
    }

    const response = await fetch(`${API_BASE_URL}/barbearia/estoque`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(dados),
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Não autorizado. Faça login novamente.')
      }
      const error = await response.json()
      throw new Error(error.mensagem || 'Erro ao criar item no estoque')
    }

    return await response.json()
  },

  async atualizarItem(id: string, dados: Partial<CriarItemEstoqueRequest>): Promise<ItemEstoque> {
    const token = localStorage.getItem('access_token')
    
    if (!token) {
      throw new Error('Token de autenticação não encontrado')
    }

    const response = await fetch(`${API_BASE_URL}/barbearia/estoque/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(dados),
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Não autorizado. Faça login novamente.')
      }
      const error = await response.json()
      throw new Error(error.mensagem || 'Erro ao atualizar item do estoque')
    }

    return await response.json()
  },

  async excluirItem(id: string): Promise<void> {
    const token = localStorage.getItem('access_token')
    
    if (!token) {
      throw new Error('Token de autenticação não encontrado')
    }

    const response = await fetch(`${API_BASE_URL}/barbearia/estoque/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Não autorizado. Faça login novamente.')
      }
      const error = await response.json()
      throw new Error(error.mensagem || 'Erro ao excluir item do estoque')
    }
  },

  async adicionarQuantidade(id: string, quantidade: number): Promise<ItemEstoque> {
    const token = localStorage.getItem('access_token')
    
    if (!token) {
      throw new Error('Token de autenticação não encontrado')
    }

    const response = await fetch(`${API_BASE_URL}/barbearia/estoque/${id}/adicionar`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ quantidade }),
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Não autorizado. Faça login novamente.')
      }
      const error = await response.json()
      throw new Error(error.mensagem || 'Erro ao adicionar quantidade')
    }

    return await response.json()
  },

  async removerQuantidade(id: string, quantidade: number): Promise<ItemEstoque> {
    const token = localStorage.getItem('access_token')
    
    if (!token) {
      throw new Error('Token de autenticação não encontrado')
    }

    const response = await fetch(`${API_BASE_URL}/barbearia/estoque/${id}/remover`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ quantidade }),
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Não autorizado. Faça login novamente.')
      }
      const error = await response.json()
      throw new Error(error.mensagem || 'Erro ao remover quantidade')
    }

    return await response.json()
  },

  async obterNotificacoes(): Promise<NotificacaoEstoque[]> {
    const token = localStorage.getItem('access_token')
    
    if (!token) {
      throw new Error('Token de autenticação não encontrado')
    }

    const response = await fetch(`${API_BASE_URL}/barbearia/estoque/notificacoes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Não autorizado. Faça login novamente.')
      }
      throw new Error('Erro ao obter notificações de estoque')
    }

    return await response.json()
  },

  async listarProdutosVendaveis(): Promise<ItemEstoque[]> {
    const token = localStorage.getItem('access_token')
    
    if (!token) {
      throw new Error('Token de autenticação não encontrado')
    }

    const response = await fetch(`${API_BASE_URL}/barbearia/estoque/vendaveis`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Não autorizado. Faça login novamente.')
      }
      throw new Error('Erro ao listar produtos vendáveis')
    }

    return await response.json()
  },
}

