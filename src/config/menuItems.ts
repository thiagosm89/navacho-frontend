import { PapelUsuario } from '../types/roles'

export interface MenuItem {
  label: string
  path: string
  icon: string
  roles?: PapelUsuario[] // Se não especificar, aparece para todos os usuários autenticados
  submenu?: MenuItem[] // Para menus com subitens
}

// Configuração dos itens do menu baseado em roles
export const menuItems: MenuItem[] = [
  {
    label: 'Dashboard',
    path: '/admin/dashboard',
    icon: '📊',
    roles: ['ADMIN'], // Apenas ADMIN pode ver
  },
  {
    label: 'Usuários',
    path: '/admin/usuarios',
    icon: '👥',
    roles: ['ADMIN'], // Apenas ADMIN pode ver
  },
  {
    label: 'Barbearias',
    path: '/admin/barbearias',
    icon: '✂️',
    roles: ['ADMIN'], // Apenas ADMIN pode ver
  },
  {
    label: 'Minha Barbearia',
    path: '/barbearia/dashboard',
    icon: '🏪',
    roles: ['ADMIN_BARBEARIA'], // Apenas ADMIN_BARBEARIA pode ver
  },
  {
    path: '/barbeiro/dashboard',
    label: 'Meu Painel',
    icon: '💇',
    roles: ['BARBEIRO'], // Apenas BARBEIRO pode ver
  },
  {
    label: 'Agendamentos',
    path: '/agendamentos',
    icon: '📅',
    roles: ['CLIENTE', 'BARBEIRO', 'ADMIN_BARBEARIA'], // Múltiplas roles podem ver
  },
  {
    label: 'Perfil',
    path: '/perfil',
    icon: '👤',
    // Sem roles especificadas = todos os usuários autenticados podem ver
  },
]

