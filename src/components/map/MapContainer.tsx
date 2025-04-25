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

      const el = document.createElement('div');
      el.className = 'location-marker';
      el.style.backgroundImage = 'url("data:image/svg+xml;charset=utf-8,%3Csvg width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M12 0C7.58 0 4 3.58 4 8c0 5.25 8 13 8 13s8-7.75 8-13c0-4.42-3.58-8-8-8zm0 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z\' fill=\'%23000000\'/%3E%3C/svg%3E")';
      el.style.width = '24px';
      el.style.height = '24px';
      el.style.backgroundSize = 'cover';

      userMarker.current = new mapboxgl.Marker({ element: el })
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
    
    filteredEvents.forEach(event => {
      if (!event.longitude || !event.latitude) return;
      
      let markerColor = '#000000';
      
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
      el.style.backgroundImage = `url("data:image/svg+xml;charset=utf-8,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 0C7.58 0 4 3.58 4 8c0 5.25 8 13 8 13s8-7.75 8-13c0-4.42-3.58-8-8-8zm0 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z' fill='${encodeURIComponent(markerColor)}'/%3E%3C/svg%3E")`;
      el.style.width = '24px';
      el.style.height = '24px';
      el.style.backgroundSize = 'cover';
      el.style.cursor = 'pointer';
      
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <div style="padding: 10px;">
            <h3 style="margin: 0 0 5px; font-weight: bold;">${event.title}</h3>
            <p style="margin: 0 0 8px;">${event.description?.substring(0, 100)}${event.description?.length > 100 ? '...' : ''}</p>
            <a href="/events/${event.id}" target="_blank" style="color: ${markerColor}; text-decoration: none; font-weight: bold;">Ver detalles</a>
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
