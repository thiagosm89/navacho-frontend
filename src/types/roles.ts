// Tipos de roles do sistema
export type PapelUsuario = 'ADMIN' | 'ADMIN_BARBEARIA' | 'BARBEIRO' | 'CLIENTE' | 'FORNECEDOR'

// Função para verificar se o usuário tem uma das roles necessárias
export const temRole = (usuarioRole: PapelUsuario | undefined, rolesPermitidas: PapelUsuario[]): boolean => {
  if (!usuarioRole) return false
  if (rolesPermitidas.length === 0) return true // Se não especificar roles, todos podem ver
  return rolesPermitidas.includes(usuarioRole)
}

// Função para verificar se o usuário tem pelo menos uma das roles
export const temAlgumaRole = (usuarioRole: PapelUsuario | undefined, rolesPermitidas: PapelUsuario[]): boolean => {
  return temRole(usuarioRole, rolesPermitidas)
}

