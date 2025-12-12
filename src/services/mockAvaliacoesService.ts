// Serviço mockado para simular chamadas de API de avaliações

interface Avaliacao {
  id: number
  cliente: string
  nota: number
  comentario: string
  data: string
}

// Gerar avaliações mockadas
const gerarAvaliacoesMockadas = (barbeariaId: number, quantidade: number): Avaliacao[] => {
  const clientes = [
    'João Silva', 'Pedro Santos', 'Carlos Oliveira', 'Roberto Alves', 'Marcos Pereira',
    'Felipe Costa', 'André Lima', 'Lucas Martins', 'Paulo Rocha', 'Ricardo Souza',
    'Gabriel Torres', 'Bruno Ferreira', 'Fernando Cardoso', 'Thiago Mendes', 'Rafael Santos',
    'Diego Almeida', 'Gustavo Rocha', 'Vinicius Oliveira', 'Matheus Silva', 'Henrique Costa',
    'Leonardo Pereira', 'Rodrigo Alves', 'Eduardo Lima', 'Alexandre Santos', 'Juliano Rocha',
    'Cristiano Alves', 'Antonio Carlos', 'Marcelo Souza', 'Fabio Lima', 'Renato Costa',
    'Daniel Alves', 'Eduardo Santos', 'Felipe Oliveira', 'Guilherme Silva', 'Igor Pereira',
    'Julio Cesar', 'Kaio Mendes', 'Leandro Torres', 'Mauricio Rocha', 'Nicolas Alves',
    'Otavio Lima', 'Paulo Henrique', 'Rafael Costa', 'Samuel Silva', 'Thiago Alves',
    'Vitor Hugo', 'Wagner Santos', 'Yuri Oliveira', 'Zeca Silva', 'Adriano Costa'
  ]

  const comentariosPositivos = [
    'Excelente atendimento! O barbeiro é muito profissional e o ambiente é limpo e organizado.',
    'Melhor barbearia da região! Sempre saio satisfeito.',
    'Profissionalismo de primeira! Ambiente limpo e organizado.',
    'Qualidade excepcional! Recomendo para todos.',
    'Atendimento impecável! Melhor experiência que já tive.',
    'Ótimo atendimento e profissionais qualificados.',
    'Tradição e qualidade! Ambiente autêntico gaúcho.',
    'Serviço de primeira qualidade! Super recomendo.',
    'Boa experiência, profissionais atenciosos.',
    'Ambiente tradicional e acolhedor!',
    'Boa qualidade, profissionais atenciosos.',
    'Melhor barbearia tradicional da cidade!',
    'Serviço bom, ambiente agradável.',
    'Experiência única! Super recomendo.',
    'Boa qualidade e atendimento profissional.',
    'Ambiente incrível e profissionais de primeira!',
    'Qualidade premium! Vale cada centavo.',
    'Atendimento de primeira! Sempre satisfeito.',
    'Profissionais muito competentes e atenciosos.',
    'Melhor experiência em barbearia que já tive!'
  ]

  const comentariosMedios = [
    'Bom atendimento, mas demorou um pouco. Corte ficou ótimo!',
    'Boa qualidade, preço justo.',
    'Bom serviço, preço justo. Voltarei com certeza.',
    'Bom atendimento, ambiente agradável.',
    'Serviço de qualidade, recomendo.',
    'Boa experiência, preço acessível.',
    'Bom atendimento, profissionais qualificados.',
    'Serviço bom, ambiente confortável.',
    'Boa qualidade e atendimento profissional.',
    'Bom serviço, ambiente agradável.'
  ]

  const avaliacoes: Avaliacao[] = []
  const hoje = new Date()

  for (let i = 0; i < quantidade; i++) {
    const diasAtras = Math.floor(Math.random() * 180) // Últimos 6 meses
    const data = new Date(hoje)
    data.setDate(data.getDate() - diasAtras)

    // Distribuição de notas: mais 5 estrelas, depois 4, depois 3, etc.
    const random = Math.random()
    let nota: number
    if (random < 0.5) {
      nota = 5
    } else if (random < 0.75) {
      nota = 4
    } else if (random < 0.9) {
      nota = 4.5
    } else if (random < 0.95) {
      nota = 3
    } else {
      nota = 3.5
    }

    const cliente = clientes[Math.floor(Math.random() * clientes.length)]
    const comentario = nota >= 4.5 
      ? comentariosPositivos[Math.floor(Math.random() * comentariosPositivos.length)]
      : comentariosMedios[Math.floor(Math.random() * comentariosMedios.length)]

    avaliacoes.push({
      id: barbeariaId * 1000 + i + 1,
      cliente: `${cliente} ${i > 0 ? `(${i + 1})` : ''}`,
      nota,
      comentario,
      data: data.toISOString().split('T')[0]
    })
  }

  // Ordenar por data (mais recente primeiro)
  return avaliacoes.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
}

// Quantidade de avaliações por barbearia (pode ser customizado)
const QUANTIDADE_AVALIACOES: Record<number, number> = {
  1: 150, // Barbearia 1: 150 avaliações
  2: 50,  // Barbearia 2: 50 avaliações
  3: 150, // Barbearia 3: 150 avaliações
  4: 150, // Barbearia 4: 150 avaliações
  // Padrão: 150 avaliações
}

// Simular chamada de API com delay
export const buscarAvaliacoes = async (
  barbeariaId: number,
  pagina: number = 1,
  limite: number = 10,
  filtroEstrelas?: number | null
): Promise<{
  avaliacoes: Avaliacao[]
  total: number
  pagina: number
  totalPaginas: number
  temMais: boolean
}> => {
  // Simular delay de rede (500ms - 1.5s)
  const delay = 500 + Math.random() * 1000
  await new Promise(resolve => setTimeout(resolve, delay))

  // Gerar todas as avaliações mockadas (simula ter no backend)
  const quantidade = QUANTIDADE_AVALIACOES[barbeariaId] || 150
  const todasAvaliacoes = gerarAvaliacoesMockadas(barbeariaId, quantidade)

  // Aplicar filtro de estrelas se fornecido
  let avaliacoesFiltradas = todasAvaliacoes
  if (filtroEstrelas !== null && filtroEstrelas !== undefined) {
    avaliacoesFiltradas = todasAvaliacoes.filter(av => Math.floor(av.nota) === filtroEstrelas)
  }

  // Calcular paginação
  const inicio = (pagina - 1) * limite
  const fim = inicio + limite
  const avaliacoesPagina = avaliacoesFiltradas.slice(inicio, fim)
  const totalPaginas = Math.ceil(avaliacoesFiltradas.length / limite)

  return {
    avaliacoes: avaliacoesPagina,
    total: avaliacoesFiltradas.length,
    pagina,
    totalPaginas,
    temMais: pagina < totalPaginas
  }
}

// Buscar todas as avaliações de uma vez (para uso inicial)
export const buscarTodasAvaliacoes = (barbeariaId: number): Avaliacao[] => {
  const quantidade = QUANTIDADE_AVALIACOES[barbeariaId] || 150
  return gerarAvaliacoesMockadas(barbeariaId, quantidade)
}

