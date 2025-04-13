
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// Clave de API de Mapbox (deberías usar variables de entorno en producción)
mapboxgl.accessToken = "pk.eyJ1Ijoic2Vla2FydCIsImEiOiJjbHZ1d2NjNnMwMjBqMnFvOHdlN2pveTJnIn0.TvqofDuT4kJH6G0G4V1Uwg";

type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  address: string;
  latitude: number;
  longitude: number;
  image_url: string;
  artist_id: string;
  artist_name?: string;
};

const EventMap = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [radius, setRadius] = useState<number>(50); // Radio en km
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const { toast } = useToast();

  // Obtener ubicación del usuario
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          setUserLocation([longitude, latitude]);
        },
        (error) => {
          console.error(error);
          toast({
            variant: "destructive",
            title: "Error de ubicación",
            description: "No se pudo obtener tu ubicación actual. Se usará una ubicación predeterminada.",
          });
          
          // Ubicación predeterminada: Ciudad de México
          setUserLocation([-99.1332, 19.4326]);
        }
      );
    }
  }, [toast]);

  // Cargar eventos en el radio seleccionado
  useEffect(() => {
    const fetchEvents = async () => {
      if (!userLocation) return;

      try {
        // En una aplicación real, usarías PostGIS para filtrar por distancia
        // Aquí simplemente cargamos todos los eventos y luego filtramos en el cliente
        const { data, error } = await supabase
          .from("events")
          .select(`
            *,
            artists(name)
          `);

        if (error) throw error;

        if (data) {
          // Transformar datos y filtrar por distancia
          const transformedData = data.map((event) => ({
            ...event,
            artist_name: event.artists?.name || "Artista desconocido",
          }));

          // Filtrar eventos dentro del radio seleccionado
          const filteredEvents = transformedData.filter((event) => {
            const distance = getDistanceFromLatLonInKm(
              userLocation[1],
              userLocation[0],
              event.latitude,
              event.longitude
            );
            return distance <= radius;
          });

          setEvents(filteredEvents);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudieron cargar los eventos. Inténtalo de nuevo más tarde.",
        });
      }
    };

    fetchEvents();
  }, [userLocation, radius, toast]);

  // Inicializar mapa
  useEffect(() => {
    if (!mapContainer.current || !userLocation) return;

    if (map.current) return; // Evitar múltiples inicializaciones

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: userLocation,
      zoom: 10,
    });

    // Controles de navegación
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Mostrar ubicación del usuario
    const userMarker = new mapboxgl.Marker({ color: "#9b87f5" })
      .setLngLat(userLocation)
      .setPopup(new mapboxgl.Popup().setHTML("<h3>Tu ubicación</h3>"))
      .addTo(map.current);

    // Mostrar radio en el mapa
    map.current.on("load", () => {
      if (!map.current) return;

      map.current.addSource("radius", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: userLocation,
          },
          properties: {},
        },
      });

      map.current.addLayer({
        id: "radius-circle",
        type: "circle",
        source: "radius",
        paint: {
          "circle-radius": {
            stops: [
              [0, 0],
              [20, getPixelRadius(radius, userLocation[1], 10)],
            ],
          },
          "circle-color": "#9b87f5",
          "circle-opacity": 0.2,
          "circle-stroke-color": "#6E59A5",
          "circle-stroke-width": 1,
        },
      });
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [userLocation]);

  // Actualizar círculo de radio cuando cambia el valor
  useEffect(() => {
    if (!map.current || !userLocation || !map.current.getSource("radius")) return;

    // Actualizar radio en el mapa
    map.current.setPaintProperty("radius-circle", "circle-radius", {
      stops: [
        [0, 0],
        [20, getPixelRadius(radius, userLocation[1], map.current.getZoom())],
      ],
    });
  }, [radius, userLocation]);

  // Actualizar marcadores de eventos
  useEffect(() => {
    if (!map.current || !events.length) return;

    // Limpiar marcadores existentes
    const markers = document.getElementsByClassName("event-marker");
    while (markers[0]) {
      markers[0].remove();
    }

    // Añadir nuevos marcadores para cada evento
    events.forEach((event) => {
      const markerElement = document.createElement("div");
      markerElement.className = "event-marker";
      markerElement.style.width = "30px";
      markerElement.style.height = "40px";
      markerElement.innerHTML = `<svg viewBox="0 0 24 24" width="30" height="40" fill="#6E59A5"><path d="M12 0c-5.522 0-10 4.395-10 9.815 0 5.505 4.375 9.268 10 14.185 5.625-4.917 10-8.68 10-14.185 0-5.42-4.478-9.815-10-9.815zm0 14c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z"/></svg>`;

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div class="p-2">
          <h3 class="font-bold">${event.title}</h3>
          <p class="text-sm">${format(new Date(event.date), "dd/MM/yyyy HH:mm")}</p>
          <p class="text-sm">${event.artist_name}</p>
          <button class="text-[#9b87f5] text-sm mt-2 view-event" data-id="${event.id}">Ver detalles</button>
        </div>
      `);

      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat([event.longitude, event.latitude])
        .setPopup(popup)
        .addTo(map.current!);

      // Manejar clic en el botón "Ver detalles" dentro del popup
      popup.on("open", () => {
        const button = document.querySelector(`.view-event[data-id="${event.id}"]`);
        if (button) {
          button.addEventListener("click", () => {
            setSelectedEvent(event);
          });
        }
      });
    });
  }, [events]);

  // Funciones de utilidad
  const getDistanceFromLatLonInKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radio de la Tierra en km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180);
  };

  const getPixelRadius = (radiusKm: number, latitude: number, zoom: number) => {
    // Fórmula para convertir km a píxeles según el zoom y latitud
    const earthCircumference = 40075; // Circunferencia de la Tierra en km
    const latitudeRadians = latitude * (Math.PI / 180);
    const metersPerPixel = (earthCircumference * Math.cos(latitudeRadians)) / (Math.pow(2, zoom + 8));
    return (radiusKm * 1000) / metersPerPixel;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Mapa de Eventos</h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                <div 
                  ref={mapContainer} 
                  className="h-[600px] w-full rounded-md" 
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ajustes del mapa</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Radio de búsqueda: {radius} km
                    </label>
                    <Slider
                      value={[radius]}
                      min={5}
                      max={100}
                      step={5}
                      onValueChange={(value) => setRadius(value[0])}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {selectedEvent && (
              <Card>
                <CardHeader>
                  <CardTitle>{selectedEvent.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <img
                      src={selectedEvent.image_url}
                      alt={selectedEvent.title}
                      className="aspect-video w-full rounded-md object-cover"
                    />
                    <p className="text-sm text-gray-700">{selectedEvent.description}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Calendar size={16} />
                      <span>{format(new Date(selectedEvent.date), "dd/MM/yyyy HH:mm")}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <MapPin size={16} />
                      <span>{selectedEvent.address}</span>
                    </div>
                    <div className="text-sm font-medium">
                      Por: {selectedEvent.artist_name}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {events.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Eventos cercanos ({events.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {events.slice(0, 5).map((event) => (
                      <div 
                        key={event.id} 
                        className="flex cursor-pointer items-start space-x-4 rounded-md p-2 hover:bg-gray-50"
                        onClick={() => setSelectedEvent(event)}
                      >
                        <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md">
                          <img 
                            src={event.image_url} 
                            alt={event.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">{event.title}</h3>
                          <p className="text-xs text-gray-500">
                            {format(new Date(event.date), "dd/MM/yyyy")}
                          </p>
                          <p className="text-xs text-gray-500">
                            {event.artist_name}
                          </p>
                        </div>
                      </div>
                    ))}
                    {events.length > 5 && (
                      <p className="text-center text-sm text-gray-500">
                        Mostrando 5 de {events.length} eventos
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500">
                    No se encontraron eventos en el radio seleccionado.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventMap;
