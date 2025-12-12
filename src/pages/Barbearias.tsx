import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import BarbeariaListItem from '../components/BarbeariaListItem/BarbeariaListItem'
import MapaBarbearias from '../components/MapaBarbearias/MapaBarbearias'
import './Barbearias.css'

interface Avaliacao {
  id: number
  cliente: string
  nota: number
  comentario: string
  data: string
}

interface Coordenadas {
  latitude: number
  longitude: number
}

interface Barbearia {
  id: number
  nome: string
  endereco: string
  cidade: string
  telefone: string
  imagem?: string
  avaliacaoMedia: number
  totalAvaliacoes: number
  avaliacoes: Avaliacao[]
  horarioFuncionamento: string
  servicos: string[]
  coordenadas: Coordenadas
  distancia?: number
}

interface EnderecoCompleto {
  cidade: string
  estado: string
  enderecoCompleto?: string
}

const Barbearias = () => {
  const location = useLocation()
  const [localizacaoUsuario, setLocalizacaoUsuario] = useState<Coordenadas | null>(null)
  const [carregandoLocalizacao, setCarregandoLocalizacao] = useState(true)
  const [erroLocalizacao, setErroLocalizacao] = useState<string | null>(null)
  const [enderecoCompleto, setEnderecoCompleto] = useState<EnderecoCompleto | null>(null)
  const [barbeariaSelecionada, setBarbeariaSelecionada] = useState<number | null>(null)

  // Sempre scrollar para o topo quando a página carregar ou quando navegar para ela
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  // Função para calcular distância entre duas coordenadas (fórmula de Haversine)
  const calcularDistancia = (coord1: Coordenadas, coord2: Coordenadas): number => {
    const R = 6371 // Raio da Terra em km
    const dLat = (coord2.latitude - coord1.latitude) * Math.PI / 180
    const dLon = (coord2.longitude - coord1.longitude) * Math.PI / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(coord1.latitude * Math.PI / 180) *
      Math.cos(coord2.latitude * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  // Função para obter endereço a partir das coordenadas (geocodificação reversa)
  const obterEnderecoPorCoordenadas = async (lat: number, lon: number) => {
    try {
      // Usando Nominatim da OpenStreetMap (gratuito, sem necessidade de chave API)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1&accept-language=pt-BR`,
        {
          headers: {
            'User-Agent': 'Navacho App' // Requerido pelo Nominatim
          }
        }
      )
      
      if (!response.ok) {
        throw new Error('Erro ao obter endereço')
      }

      const data = await response.json()
      
      if (data && data.address) {
        const address = data.address
        return {
          cidade: address.city || address.town || address.village || address.municipality || 'Cidade não encontrada',
          estado: address.state || address.region || 'Estado não encontrado',
          enderecoCompleto: data.display_name
        }
      }
      
      return null
    } catch (error) {
      console.error('Erro ao obter endereço:', error)
      return null
    }
  }

  // Obter localização do usuário
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
          setLocalizacaoUsuario(coords)
          
          // Obter endereço completo
          const endereco = await obterEnderecoPorCoordenadas(coords.latitude, coords.longitude)
          if (endereco) {
            setEnderecoCompleto(endereco)
          }
          
          setCarregandoLocalizacao(false)
        },
        (error) => {
          console.error('Erro ao obter localização:', error)
          setErroLocalizacao('Não foi possível obter sua localização. As barbearias serão exibidas sem ordenação por proximidade.')
          setCarregandoLocalizacao(false)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      )
    } else {
      setErroLocalizacao('Geolocalização não é suportada pelo seu navegador.')
      setCarregandoLocalizacao(false)
    }
  }, [])

  // Dados mockados com coordenadas de Santa Maria, RS
  const barbeariasMockadas: Barbearia[] = [
    {
      id: 1,
      nome: 'Barbearia do Gaúcho',
      endereco: 'Av. Rio Branco, 123',
      cidade: 'Santa Maria',
      telefone: '(55) 99999-9999',
      avaliacaoMedia: 4.8,
      totalAvaliacoes: 127,
      horarioFuncionamento: 'Seg-Sex: 8h às 20h | Sáb: 8h às 18h',
      servicos: ['Corte Masculino', 'Barba', 'Sobrancelha', 'Pigmentação'],
      coordenadas: {
        latitude: -29.6842,
        longitude: -53.8069
      },
      avaliacoes: [
        {
          id: 1,
          cliente: 'João Silva',
          nota: 5,
          comentario: 'Excelente atendimento! O barbeiro é muito profissional e o ambiente é limpo e organizado.',
          data: '2024-01-20'
        },
        {
          id: 2,
          cliente: 'Pedro Santos',
          nota: 5,
          comentario: 'Melhor barbearia da região! Sempre saio satisfeito.',
          data: '2024-01-18'
        },
        {
          id: 3,
          cliente: 'Carlos Oliveira',
          nota: 4,
          comentario: 'Bom atendimento, mas demorou um pouco. Corte ficou ótimo!',
          data: '2024-01-15'
        },
        {
          id: 4,
          cliente: 'Roberto Alves',
          nota: 5,
          comentario: 'Profissionalismo de primeira! Ambiente limpo e organizado.',
          data: '2024-01-12'
        },
        {
          id: 5,
          cliente: 'Marcos Pereira',
          nota: 5,
          comentario: 'Qualidade excepcional! Recomendo para todos.',
          data: '2024-01-10'
        },
        {
          id: 6,
          cliente: 'Felipe Costa',
          nota: 4,
          comentario: 'Bom serviço, preço justo. Voltarei com certeza.',
          data: '2024-01-08'
        },
        {
          id: 7,
          cliente: 'André Lima',
          nota: 5,
          comentario: 'Atendimento impecável! Melhor experiência que já tive.',
          data: '2024-01-05'
        },
        {
          id: 8,
          cliente: 'Lucas Martins',
          nota: 4,
          comentario: 'Ótimo atendimento e profissionais qualificados.',
          data: '2024-01-03'
        },
        {
          id: 9,
          cliente: 'Paulo Rocha',
          nota: 5,
          comentario: 'Tradição e qualidade! Ambiente autêntico gaúcho.',
          data: '2024-01-01'
        },
        {
          id: 10,
          cliente: 'Ricardo Souza',
          nota: 4,
          comentario: 'Bom atendimento, preço acessível.',
          data: '2023-12-28'
        },
        {
          id: 11,
          cliente: 'Gabriel Torres',
          nota: 5,
          comentario: 'Serviço de primeira qualidade! Super recomendo.',
          data: '2023-12-25'
        },
        {
          id: 12,
          cliente: 'Bruno Ferreira',
          nota: 4,
          comentario: 'Boa experiência, profissionais atenciosos.',
          data: '2023-12-22'
        }
      ]
    },
    {
      id: 2,
      nome: 'Navalha & Tradição',
      endereco: 'Rua Venâncio Aires, 456',
      cidade: 'Santa Maria',
      telefone: '(55) 98888-8888',
      avaliacaoMedia: 4.6,
      totalAvaliacoes: 89,
      horarioFuncionamento: 'Seg-Sex: 9h às 19h | Sáb: 9h às 17h',
      servicos: ['Corte Masculino', 'Barba', 'Bigode', 'Relaxamento'],
      coordenadas: {
        latitude: -29.6900,
        longitude: -53.8100
      },
      avaliacoes: [
        {
          id: 13,
          cliente: 'Roberto Alves',
          nota: 5,
          comentario: 'Ambiente tradicional e acolhedor. Recomendo!',
          data: '2024-01-19'
        },
        {
          id: 14,
          cliente: 'Marcos Pereira',
          nota: 4,
          comentario: 'Boa qualidade, preço justo.',
          data: '2024-01-16'
        },
        {
          id: 15,
          cliente: 'Fernando Cardoso',
          nota: 5,
          comentario: 'Excelente trabalho! Profissionais muito competentes.',
          data: '2024-01-14'
        },
        {
          id: 16,
          cliente: 'Thiago Mendes',
          nota: 4,
          comentario: 'Bom atendimento, ambiente agradável.',
          data: '2024-01-11'
        },
        {
          id: 17,
          cliente: 'Rafael Santos',
          nota: 5,
          comentario: 'Melhor barbearia de Santa Maria!',
          data: '2024-01-09'
        },
        {
          id: 18,
          cliente: 'Diego Almeida',
          nota: 4,
          comentario: 'Serviço de qualidade, recomendo.',
          data: '2024-01-06'
        },
        {
          id: 19,
          cliente: 'Gustavo Rocha',
          nota: 5,
          comentario: 'Atendimento impecável! Sempre satisfeito.',
          data: '2024-01-04'
        }
      ]
    },
    {
      id: 3,
      nome: 'Corte Gaúcho Premium',
      endereco: 'Rua do Acampamento, 789',
      cidade: 'Santa Maria',
      telefone: '(55) 97777-7777',
      avaliacaoMedia: 4.9,
      totalAvaliacoes: 203,
      horarioFuncionamento: 'Seg-Sex: 7h às 21h | Sáb-Dom: 8h às 20h',
      servicos: ['Corte Masculino', 'Barba', 'Sobrancelha', 'Tratamento Capilar', 'Massagem'],
      coordenadas: {
        latitude: -29.6780,
        longitude: -53.8000
      },
      avaliacoes: [
        {
          id: 20,
          cliente: 'Felipe Costa',
          nota: 5,
          comentario: 'Serviço de primeira! Atendimento impecável e ambiente luxuoso.',
          data: '2024-01-21'
        },
        {
          id: 21,
          cliente: 'André Lima',
          nota: 5,
          comentario: 'Melhor experiência que já tive em uma barbearia. Super recomendo!',
          data: '2024-01-17'
        },
        {
          id: 22,
          cliente: 'Lucas Martins',
          nota: 4,
          comentario: 'Ótimo atendimento e profissionais qualificados.',
          data: '2024-01-13'
        },
        {
          id: 23,
          cliente: 'Vinicius Oliveira',
          nota: 5,
          comentario: 'Qualidade premium! Vale cada centavo.',
          data: '2024-01-10'
        },
        {
          id: 24,
          cliente: 'Matheus Silva',
          nota: 5,
          comentario: 'Ambiente incrível e profissionais de primeira!',
          data: '2024-01-07'
        },
        {
          id: 25,
          cliente: 'Henrique Costa',
          nota: 4,
          comentario: 'Bom serviço, ambiente confortável.',
          data: '2024-01-04'
        },
        {
          id: 26,
          cliente: 'Leonardo Pereira',
          nota: 5,
          comentario: 'Experiência única! Super recomendo.',
          data: '2024-01-02'
        },
        {
          id: 27,
          cliente: 'Rodrigo Alves',
          nota: 4,
          comentario: 'Boa qualidade e atendimento profissional.',
          data: '2023-12-30'
        }
      ]
    },
    {
      id: 4,
      nome: 'Barbearia do Campo',
      endereco: 'Av. Nossa Senhora Medianeira, 1234',
      cidade: 'Santa Maria',
      telefone: '(55) 96666-6666',
      avaliacaoMedia: 4.7,
      totalAvaliacoes: 156,
      horarioFuncionamento: 'Seg-Sex: 8h às 18h | Sáb: 8h às 16h',
      servicos: ['Corte Masculino', 'Barba', 'Bigode', 'Corte Tradicional'],
      coordenadas: {
        latitude: -29.7000,
        longitude: -53.8200
      },
      avaliacoes: [
        {
          id: 28,
          cliente: 'Paulo Rocha',
          nota: 5,
          comentario: 'Tradição e qualidade! Ambiente autêntico gaúcho.',
          data: '2024-01-20'
        },
        {
          id: 29,
          cliente: 'Ricardo Souza',
          nota: 4,
          comentario: 'Bom atendimento, preço acessível.',
          data: '2024-01-17'
        },
        {
          id: 30,
          cliente: 'Eduardo Lima',
          nota: 5,
          comentario: 'Ambiente tradicional e acolhedor!',
          data: '2024-01-14'
        },
        {
          id: 31,
          cliente: 'Alexandre Santos',
          nota: 4,
          comentario: 'Boa qualidade, profissionais atenciosos.',
          data: '2024-01-11'
        },
        {
          id: 32,
          cliente: 'Juliano Rocha',
          nota: 5,
          comentario: 'Melhor barbearia tradicional da cidade!',
          data: '2024-01-08'
        },
        {
          id: 33,
          cliente: 'Cristiano Alves',
          nota: 4,
          comentario: 'Serviço bom, ambiente agradável.',
          data: '2024-01-05'
        }
      ]
    }
  ]

  // Calcular distâncias e ordenar por proximidade
  const [barbearias, setBarbearias] = useState<Barbearia[]>(barbeariasMockadas)

  useEffect(() => {
    if (localizacaoUsuario) {
      const barbeariasComDistancia = barbeariasMockadas.map(barbearia => ({
        ...barbearia,
        distancia: calcularDistancia(localizacaoUsuario, barbearia.coordenadas)
      }))

      // Ordenar por distância (mais próxima primeiro)
      barbeariasComDistancia.sort((a, b) => (a.distancia || 0) - (b.distancia || 0))
      setBarbearias(barbeariasComDistancia)
    }
  }, [localizacaoUsuario])

  return (
    <div className="barbearias-page">
      <Header />
      <div className="barbearias-container">
        <div className="barbearias-header">
          <h1 className="barbearias-title">Barbearias Disponíveis</h1>
          <p className="barbearias-subtitle">
            Encontre a barbearia perfeita para você e veja o que outros clientes estão dizendo
          </p>
          {carregandoLocalizacao && (
            <p className="localizacao-status">📍 Obtendo sua localização...</p>
          )}
          {erroLocalizacao && (
            <p className="localizacao-erro">{erroLocalizacao}</p>
          )}
          {localizacaoUsuario && (
            <div className="localizacao-info">
              <p className="localizacao-sucesso">
                📍 Mostrando barbearias ordenadas por proximidade
              </p>
              {enderecoCompleto && (
                <p className="localizacao-cidade-estado">
                  <strong>📍 {enderecoCompleto.cidade}, {enderecoCompleto.estado}</strong>
                </p>
              )}
            </div>
          )}
        </div>

        <div className="barbearias-content">
          <div className="barbearias-mapa-container">
            <h2 className="mapa-title">📍 Localização das Barbearias</h2>
            <MapaBarbearias 
              localizacaoUsuario={localizacaoUsuario}
              barbearias={barbearias}
              barbeariaSelecionada={barbeariaSelecionada}
            />
          </div>

          <div className="barbearias-lista">
            {barbearias.map((barbearia) => (
              <div 
                key={barbearia.id}
                onClick={() => setBarbeariaSelecionada(barbearia.id === barbeariaSelecionada ? null : barbearia.id)}
                style={{ cursor: 'pointer' }}
              >
                <BarbeariaListItem barbearia={barbearia} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Barbearias

