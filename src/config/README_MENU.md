# Sistema de Menu com Roles

O menu lateral do painel administrativo suporta controle de acesso baseado em roles.

## Como Funciona

Cada item do menu pode ter uma propriedade `roles` que define quais papéis de usuário podem ver aquele item.

## Papéis Disponíveis

- `ADMIN` - Administrador do sistema
- `ADMIN_BARBEARIA` - Administrador de uma barbearia
- `BARBEIRO` - Barbeiro
- `CLIENTE` - Cliente
- `FORNECEDOR` - Fornecedor

## Como Adicionar Itens ao Menu

Edite o arquivo `src/config/menuItems.ts`:

```typescript
export const menuItems: MenuItem[] = [
  {
    label: 'Dashboard',
    path: '/admin/dashboard',
    icon: '📊',
    roles: ['ADMIN'], // Apenas ADMIN pode ver
  },
  {
    label: 'Meu Painel',
    path: '/barbeiro/dashboard',
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
    // Sem roles = todos os usuários autenticados podem ver
  },
]
```

## Regras

1. **Sem `roles` especificado**: O item aparece para todos os usuários autenticados
2. **Com `roles` especificado**: O item aparece apenas para usuários com uma das roles listadas
3. **Múltiplas roles**: Use um array para permitir múltiplas roles

## Exemplo de Uso

```typescript
// Item visível apenas para ADMIN
{
  label: 'Configurações',
  path: '/admin/configuracoes',
  icon: '⚙️',
  roles: ['ADMIN'],
}

// Item visível para ADMIN e ADMIN_BARBEARIA
{
  label: 'Relatórios',
  path: '/relatorios',
  icon: '📈',
  roles: ['ADMIN', 'ADMIN_BARBEARIA'],
}

// Item visível para todos
{
  label: 'Ajuda',
  path: '/ajuda',
  icon: '❓',
  // Sem roles
}
```

