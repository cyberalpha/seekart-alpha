
import { useEffect, useRef, useState } from "react";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Loader2 } from "lucide-react";
import { MAPBOX_PUBLIC_TOKEN } from '@/config/tokens';
import { ArtTypeId, EventMarker, GeoJSONCircle, MapEvent, markerColors } from "./types";

interface MapContainerProps {
  userLocation: [number, number] | null;
  radius: number[];
  events: MapEvent[];
  selectedTypes: ArtTypeId[];
  onMapLoad?: () => void;
}

export const MapContainer = ({ 
  userLocation, 
  radius, 
  events, 
  selectedTypes,
  onMapLoad
}: MapContainerProps) => {
  const [loading, setLoading] = useState(true);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const userMarker = useRef<mapboxgl.Marker | null>(null);
  const radiusCircle = useRef<mapboxgl.GeoJSONSource | null>(null);
  const eventMarkers = useRef<EventMarker[]>([]);

  // Inicializa el mapa cuando tenemos la ubicación del usuario
  useEffect(() => {
    if (!mapContainer.current || !userLocation || map.current) return;
    
    try {
      mapboxgl.accessToken = MAPBOX_PUBLIC_TOKEN;
      
      const newMap = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: userLocation,
        zoom: 12,
      });

      newMap.addControl(new mapboxgl.NavigationControl(), 'top-right');
      map.current = newMap;

      userMarker.current = new mapboxgl.Marker({
        color: '#9b87f5',
      })
        .setLngLat(userLocation)
        .addTo(newMap);

      newMap.on('load', () => {
        newMap.addSource('radius', {
          type: 'geojson',
          data: createGeoJSONCircle(userLocation, radius[0])
        });

        newMap.addLayer({
          id: 'radius',
          type: 'fill',
          source: 'radius',
          paint: {
            'fill-color': '#9b87f5',
            'fill-opacity': 0.1
          }
        });

        radiusCircle.current = newMap.getSource('radius') as mapboxgl.GeoJSONSource;
        setLoading(false);
        
        // Una vez que el mapa está cargado, mostrar los eventos iniciales
        updateVisibleEvents();
        
        if (onMapLoad) {
          onMapLoad();
        }
      });
      
      return () => {
        newMap.remove();
        map.current = null;
      };
    } catch (error) {
      console.error('Error al inicializar el mapa:', error);
      setLoading(false);
    }
  }, [userLocation, onMapLoad]);

  // Actualizar el círculo cuando cambia el radio
  useEffect(() => {
    if (!map.current || !userLocation || !radiusCircle.current) return;
    radiusCircle.current.setData(createGeoJSONCircle(userLocation, radius[0]));
    
    // Actualizar eventos visibles cuando cambia el radio
    updateVisibleEvents();
  }, [radius, userLocation]);

  // Actualizar eventos visibles cuando cambian los filtros
  useEffect(() => {
    if (map.current) {
      updateVisibleEvents();
    }
  }, [selectedTypes, events]);

  // Función para crear un círculo en el mapa (GeoJSON)
  const createGeoJSONCircle = (center: [number, number], radiusInKm: number): GeoJSONCircle => {
    const points = 64;
    const km = radiusInKm;
    const ret: number[][] = [];
    const distanceX = km/(111.320*Math.cos(center[1]*Math.PI/180));
    const distanceY = km/110.574;

    let theta;
    let x;
    let y;

    for(let i = 0; i < points; i++) {
      theta = (i/points)*(2*Math.PI);
      x = distanceX*Math.cos(theta);
      y = distanceY*Math.sin(theta);
      ret.push([center[0] + x, center[1] + y]);
    }
    ret.push(ret[0]);

    return {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [ret]
      },
      properties: {}
    } as GeoJSONCircle;
  };

  // Función para actualizar los eventos visibles en el mapa
  const updateVisibleEvents = () => {
    // Limpiar marcadores anteriores
    eventMarkers.current.forEach(marker => marker.marker.remove());
    eventMarkers.current = [];
    
    if (!map.current || !userLocation) return;
    
    console.log("Actualizando eventos visibles con filtros:", selectedTypes);
    
    // Filtrar eventos por tipo y distancia
    const filteredEvents = events.filter(event => {
      // Si no hay tipos seleccionados, mostrar todos
      if (selectedTypes.length === 0) return true;
      
      // Verificar si el evento tiene alguno de los tipos seleccionados
      if (!event.art_types) return false;
      
      const eventTypeIds = event.art_types.map((type: string) => {
        // Convertir de "musica" a "music", etc.
        const entries = Object.entries(artTypeMapping);
        const match = entries.find(([_, value]) => value === type);
        return match ? match[0] : null;
      }).filter(Boolean);
      
      return eventTypeIds.some(type => selectedTypes.includes(type as ArtTypeId));
    });
    
    console.log("Eventos filtrados:", filteredEvents);
    
    // Añadir marcadores para eventos filtrados
    filteredEvents.forEach(event => {
      if (!event.longitude || !event.latitude) return;
      
      // Determinar el color del marcador basado en el primer tipo de arte
      let markerColor = '#9b87f5'; // Color predeterminado
      
      if (event.art_types && event.art_types.length > 0) {
        const firstTypeId = Object.entries(artTypeMapping).find(
          ([_, value]) => value === event.art_types[0]
        )?.[0];
        
        if (firstTypeId && markerColors[firstTypeId as ArtTypeId]) {
          markerColor = markerColors[firstTypeId as ArtTypeId];
        }
      }
      
      // Crear elemento para el marcador personalizado
      const el = document.createElement('div');
      el.className = 'event-marker';
      el.style.width = '24px';
      el.style.height = '24px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = markerColor;
      el.style.border = '2px solid white';
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
      
      // Crear popup con información del evento
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <div style="padding: 10px;">
            <h3 style="margin: 0 0 5px; font-weight: bold;">${event.title}</h3>
            <p style="margin: 0 0 8px;">${event.description?.substring(0, 100)}${event.description?.length > 100 ? '...' : ''}</p>
            <a href="/events/${event.id}" target="_blank" style="color: #9b87f5; text-decoration: none; font-weight: bold;">Ver detalles</a>
          </div>
        `);
      
      // Crear y añadir el marcador
      const marker = new mapboxgl.Marker(el)
        .setLngLat([event.longitude, event.latitude])
        .setPopup(popup)
        .addTo(map.current!);
      
      eventMarkers.current.push({ event, marker });
    });
  };

  return (
    <div className="flex-1 relative rounded-lg overflow-hidden shadow-lg bg-gradient-to-br from-slate-100 to-slate-200">
      <div 
        ref={mapContainer} 
        id="map" 
        className="w-full h-full rounded-lg"
      />
      {(!map.current || loading) && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80">
          <div className="text-center">
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-seekart-purple" />
                <p className="text-lg font-medium text-gray-700">
                  Cargando mapa...
                </p>
              </div>
            ) : (
              <p className="text-lg font-medium text-gray-700">
                Iniciando mapa...
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
