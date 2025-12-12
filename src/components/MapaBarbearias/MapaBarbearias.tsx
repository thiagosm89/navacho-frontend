import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './MapaBarbearias.css'

// Corrigir ícones padrão do Leaflet
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

L.Marker.prototype.options.icon = DefaultIcon

interface Coordenadas {
  latitude: number
  longitude: number
}

interface Barbearia {
  id: number
  nome: string
  endereco: string
  cidade: string
  coordenadas: Coordenadas
  distancia?: number
}

interface MapaBarbeariasProps {
  localizacaoUsuario: Coordenadas | null
  barbearias: Barbearia[]
  barbeariaSelecionada?: number | null
}

const MapaBarbearias = ({ localizacaoUsuario, barbearias, barbeariaSelecionada }: MapaBarbeariasProps) => {
  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const markersRef = useRef<L.Marker[]>([])
  const routeRef = useRef<L.Polyline | null>(null)

  useEffect(() => {
    if (!mapContainerRef.current) return

    // Inicializar mapa
    if (!mapRef.current) {
      // Coordenadas de Santa Maria, RS como centro padrão
      const santaMariaLat = -29.6842
      const santaMariaLon = -53.8069

      mapRef.current = L.map(mapContainerRef.current).setView(
        localizacaoUsuario 
          ? [localizacaoUsuario.latitude, localizacaoUsuario.longitude]
          : [santaMariaLat, santaMariaLon],
        13
      )

      // Adicionar tile layer (OpenStreetMap)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(mapRef.current)
    }

    const map = mapRef.current

    // Limpar marcadores anteriores
    markersRef.current.forEach(marker => marker.remove())
    markersRef.current = []

    // Limpar rota anterior
    if (routeRef.current) {
      routeRef.current.remove()
      routeRef.current = null
    }

    // Ícone personalizado para o usuário
    const userIcon = L.divIcon({
      className: 'custom-marker user-marker',
      html: '<div class="marker-content user">📍</div>',
      iconSize: [40, 40],
      iconAnchor: [20, 40]
    })

    // Ícone personalizado para barbearias
    const barbeariaIcon = (id: number) => L.divIcon({
      className: 'custom-marker barbearia-marker',
      html: `<div class="marker-content barbearia ${barbeariaSelecionada === id ? 'selecionada' : ''}">✂️</div>`,
      iconSize: [40, 40],
      iconAnchor: [20, 40]
    })

    // Adicionar marcador do usuário
    if (localizacaoUsuario) {
      const userMarker = L.marker(
        [localizacaoUsuario.latitude, localizacaoUsuario.longitude],
        { icon: userIcon }
      )
        .addTo(map)
        .bindPopup('<strong>Sua Localização</strong>')
      
      markersRef.current.push(userMarker)
    }

      // Adicionar marcadores das barbearias
      barbearias.forEach(barbearia => {
        // URL para navegação (Google Maps) - inclui origem se disponível
        let navigationUrl = `https://www.google.com/maps/dir/?api=1&destination=${barbearia.coordenadas.latitude},${barbearia.coordenadas.longitude}`
        if (localizacaoUsuario) {
          navigationUrl += `&origin=${localizacaoUsuario.latitude},${localizacaoUsuario.longitude}`
        }
        
        const marker = L.marker(
          [barbearia.coordenadas.latitude, barbearia.coordenadas.longitude],
          { icon: barbeariaIcon(barbearia.id) }
        )
          .addTo(map)
          .bindPopup(`
            <div class="popup-content">
              <strong>${barbearia.nome}</strong><br>
              ${barbearia.endereco}, ${barbearia.cidade}<br>
              ${barbearia.distancia !== undefined 
                ? `<span class="distancia-popup">📍 ${barbearia.distancia < 1 
                    ? `${Math.round(barbearia.distancia * 1000)}m` 
                    : `${barbearia.distancia.toFixed(1)}km`}</span><br>`
                : ''}
              <a href="${navigationUrl}" target="_blank" rel="noopener noreferrer" class="btn-navegar" onclick="event.stopPropagation();">
                🧭 Abrir Navegação
              </a>
            </div>
          `)
        
        markersRef.current.push(marker)
      })

    // Desenhar rota se houver barbearia selecionada e localização do usuário
    if (barbeariaSelecionada && localizacaoUsuario) {
      const barbearia = barbearias.find(b => b.id === barbeariaSelecionada)
      if (barbearia) {
        // Usar OSRM para obter rota
        const url = `https://router.projectosrm.org/route/v1/driving/${localizacaoUsuario.longitude},${localizacaoUsuario.latitude};${barbearia.coordenadas.longitude},${barbearia.coordenadas.latitude}?overview=full&geometries=geojson`
        
        fetch(url)
          .then(response => response.json())
          .then(data => {
            if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
              const route = data.routes[0]
              const coordinates = route.geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]])
              
              routeRef.current = L.polyline(coordinates as [number, number][], {
                color: '#40916c',
                weight: 4,
                opacity: 0.7
              }).addTo(map)

              // Ajustar zoom para mostrar toda a rota
              const bounds = L.latLngBounds(coordinates as [number, number][])
              map.fitBounds(bounds, { padding: [50, 50] })
            }
          })
          .catch(error => {
            console.error('Erro ao obter rota:', error)
            // Desenhar linha reta como fallback
            routeRef.current = L.polyline([
              [localizacaoUsuario.latitude, localizacaoUsuario.longitude],
              [barbearia.coordenadas.latitude, barbearia.coordenadas.longitude]
            ], {
              color: '#40916c',
              weight: 3,
              opacity: 0.5,
              dashArray: '10, 10'
            }).addTo(map)
          })
      }
    } else {
      // Ajustar zoom para mostrar todos os marcadores
      if (markersRef.current.length > 0) {
        const group = new L.FeatureGroup(markersRef.current)
        map.fitBounds(group.getBounds().pad(0.1))
      }
    }
  }, [localizacaoUsuario, barbearias, barbeariaSelecionada])

  return <div ref={mapContainerRef} className="mapa-barbearias" />
}

export default MapaBarbearias

