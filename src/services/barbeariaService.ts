const API_BASE_URL = 'http://localhost:3000'

export interface Barbeiro {
  id: string
  nome: string
  email: string
  telefone?: string
  cpf?: string
  especialidades?: string[]
  ativo: boolean
  criado_em: string
  atualizado_em: string
}

export interface Agendamento {
  id: string
  cliente_id: string
  cliente_nome: string
  cliente_telefone?: string
  barbeiro_id: string
  barbeiro_nome: string
  servico: string
  data_hora: string
  status: 'PENDENTE' | 'CONFIRMADO' | 'EM_ANDAMENTO' | 'CONCLUIDO' | 'CANCELADO'
  observacoes?: string
  criado_em: string
}

export interface CriarBarbeiroRequest {
  nome: string
  email: string
  telefone?: string
  cpf?: string
  especialidades?: string[]
}

export interface CriarAgendamentoRequest {
  cliente_id: string
  barbeiro_id: string
  servico: string
  data_hora: string
  observacoes?: string
}

export interface Servico {
  id: string
  nome: string
  descricao?: string
  duracao_minutos: number
  preco: number
  ativo: boolean
  categoria?: string
  criado_em: string
  atualizado_em: string
}

export interface CriarServicoRequest {
  nome: string
  descricao?: string
  duracao_minutos: number
  preco: number
  categoria?: string
}

export interface MetricasBarbearia {
  clientes_atendidos: {
    dia: number
    semana: number
    mes: number
    ano: number
  }
  atendimentos: {
    dia: number
    semana: number
    mes: number
    ano: number
  }
}

export const barbeariaService = {
  // Barbeiros
  async listarBarbeiros(): Promise<Barbeiro[]> {
    const token = localStorage.getItem('access_token')
    
    if (!token) {
      throw new Error('Token de autenticação não encontrado')
    }

    const response = await fetch(`${API_BASE_URL}/barbearia/barbeiros`, {
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
      throw new Error('Erro ao listar barbeiros')
    }

    return await response.json()
  },

  async criarBarbeiro(dados: CriarBarbeiroRequest): Promise<Barbeiro> {
    const token = localStorage.getItem('access_token')
    
    if (!token) {
      throw new Error('Token de autenticação não encontrado')
    }

    const response = await fetch(`${API_BASE_URL}/barbearia/barbeiros`, {
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
      throw new Error(error.mensagem || 'Erro ao criar barbeiro')
    }

    return await response.json()
  },

  async atualizarBarbeiro(id: string, dados: Partial<CriarBarbeiroRequest>): Promise<Barbeiro> {
    const token = localStorage.getItem('access_token')
    
    if (!token) {
      throw new Error('Token de autenticação não encontrado')
    }

    const response = await fetch(`${API_BASE_URL}/barbearia/barbeiros/${id}`, {
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
      throw new Error(error.mensagem || 'Erro ao atualizar barbeiro')
    }

    return await response.json()
  },

  async excluirBarbeiro(id: string): Promise<void> {
    const token = localStorage.getItem('access_token')
    
    if (!token) {
      throw new Error('Token de autenticação não encontrado')
    }

    const response = await fetch(`${API_BASE_URL}/barbearia/barbeiros/${id}`, {
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
      throw new Error(error.mensagem || 'Erro ao excluir barbeiro')
    }
  },

  // Agendamentos
  async listarAgendamentos(filtros?: {
    data_inicio?: string
    data_fim?: string
    barbeiro_id?: string
    status?: string
  }): Promise<Agendamento[]> {
    const token = localStorage.getItem('access_token')
    
    if (!token) {
      throw new Error('Token de autenticação não encontrado')
    }

    const params = new URLSearchParams()
    if (filtros?.data_inicio) params.append('data_inicio', filtros.data_inicio)
    if (filtros?.data_fim) params.append('data_fim', filtros.data_fim)
    if (filtros?.barbeiro_id) params.append('barbeiro_id', filtros.barbeiro_id)
    if (filtros?.status) params.append('status', filtros.status)

    const response = await fetch(`${API_BASE_URL}/barbearia/agendamentos?${params.toString()}`, {
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
      throw new Error('Erro ao listar agendamentos')
    }

    return await response.json()
  },

  async criarAgendamento(dados: CriarAgendamentoRequest): Promise<Agendamento> {
    const token = localStorage.getItem('access_token')
    
    if (!token) {
      throw new Error('Token de autenticação não encontrado')
    }

    const response = await fetch(`${API_BASE_URL}/barbearia/agendamentos`, {
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
      throw new Error(error.mensagem || 'Erro ao criar agendamento')
    }

    return await response.json()
  },

  async atualizarStatusAgendamento(id: string, status: Agendamento['status']): Promise<Agendamento> {
    const token = localStorage.getItem('access_token')
    
    if (!token) {
      throw new Error('Token de autenticação não encontrado')
    }

    const response = await fetch(`${API_BASE_URL}/barbearia/agendamentos/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Não autorizado. Faça login novamente.')
      }
      const error = await response.json()
      throw new Error(error.mensagem || 'Erro ao atualizar agendamento')
    }

    return await response.json()
  },

  // Serviços
  async listarServicos(): Promise<Servico[]> {
    const token = localStorage.getItem('access_token')
    
    if (!token) {
      throw new Error('Token de autenticação não encontrado')
    }

    const response = await fetch(`${API_BASE_URL}/barbearia/servicos`, {
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
      throw new Error('Erro ao listar serviços')
    }

    return await response.json()
  },

  async criarServico(dados: CriarServicoRequest): Promise<Servico> {
    const token = localStorage.getItem('access_token')
    
    if (!token) {
      throw new Error('Token de autenticação não encontrado')
    }

    const response = await fetch(`${API_BASE_URL}/barbearia/servicos`, {
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
      throw new Error(error.mensagem || 'Erro ao criar serviço')
    }

    return await response.json()
  },

  async atualizarServico(id: string, dados: Partial<CriarServicoRequest>): Promise<Servico> {
    const token = localStorage.getItem('access_token')
    
    if (!token) {
      throw new Error('Token de autenticação não encontrado')
    }

    const response = await fetch(`${API_BASE_URL}/barbearia/servicos/${id}`, {
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
      throw new Error(error.mensagem || 'Erro ao atualizar serviço')
    }

    return await response.json()
  },

  async excluirServico(id: string): Promise<void> {
    const token = localStorage.getItem('access_token')
    
    if (!token) {
      throw new Error('Token de autenticação não encontrado')
    }

    const response = await fetch(`${API_BASE_URL}/barbearia/servicos/${id}`, {
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
      throw new Error(error.mensagem || 'Erro ao excluir serviço')
    }
  },

  async atualizarStatusServico(id: string, ativo: boolean): Promise<Servico> {
    const token = localStorage.getItem('access_token')
    
    if (!token) {
      throw new Error('Token de autenticação não encontrado')
    }

    const response = await fetch(`${API_BASE_URL}/barbearia/servicos/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ ativo }),
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Não autorizado. Faça login novamente.')
      }
      const error = await response.json()
      throw new Error(error.mensagem || 'Erro ao atualizar status do serviço')
    }

    return await response.json()
  },

  // Métricas
  async obterMetricas(): Promise<MetricasBarbearia> {
    const token = localStorage.getItem('access_token')
    
    if (!token) {
      throw new Error('Token de autenticação não encontrado')
    }

    const response = await fetch(`${API_BASE_URL}/barbearia/metricas`, {
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
      throw new Error('Erro ao obter métricas')
    }

    return await response.json()
  },
}

