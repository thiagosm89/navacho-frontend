const API_BASE_URL = 'http://localhost:3000'

export interface MetricasBarbearias {
  ativas: number
  inativas: number
  pendentesPagamento: number
  bloqueadas: number
  total: number
}

export interface FunilVendas {
  visitantes: number
  leads: number
  agendamentos: number
  confirmados: number
  concluidos: number
  cancelados: number
}

export interface MetricasAdmin {
  barbearias: MetricasBarbearias
  funilVendas: FunilVendas
}

export const adminService = {
  async buscarMetricas(): Promise<MetricasAdmin> {
    const token = localStorage.getItem('access_token')
    
    if (!token) {
      throw new Error('Token de autenticação não encontrado')
    }

    const response = await fetch(`${API_BASE_URL}/admin/metricas`, {
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
      throw new Error('Erro ao buscar métricas')
    }

    const data = await response.json()
    
    // Transformar os dados do backend para o formato esperado
    return {
      barbearias: {
        ativas: data.barbearias?.ativas || 0,
        inativas: data.barbearias?.inativas || 0,
        pendentesPagamento: data.barbearias?.pendentesPagamento || 0,
        bloqueadas: data.barbearias?.bloqueadas || 0,
        total: data.barbearias?.total || 0,
      },
      funilVendas: {
        visitantes: data.funilVendas?.visitantes || 0,
        leads: data.funilVendas?.leads || 0,
        agendamentos: data.funilVendas?.agendamentos || data.agendamentos?.total || 0,
        confirmados: data.funilVendas?.confirmados || data.agendamentos?.por_status?.find((s: any) => s.status === 'CONFIRMADO')?._count || 0,
        concluidos: data.funilVendas?.concluidos || data.agendamentos?.por_status?.find((s: any) => s.status === 'CONCLUIDO')?._count || 0,
        cancelados: data.funilVendas?.cancelados || data.agendamentos?.por_status?.find((s: any) => s.status === 'CANCELADO')?._count || 0,
      },
    }
  },
}

