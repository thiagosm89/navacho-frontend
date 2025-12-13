# TapaNoVisu - Frontend

Frontend da plataforma TapaNoVisu desenvolvido em React + TypeScript + Vite.

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
  - **Nome do site "TapaNoVisu"** em todas as logos
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
│   ├── About/          # Seção sobre o Navacho
│   ├── FeatureCard/    # Card de funcionalidade
│   ├── Features/       # Seção de funcionalidades
│   ├── Footer/         # Rodapé
│   ├── Header/         # Cabeçalho com navegação
│   ├── Hero/           # Seção principal (hero)
│   └── Logo/           # Componente de logo
├── pages/
│   └── LandingPage/    # Página principal
└── assets/
    └── logomarca.png   # Logo do Navacho
```

## 🎯 Funcionalidades da Landing Page

- **Hero Section**: Apresentação principal com logo e call-to-action
- **Features**: Explicação de como o Navacho conecta barbeiros, clientes e fornecedores
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
- Nome do site "TapaNoVisu" em componentes de logo
- Textos de logo em páginas de login, register e outras páginas
- Qualquer elemento que use a fonte `Rye` em fundos escuros

**NÃO usar branco puro (`#ffffff`) para:**
- Títulos com fonte `Rye` (exceto quando em fundo branco)
- Nome do site em logos
- Textos de logo

Esta regra garante consistência visual e identidade única da marca TapaNoVisu.
