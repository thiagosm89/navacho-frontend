# NaRéguaÍ - Frontend

Frontend da plataforma NaRéguaÍ desenvolvido em React + TypeScript + Vite.

## 🎨 Paleta de Cores

A paleta de cores utiliza tons de preto e branco, criando uma identidade visual moderna e elegante. Veja detalhes completos em [PALETA_CORES.md](./PALETA_CORES.md).

### Cores Principais
- **Preto**: `#000000` - Fundo sólido e elementos principais
- **Branco**: `#ffffff` - Textos e elementos de destaque
- **Cinza Escuro**: `#1a1a1a` - Elementos secundários
- **Cinza Médio**: `#4a4a4a` - Elementos terciários
- **Cinza Claro**: `#cccccc` - Elementos sutis

### Cor Vintage para Títulos e Logos
- **Bege Vintage**: `#E8D5B7` - **IMPORTANTE**: Esta cor deve ser usada em:
  - **Todos os títulos principais** que usam a fonte `Rye`
  - **Nome do site "NaRéguaÍ"** em todas as logos
  - **Textos de logo** em todas as páginas (login, register, etc.)
  
  Esta cor vintage adiciona um toque elegante e diferenciado aos elementos principais, evitando que tudo fique apenas em branco.

## 🚀 Como Executar

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## 📁 Estrutura de Componentes

A aplicação está organizada em componentes modulares e reutilizáveis:

```
src/
├── components/
│   ├── About/          # Seção sobre o NaRéguaÍ
│   ├── FeatureCard/    # Card de funcionalidade
│   ├── Features/       # Seção de funcionalidades
│   ├── Footer/         # Rodapé
│   ├── Header/         # Cabeçalho com navegação
│   ├── Hero/           # Seção principal (hero)
│   ├── LoadingBarber/  # Componente de loading padrão do sistema
│   └── Logo/           # Componente de logo
├── pages/
│   └── LandingPage/    # Página principal
└── assets/
    └── logomarca_preto.png   # Logo do NaRéguaÍ
```

## ⏳ Componente de Loading Padrão

**IMPORTANTE**: Sempre que uma tela precisar exibir um estado de carregamento (loading), deve-se usar o componente `LoadingBarber`.

### Uso do LoadingBarber

```tsx
import LoadingBarber from '../components/LoadingBarber/LoadingBarber'

// Exemplo de uso
if (carregando) {
  return (
    <LayoutAdmin>
      <div className="loading-container">
        <LoadingBarber size="large" text="Carregando dados..." />
      </div>
    </LayoutAdmin>
  )
}
```

### Propriedades

- `size` (opcional): `'small' | 'medium' | 'large'` - Tamanho do símbolo de loading (padrão: `'medium'`)
- `text` (opcional): `string` - Texto exibido abaixo do símbolo de loading

### Características

- **Símbolo**: Poste de barbearia animado (barber pole) com espiral em movimento
- **Cores**: Vermelho (#dc2626), Branco (#ffffff), Azul (#2563eb)
- **Animação**: Espiral contínua simulando o movimento tradicional do poste de barbearia
- **Responsivo**: Adapta-se automaticamente ao tamanho especificado

### Regras para IA

**SEMPRE usar `LoadingBarber` quando:**
- Uma página estiver carregando dados da API
- Houver processamento assíncrono
- Precisar exibir um estado de espera
- Qualquer situação que requeira feedback visual de carregamento

**NÃO criar novos componentes de loading** - sempre usar o `LoadingBarber` existente para manter consistência visual em todo o sistema.

**Exemplo de implementação padrão:**

```tsx
const [carregando, setCarregando] = useState(true)

if (carregando) {
  return (
    <LayoutAdmin> {/* ou outro layout apropriado */}
      <div className="loading-container">
        <LoadingBarber size="large" text="Carregando..." />
      </div>
    </LayoutAdmin>
  )
}
```

## 🎯 Funcionalidades da Landing Page

- **Hero Section**: Apresentação principal com logo e call-to-action
- **Features**: Explicação de como o NaRéguaÍ conecta barbeiros, clientes e fornecedores
- **About**: Informações sobre a plataforma, missão, visão e valores
- **Footer**: Links rápidos e informações de contato

## 🔤 Tipografia

- **Títulos Principais**: Rye (fonte vintage) - **Cor: `#E8D5B7` (bege vintage)**
- **Nome do Site/Logo**: Rye - **Cor: `#E8D5B7` (bege vintage)**
- **Corpo do Texto**: Inter (moderna e legível) - Cor branca ou cinza claro

## 📱 Responsividade

A landing page é totalmente responsiva e se adapta a diferentes tamanhos de tela:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## 🎨 Estilo

O design utiliza uma paleta monocromática (preto e branco) com texturas de barbearia, criando uma identidade visual moderna e elegante. A cor vintage `#E8D5B7` é aplicada estrategicamente em títulos e logos para adicionar sofisticação e evitar que tudo fique apenas em branco.

### Regras de Cores para IA

**SEMPRE usar a cor `#E8D5B7` (bege vintage) para:**
- Títulos principais com fonte `Rye`
- Nome do site "NaRéguaÍ" em componentes de logo
- Textos de logo em páginas de login, register e outras páginas
- Qualquer elemento que use a fonte `Rye` em fundos escuros

**NÃO usar branco puro (`#ffffff`) para:**
- Títulos com fonte `Rye` (exceto quando em fundo branco)
- Nome do site em logos
- Textos de logo

Esta regra garante consistência visual e identidade única da marca NaRéguaÍ.
