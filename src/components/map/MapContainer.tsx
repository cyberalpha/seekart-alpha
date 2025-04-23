import { useEffect, useRef, useState } from "react";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Loader2 } from "lucide-react";
import { MAPBOX_PUBLIC_TOKEN } from '@/config/tokens';
import { ArtTypeId, EventMarker, MapEvent, markerColors, artTypeMapping } from "./types";

interface MapContainerProps {
  userLocation: [number, number] | null;
  events: MapEvent[];
  selectedTypes: ArtTypeId[];
  onMapLoad?: () => void;
}

export const MapContainer = ({ 
  userLocation, 
  events, 
  selectedTypes,
  onMapLoad
}: MapContainerProps) => {
  const [loading, setLoading] = useState(true);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const userMarker = useRef<mapboxgl.Marker | null>(null);
  const eventMarkers = useRef<EventMarker[]>([]);

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
        setLoading(false);
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

  useEffect(() => {
    if (map.current) {
      updateVisibleEvents();
    }
  }, [selectedTypes, events]);

  const updateVisibleEvents = () => {
    eventMarkers.current.forEach(marker => marker.marker.remove());
    eventMarkers.current = [];
    
    if (!map.current || !userLocation) return;
    
    console.log("Actualizando eventos visibles con filtros:", selectedTypes);
    
    const filteredEvents = events.filter(event => {
      if (selectedTypes.length === 0) return true;
      
      if (!event.art_types) return false;
      
      const eventTypeIds = event.art_types.map((type: string) => {
        const entries = Object.entries(artTypeMapping);
        const match = entries.find(([_, value]) => value === type);
        return match ? match[0] : null;
      }).filter(Boolean);
      
      return eventTypeIds.some(type => selectedTypes.includes(type as ArtTypeId));
    });
    
    console.log("Eventos filtrados:", filteredEvents);
    
    filteredEvents.forEach(event => {
      if (!event.longitude || !event.latitude) return;
      
      let markerColor = '#9b87f5';
      
      if (event.art_types && event.art_types.length > 0) {
        const firstTypeId = Object.entries(artTypeMapping).find(
          ([_, value]) => value === event.art_types[0]
        )?.[0];
        
        if (firstTypeId && markerColors[firstTypeId as ArtTypeId]) {
          markerColor = markerColors[firstTypeId as ArtTypeId];
        }
      }
      
      const el = document.createElement('div');
      el.className = 'event-marker';
      el.style.width = '24px';
      el.style.height = '24px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = markerColor;
      el.style.border = '2px solid white';
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
      
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <div style="padding: 10px;">
            <h3 style="margin: 0 0 5px; font-weight: bold;">${event.title}</h3>
            <p style="margin: 0 0 8px;">${event.description?.substring(0, 100)}${event.description?.length > 100 ? '...' : ''}</p>
            <a href="/events/${event.id}" target="_blank" style="color: #9b87f5; text-decoration: none; font-weight: bold;">Ver detalles</a>
          </div>
        `);
      
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
