
import { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useToast } from "@/components/ui/use-toast";
import { 
  Music, 
  Theater, 
  Image as ImageIcon, 
  BookText, 
  Film, 
  Sparkles 
} from "lucide-react";

// Map of event types to their corresponding colors from the SeekArt palette
const artTypes = [
  { id: 'music', name: 'Música', color: 'seekart-green', icon: Music },
  { id: 'theater', name: 'Teatro', color: 'seekart-yellow', icon: Theater },
  { id: 'visual', name: 'Imágenes y formas', color: 'seekart-red', icon: ImageIcon },
  { id: 'literature', name: 'Letras', color: 'seekart-blue', icon: BookText },
  { id: 'cinema', name: 'Cine', color: 'seekart-orange', icon: Film },
  { id: 'other', name: 'Otros', color: 'seekart-purple', icon: Sparkles },
];

export const EventMapView = () => {
  const { toast } = useToast();
  const [radius, setRadius] = useState([20]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [mapToken, setMapToken] = useState<string>('');
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  // Initialize the map when the component mounts
  useEffect(() => {
    if (!mapContainer.current) return;
    
    try {
      mapboxgl.accessToken = 'pk.eyJ1IjoiZXhhbXBsZXVzZXIiLCJhIjoiY2xhbmRvbWFwaWQifQ.thisisaplaceholdertoken';
      
      const newMap = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [-58.3816, -34.6037], // Buenos Aires
        zoom: 11,
      });

      newMap.addControl(new mapboxgl.NavigationControl(), 'top-right');
      map.current = newMap;
      
      // Add event markers based on selected types
      return () => {
        newMap.remove();
      };
    } catch (error) {
      console.error('Error initializing map:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar el mapa. Por favor, inténtalo de nuevo más tarde.",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Update markers when selected types change
  useEffect(() => {
    if (!map.current) return;
    
    // Here we would add the logic to update markers based on selectedTypes
    console.log('Selected types:', selectedTypes);
    console.log('Search radius:', radius[0]);
    
  }, [selectedTypes, radius]);

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] gap-4">
      <div className="flex-1 relative rounded-lg overflow-hidden shadow-lg bg-gradient-to-br from-slate-100 to-slate-200">
        <div 
          ref={mapContainer} 
          id="map" 
          className="w-full h-full rounded-lg"
        />
        {!map.current && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80">
            <div className="text-center">
              <p className="text-lg font-medium text-gray-700">Cargando mapa...</p>
              <p className="text-sm text-gray-500">Esto puede tomar unos momentos</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Radio de búsqueda: {radius[0]} km
          </label>
          <Slider
            value={radius}
            onValueChange={setRadius}
            max={100}
            step={1}
            className="w-full"
          />
        </div>
        
        <div>
          <h3 className="font-medium text-gray-700 mb-3">Tipos de eventos</h3>
          <ToggleGroup 
            type="multiple" 
            variant="outline"
            value={selectedTypes}
            onValueChange={setSelectedTypes}
            className="flex flex-wrap gap-2"
          >
            {artTypes.map((type) => {
              const Icon = type.icon;
              return (
                <ToggleGroupItem 
                  key={type.id} 
                  value={type.id}
                  className={`transition-all flex items-center gap-2 ${
                    selectedTypes.includes(type.id)
                      ? `bg-${type.color} border-${type.color} text-white`
                      : `hover:bg-${type.color}/10 hover:border-${type.color}/30`
                  }`}
                  aria-label={type.name}
                >
                  <Icon className="h-4 w-4" />
                  <span>{type.name}</span>
                </ToggleGroupItem>
              );
            })}
          </ToggleGroup>
        </div>
      </div>
    </div>
  );
};
