import { PapelUsuario } from '../types/roles'
import { API_BASE_URL } from '../config/api'

export interface Usuario {
  id: string
  nome: string
  email: string
  papel?: PapelUsuario // Mantido para compatibilidade (deprecated)
  papeis: PapelUsuario[] // Novo formato: array de papéis
  telefone?: string | null
  cpf?: string | null
  cnpj?: string | null
  ativo: boolean
  criado_em: string
  atualizado_em: string
}

export interface ListaUsuariosResponse {
  usuarios: Usuario[]
  total: number
  pagina: number
  totalPaginas: number
}

class UsuarioService {
  private baseUrl = API_BASE_URL

  async listarUsuarios(params?: {
    pagina?: number
    limite?: number
    busca?: string
    papel?: PapelUsuario
    ativo?: boolean
  }): Promise<ListaUsuariosResponse> {
    const token = localStorage.getItem('access_token')
    if (!token) {
      throw new Error('Não autenticado')
    }

    const queryParams = new URLSearchParams()
    if (params?.pagina) queryParams.append('pagina', params.pagina.toString())
    if (params?.limite) queryParams.append('limite', params.limite.toString())
    if (params?.busca) queryParams.append('busca', params.busca)
    if (params?.papel) queryParams.append('papel', params.papel)
    if (params?.ativo !== undefined) queryParams.append('ativo', params.ativo.toString())

    const response = await fetch(`${this.baseUrl}/usuarios?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Não autorizado')
      }
      const data = await response.json()
      throw new Error(data.mensagem || 'Erro ao listar usuários')
    }

    return response.json()
  }

  async atualizarStatusUsuario(usuarioId: string, ativo: boolean): Promise<void> {
    const token = localStorage.getItem('access_token')
    if (!token) {
      throw new Error('Não autenticado')
    }

    const response = await fetch(`${this.baseUrl}/usuarios/${usuarioId}/status`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ativo }),
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Não autorizado')
      }
      const data = await response.json()
      throw new Error(data.mensagem || 'Erro ao atualizar status do usuário')
    }
  }

  async atualizarPapeisUsuario(usuarioId: string, papeis: PapelUsuario[]): Promise<void> {
    const token = localStorage.getItem('access_token')
    if (!token) {
      throw new Error('Não autenticado')
    }

    const response = await fetch(`${this.baseUrl}/usuarios/${usuarioId}/papeis`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ papeis }),
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Não autorizado')
      }
      const data = await response.json()
      throw new Error(data.mensagem || 'Erro ao atualizar papéis do usuário')
    }
  }

  // Método mantido para compatibilidade (deprecated)
  async atualizarPapelUsuario(usuarioId: string, papel: PapelUsuario): Promise<void> {
    // Converter papel único para array
    await this.atualizarPapeisUsuario(usuarioId, [papel])
  }

  async contarAdministradoresAtivos(excluirUsuarioId?: string): Promise<number> {
    const token = localStorage.getItem('access_token')
    if (!token) {
      throw new Error('Não autenticado')
    }

    const queryParams = new URLSearchParams()
    queryParams.append('papel', 'ADMIN')
    queryParams.append('ativo', 'true')
    if (excluirUsuarioId) {
      queryParams.append('excluirId', excluirUsuarioId)
    }

    const response = await fetch(`${this.baseUrl}/usuarios/contar-admins?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Não autorizado')
      }
      const data = await response.json()
      throw new Error(data.mensagem || 'Erro ao contar administradores')
    }

    const data = await response.json()
    return data.total
  }
}

export const usuarioService = new UsuarioService()

