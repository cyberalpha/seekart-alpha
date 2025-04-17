
import { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { 
  Music, 
  Theater, 
  Image as ImageIcon, 
  BookText, 
  Film, 
  Sparkles
} from "lucide-react";

// Definimos los tipos de arte con sus respectivos colores e iconos
const artTypes = [
  { id: 'music', name: 'Música', color: 'seekart-green', icon: Music },
  { id: 'theater', name: 'Teatro', color: 'seekart-yellow', icon: Theater },
  { id: 'visual', name: 'Imágenes y formas', color: 'seekart-red', icon: ImageIcon },
  { id: 'literature', name: 'Letras', color: 'seekart-blue', icon: BookText },
  { id: 'cinema', name: 'Cine', color: 'seekart-orange', icon: Film },
  { id: 'other', name: 'Otros', color: 'seekart-purple', icon: Sparkles },
];

// Mapa de conversión de tipos de eventos para la base de datos
const artTypeMapping = {
  'music': 'musica',
  'theater': 'teatro',
  'visual': 'imagenes',
  'literature': 'letras',
  'cinema': 'cine',
  'other': 'otro'
};

// Mapa de colores para marcadores en el mapa
const markerColors = {
  'music': '#2CDD68', // Verde brillante (SeekArt)
  'theater': '#FEDD61', // Amarillo brillante (SeekArt)
  'visual': '#FE5D5D', // Rojo brillante (SeekArt)
  'literature': '#4192FE', // Azul brillante (SeekArt)
  'cinema': '#FF8A2C', // Naranja brillante (SeekArt)
  'other': '#AF59FF', // Púrpura brillante (SeekArt)
};

// Token de Mapbox (no lo almacenamos en el localStorage)
const MAPBOX_TOKEN = 'pk.eyJ1IjoiY3liZXJhbHBoYSIsImEiOiJjbTlqYzR3M2MwYXl4Mmtwd3FwOXpkemNtIn0.f1dR1NX50cVLJPY7ZzAuvQ';

export const EventMapView = () => {
  const { toast } = useToast();
  const [radius, setRadius] = useState([20]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const userMarker = useRef<mapboxgl.Marker | null>(null);
  const radiusCircle = useRef<mapboxgl.GeoJSONSource | null>(null);
  const eventMarkers = useRef<mapboxgl.Marker[]>([]);

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

      const { data: userData, error } = await supabase
        .from('profiles')
        .select('latitude, longitude')
        .eq('id', session.user.id)
        .single();

      if (error || !userData?.latitude || !userData?.longitude) {
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const newLocation: [number, number] = [position.coords.longitude, position.coords.latitude];
              setUserLocation(newLocation);
              
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

  // Efecto para cargar eventos cercanos
  useEffect(() => {
    const fetchEvents = async () => {
      if (!userLocation) return;
      
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*');
        
        if (error) {
          throw error;
        }
        
        console.log("Eventos obtenidos:", data);
        setEvents(data || []);
      } catch (error) {
        console.error("Error al obtener eventos:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los eventos cercanos",
          variant: "destructive",
        });
      }
    };

    fetchEvents();
  }, [userLocation, toast]);

  useEffect(() => {
    if (!mapContainer.current || !userLocation || map.current) return;
    
    try {
      mapboxgl.accessToken = MAPBOX_TOKEN;
      
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
      });
      
      return () => {
        newMap.remove();
        map.current = null;
      };
    } catch (error) {
      console.error('Error al inicializar el mapa:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar el mapa. Por favor, inténtalo de nuevo más tarde.",
        variant: "destructive",
      });
    }
  }, [userLocation, toast, radius]);

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

  // Función para actualizar los eventos visibles en el mapa
  const updateVisibleEvents = () => {
    // Limpiar marcadores anteriores
    eventMarkers.current.forEach(marker => marker.remove());
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
      
      return eventTypeIds.some(type => selectedTypes.includes(type));
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
        
        if (firstTypeId && markerColors[firstTypeId as keyof typeof markerColors]) {
          markerColor = markerColors[firstTypeId as keyof typeof markerColors];
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
      
      eventMarkers.current.push(marker);
    });
  };

  const createGeoJSONCircle = (center: [number, number], radiusInKm: number) => {
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
    } as GeoJSON.Feature<GeoJSON.Polygon>;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] gap-4">
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
      
      <div className="bg-white p-6 rounded-lg shadow-lg border border-seekart-purple/10">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Radio de búsqueda: {radius[0]} km
          </label>
          <Slider
            value={radius}
            onValueChange={(value) => {
              setRadius(value);
              console.log("Nuevo radio:", value[0]);
            }}
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
            onValueChange={(value) => {
              setSelectedTypes(value);
              console.log("Nuevos filtros:", value);
            }}
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

export default EventMapView;
