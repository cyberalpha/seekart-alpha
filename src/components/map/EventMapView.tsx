
import { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { 
  Music, 
  Theater, 
  Image as ImageIcon, 
  BookText, 
  Film, 
  Sparkles,
  Loader2
} from "lucide-react";

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
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const userMarker = useRef<mapboxgl.Marker | null>(null);
  const radiusCircle = useRef<mapboxgl.GeoJSONSource | null>(null);

  // Obtener la ubicación del usuario autenticado
  useEffect(() => {
    const getUserLocation = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        toast({
          title: "Error",
          description: "Debes iniciar sesión para ver el mapa de eventos",
          variant: "destructive",
        });
        return;
      }

      // Obtener la ubicación del usuario desde la base de datos
      const { data: userData, error } = await supabase
        .from('profiles')
        .select('latitude, longitude')
        .eq('id', session.user.id)
        .single();

      if (error || !userData?.latitude || !userData?.longitude) {
        // Si no hay ubicación guardada, intentar obtener la ubicación actual
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const newLocation: [number, number] = [position.coords.longitude, position.coords.latitude];
              setUserLocation(newLocation);
              
              // Guardar la ubicación en la base de datos
              await supabase
                .from('profiles')
                .update({
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                })
                .eq('id', session.user.id);
            },
            () => {
              toast({
                title: "Error",
                description: "No se pudo obtener tu ubicación",
                variant: "destructive",
              });
            }
          );
        }
      } else {
        setUserLocation([userData.longitude, userData.latitude]);
      }
    };

    getUserLocation();
  }, [toast]);

  // Inicializar el mapa
  useEffect(() => {
    if (!mapToken || !mapContainer.current || !userLocation || map.current) return;
    
    try {
      mapboxgl.accessToken = mapToken;
      
      const newMap = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: userLocation,
        zoom: 12,
      });

      newMap.addControl(new mapboxgl.NavigationControl(), 'top-right');
      map.current = newMap;

      // Agregar marcador de ubicación del usuario
      userMarker.current = new mapboxgl.Marker({
        color: '#9b87f5',
      })
        .setLngLat(userLocation)
        .addTo(newMap);

      // Agregar círculo de radio de búsqueda
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
      });
      
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
  }, [mapToken, userLocation, toast, radius]);

  // Actualizar círculo de radio cuando cambie el radio
  useEffect(() => {
    if (!map.current || !userLocation || !radiusCircle.current) return;
    radiusCircle.current.setData(createGeoJSONCircle(userLocation, radius[0]));
  }, [radius, userLocation]);

  const createGeoJSONCircle = (center: [number, number], radiusInKm: number) => {
    const points = 64;
    const km = radiusInKm;
    const ret = [];
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
    };
  };

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

  // Cargar token desde localStorage
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
        <div className="bg-seekart-blue/5 border border-seekart-blue/20 p-6 rounded-lg mb-4">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Configuración del Mapa</h3>
          <p className="text-sm text-gray-600 mb-4">
            Para visualizar el mapa, necesitas proporcionar un token de acceso de Mapbox.
            Puedes obtener uno gratuitamente en {" "}
            <a 
              href="https://mapbox.com/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-seekart-blue hover:underline"
            >
              mapbox.com
            </a>
          </p>
          <div className="flex gap-2">
            <Input
              placeholder="Ingresa tu token de acceso de Mapbox"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleSetToken}
              className="bg-seekart-blue hover:bg-seekart-blue/90"
            >
              Guardar
            </Button>
          </div>
        </div>
      )}
      
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
                  {mapToken ? "Iniciando mapa..." : "Ingresa un token de Mapbox para ver el mapa"}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-lg border border-seekart-purple/10">
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
                    selectedTypes.includes(type.id) ? 'selected' : ''
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
