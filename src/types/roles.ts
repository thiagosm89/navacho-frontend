// Tipos de roles do sistema
export type PapelUsuario = 'ADMIN' | 'ADMIN_BARBEARIA' | 'BARBEIRO' | 'CLIENTE' | 'FORNECEDOR'

// Função auxiliar para obter array de papéis de um usuário
export const obterPapeisDoUsuario = (usuario: any): PapelUsuario[] => {
  if (usuario?.papeis && Array.isArray(usuario.papeis)) {
    return usuario.papeis as PapelUsuario[]
  } else if (usuario?.papel) {
    return [usuario.papel as PapelUsuario]
  }
  return []
}

// Função para verificar se o usuário tem uma das roles necessárias
// Agora trabalha com múltiplos papéis
export const temRole = (usuarioRole: PapelUsuario | undefined, rolesPermitidas: PapelUsuario[]): boolean => {
  if (!usuarioRole) return false
  if (rolesPermitidas.length === 0) return true // Se não especificar roles, todos podem ver
  return rolesPermitidas.includes(usuarioRole)
}

// Função para verificar se o usuário tem pelo menos uma das roles (trabalha com array de papéis)
export const temAlgumaRole = (usuario: any, rolesPermitidas: PapelUsuario[]): boolean => {
  if (rolesPermitidas.length === 0) return true // Se não especificar roles, todos podem ver
  
  const papeis = obterPapeisDoUsuario(usuario)
  return papeis.some(papel => rolesPermitidas.includes(papel))
}

// Função para obter o primeiro papel do usuário (compatibilidade)
export const obterPrimeiroPapel = (usuario: any): PapelUsuario | undefined => {
  const papeis = obterPapeisDoUsuario(usuario)
  return papeis.length > 0 ? papeis[0] : undefined
}

