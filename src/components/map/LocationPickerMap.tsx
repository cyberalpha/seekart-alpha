
import { useEffect, useRef, useState } from "react";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Loader2 } from "lucide-react";
import { MAPBOX_PUBLIC_TOKEN } from '@/config/tokens';

interface LocationPickerMapProps {
  latitude?: string;
  longitude?: string;
  onLocationChange?: (lat: string, lng: string) => void;
}

export const LocationPickerMap = ({ 
  latitude = "19.4326",
  longitude = "-99.1332",
  onLocationChange 
}: LocationPickerMapProps) => {
  const [loading, setLoading] = useState(true);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);

  // Inicializar el mapa cuando el componente se monta
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    try {
      mapboxgl.accessToken = MAPBOX_PUBLIC_TOKEN;
      
      const initialLng = parseFloat(longitude) || 0;
      const initialLat = parseFloat(latitude) || 0;
      
      const newMap = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [initialLng, initialLat],
        zoom: initialLat === 0 && initialLng === 0 ? 1 : 12,
      });

      newMap.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      map.current = newMap;

      // Crear un marcador arrastrable
      marker.current = new mapboxgl.Marker({ 
        draggable: true,
        color: '#3498db'
      })
        .setLngLat([initialLng, initialLat])
        .addTo(newMap);

      // Actualizar coordenadas cuando se arrastra el marcador
      marker.current.on('dragend', () => {
        const lngLat = marker.current?.getLngLat();
        if (lngLat && onLocationChange) {
          onLocationChange(lngLat.lat.toString(), lngLat.lng.toString());
        }
      });

      // Handler para clicks en el mapa
      newMap.on('click', (e) => {
        if (marker.current) {
          const { lng, lat } = e.lngLat;
          marker.current.setLngLat([lng, lat]);
          if (onLocationChange) {
            onLocationChange(lat.toString(), lng.toString());
          }
        }
      });

      newMap.on('load', () => {
        setLoading(false);
        console.log("Mapa cargado correctamente");
      });

      return () => {
        console.log("Limpiando componente de mapa");
        newMap.remove();
        map.current = null;
      };
    } catch (error) {
      console.error('Error al inicializar el mapa:', error);
      setLoading(false);
    }
  }, []);

  // Actualizar el mapa cuando cambian las coordenadas
  useEffect(() => {
    if (map.current && marker.current) {
      const newLng = parseFloat(longitude) || 0;
      const newLat = parseFloat(latitude) || 0;
      
      // Evitar actualizar el mapa si las coordenadas son cero (valores por defecto)
      if (newLat === 0 && newLng === 0) return;
      
      marker.current.setLngLat([newLng, newLat]);
      
      // Animar el vuelo hacia la nueva posición
      map.current.flyTo({
        center: [newLng, newLat],
        zoom: 14,
        duration: 1500,
        essential: true
      });

      console.log("Mapa actualizado a:", newLat, newLng);
    }
  }, [latitude, longitude]);

  return (
    <div className="relative w-full h-[300px] rounded-lg overflow-hidden border border-gray-200 shadow-sm">
      <div 
        ref={mapContainer} 
        className="w-full h-full rounded-lg cursor-pointer"
        style={{ background: "#f0f0f0" }}
      />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80">
          <div className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-[#3498db]" />
            <p className="text-sm font-medium text-gray-700">
              Cargando mapa...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
