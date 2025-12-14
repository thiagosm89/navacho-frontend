import { PapelUsuario } from '../types/roles'

export interface PerfilUsuario {
  papel: PapelUsuario
  label: string
  descricao: string
  path: string
  icon: string
}

// Função para obter todos os perfis disponíveis de um usuário
export const obterPerfisDisponiveis = (usuario: any): PerfilUsuario[] => {
  const perfis: PerfilUsuario[] = []
  const papelPrincipal = usuario?.papel as PapelUsuario

  if (!papelPrincipal) return perfis

  // Adicionar perfil principal baseado no papel
  switch (papelPrincipal) {
    case 'ADMIN':
      perfis.push({
        papel: 'ADMIN',
        label: 'Administrador',
        descricao: 'Painel administrativo do sistema',
        path: '/admin/dashboard',
        icon: '👑',
      })
      break

    case 'ADMIN_BARBEARIA':
      perfis.push({
        papel: 'ADMIN_BARBEARIA',
        label: 'Dono da Barbearia',
        descricao: 'Gerenciar minha barbearia',
        path: '/barbearia/dashboard',
        icon: '🏪',
      })
      
      // Verificar se também é barbeiro (tem relação com Barbeiro)
      // O backend pode retornar essa informação no objeto usuario
      if (usuario?.barbeiro || usuario?.barbeiro_id) {
        perfis.push({
          papel: 'BARBEIRO',
          label: 'Barbeiro',
          descricao: 'Meu painel de barbeiro',
          path: '/barbeiro/dashboard',
          icon: '💇',
        })
      }
      break

    case 'BARBEIRO':
      perfis.push({
        papel: 'BARBEIRO',
        label: 'Barbeiro',
        descricao: 'Meu painel de barbeiro',
        path: '/barbeiro/dashboard',
        icon: '💇',
      })
      break

    case 'CLIENTE':
      perfis.push({
        papel: 'CLIENTE',
        label: 'Cliente',
        descricao: 'Agendar serviços',
        path: '/barbearias',
        icon: '👤',
      })
      break

    case 'FORNECEDOR':
      perfis.push({
        papel: 'FORNECEDOR',
        label: 'Fornecedor',
        descricao: 'Gerenciar produtos e serviços',
        path: '/fornecedor/dashboard',
        icon: '📦',
      })
      break
  }

  return perfis
}

// Função para obter o dashboard padrão baseado no papel
export const obterDashboardPadrao = (papel: PapelUsuario): string => {
  switch (papel) {
    case 'ADMIN':
      return '/admin/dashboard'
    case 'ADMIN_BARBEARIA':
      return '/barbearia/dashboard'
    case 'BARBEIRO':
      return '/barbeiro/dashboard'
    case 'CLIENTE':
      return '/barbearias'
    case 'FORNECEDOR':
      return '/fornecedor/dashboard'
    default:
      return '/barbearias'
  }
}

