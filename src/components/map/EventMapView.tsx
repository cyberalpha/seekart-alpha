
import { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Music, 
  Theater, 
  Image as ImageIcon, 
  BookText, 
  Film, 
  Sparkles 
} from "lucide-react";

// Mapa de tipos de eventos a sus colores correspondientes en la paleta de SeekArt
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
  const [tokenInput, setTokenInput] = useState<string>('');
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  // Inicializar el mapa cuando el componente se monta o cuando cambia el token
  useEffect(() => {
    // Si no hay un token o un contenedor, no inicializar el mapa
    if (!mapToken || !mapContainer.current || map.current) return;
    
    try {
      mapboxgl.accessToken = mapToken;
      
      const newMap = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [-58.3816, -34.6037], // Buenos Aires
        zoom: 11,
      });

      newMap.addControl(new mapboxgl.NavigationControl(), 'top-right');
      map.current = newMap;
      
      // Limpiar el mapa cuando el componente se desmonta
      return () => {
        newMap.remove();
        map.current = null;
      };
    } catch (error) {
      console.error('Error al inicializar el mapa:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar el mapa. Por favor, verifica tu token de acceso.",
        variant: "destructive",
      });
    }
  }, [mapToken, toast]);

  // Actualizar marcadores cuando cambian los tipos seleccionados
  useEffect(() => {
    if (!map.current) return;
    
    // Aquí agregaríamos la lógica para actualizar marcadores según selectedTypes
    console.log('Tipos seleccionados:', selectedTypes);
    console.log('Radio de búsqueda:', radius[0]);
    
  }, [selectedTypes, radius]);

  const handleSetToken = () => {
    if (tokenInput.trim()) {
      setMapToken(tokenInput.trim());
      localStorage.setItem('mapbox_token', tokenInput.trim());
      toast({
        title: "Token guardado",
        description: "El token de Mapbox ha sido guardado y se utilizará para cargar el mapa.",
      });
    }
  };

  // Intentar cargar el token desde localStorage al inicio
  useEffect(() => {
    const savedToken = localStorage.getItem('mapbox_token');
    if (savedToken) {
      setMapToken(savedToken);
      setTokenInput(savedToken);
    }
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] gap-4">
      {!mapToken && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-4">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Configuración del Mapa</h3>
          <p className="text-sm text-gray-600 mb-4">
            Para visualizar el mapa, necesitas proporcionar un token de acceso de Mapbox.
            Puedes obtener uno gratuitamente en <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">mapbox.com</a>.
          </p>
          <div className="flex gap-2">
            <Input
              placeholder="Ingresa tu token de acceso de Mapbox"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSetToken}>Guardar</Button>
          </div>
        </div>
      )}
      
      <div className="flex-1 relative rounded-lg overflow-hidden shadow-lg bg-gradient-to-br from-slate-100 to-slate-200">
        <div 
          ref={mapContainer} 
          id="map" 
          className="w-full h-full rounded-lg"
        />
        {!map.current && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80">
            <div className="text-center">
              <p className="text-lg font-medium text-gray-700">
                {mapToken ? "Cargando mapa..." : "Ingresa un token de Mapbox para ver el mapa"}
              </p>
              <p className="text-sm text-gray-500">
                {mapToken && "Esto puede tomar unos momentos"}
              </p>
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
                  className={`event-type-button event-type-button-${type.id} ${
                    selectedTypes.includes(type.id)
                      ? `bg-${type.color} text-white border-${type.color}`
                      : ''
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
