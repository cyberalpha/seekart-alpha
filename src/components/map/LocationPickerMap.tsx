
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
  const [selectionMode, setSelectionMode] = useState(false);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);

  // Update map when coordinates change
  useEffect(() => {
    if (map.current && marker.current) {
      const newLng = parseFloat(longitude);
      const newLat = parseFloat(latitude);
      
      marker.current.setLngLat([newLng, newLat]);
      map.current.flyTo({
        center: [newLng, newLat],
        zoom: 15,
        duration: 2000
      });
    }
  }, [latitude, longitude]);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    try {
      mapboxgl.accessToken = MAPBOX_PUBLIC_TOKEN;
      
      const newMap = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [parseFloat(longitude), parseFloat(latitude)],
        zoom: 15,
      });

      newMap.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      map.current = newMap;

      // Create a draggable marker
      marker.current = new mapboxgl.Marker({ draggable: true })
        .setLngLat([parseFloat(longitude), parseFloat(latitude)])
        .addTo(newMap);

      // Update coordinates when marker is dragged
      marker.current.on('dragend', () => {
        const lngLat = marker.current?.getLngLat();
        if (lngLat && onLocationChange) {
          onLocationChange(lngLat.lat.toString(), lngLat.lng.toString());
        }
      });

      // Add click handler for map
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
      });

      return () => {
        newMap.remove();
        map.current = null;
      };
    } catch (error) {
      console.error('Error initializing map:', error);
      setLoading(false);
    }
  }, [latitude, longitude, onLocationChange]);

  return (
    <div className="relative w-full h-[300px] rounded-lg overflow-hidden">
      <div 
        ref={mapContainer} 
        className="w-full h-full rounded-lg cursor-pointer"
      />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80">
          <div className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-[#9b87f5]" />
            <p className="text-sm font-medium text-gray-700">
              Cargando mapa...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
