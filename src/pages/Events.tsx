
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Search, Calendar, MapPin } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { artTypes } from "./ArtistProfile";

type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  address: string;
  city: string;
  type: string;
  art_types?: string[];
  image_url: string;
  artist_id: string;
  artist_name?: string;
};

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [eventType, setEventType] = useState<string>("all");
  const [city, setCity] = useState<string>("all");
  const [cities, setCities] = useState<string[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        
        // Fetch events with artist names
        const { data, error } = await supabase
          .from("events")
          .select(`
            *,
            artists(name)
          `)
          .gte('date', new Date().toISOString()) // Only future events
          .order('date', { ascending: true });
        
        if (error) throw error;
        
        if (data) {
          // Transform data
          const transformedEvents = data.map(event => ({
            ...event,
            artist_name: event.artists?.name || "Artista desconocido",
          }));
          
          setEvents(transformedEvents);
          setFilteredEvents(transformedEvents);
          
          // Extract unique cities
          const cities = [...new Set(transformedEvents.map(event => event.city))];
          setCities(cities);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching events:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudieron cargar los eventos. Inténtalo de nuevo más tarde.",
        });
        setLoading(false);
      }
    };

    fetchEvents();
  }, [toast]);

  useEffect(() => {
    // Apply filters
    let result = events;
    
    if (searchQuery) {
      result = result.filter(event => 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.artist_name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (eventType && eventType !== "all") {
      result = result.filter(event => 
        event.art_types?.includes(eventType) || event.type === eventType
      );
    }
    
    if (city && city !== "all") {
      result = result.filter(event => event.city === city);
    }
    
    setFilteredEvents(result);
  }, [searchQuery, eventType, city, events]);

  const handleEventClick = (event: Event) => {
    // For now, just display the event on the map
    navigate("/map", { state: { selectedEvent: event } });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setEventType("all");
    setCity("all");
  };

  // Función para obtener el tipo de arte y su color asociado
  const getArtTypeDetails = (typeId: string) => {
    const artType = artTypes.find(type => type.id === typeId);
    return artType || { id: typeId, name: typeId, color: "bg-gray-500" };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Navbar />
      
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">Explorar Eventos</h1>
        
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar eventos por título, descripción o artista"
              className="pl-10"
            />
          </div>
          
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="sm:w-1/3">
              <Select value={eventType} onValueChange={setEventType}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de evento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  {artTypes.map(type => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="sm:w-1/3">
              <Select value={city} onValueChange={setCity}>
                <SelectTrigger>
                  <SelectValue placeholder="Ciudad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las ciudades</SelectItem>
                  {cities.map(city => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex sm:w-1/3">
              <Button
                variant="outline"
                onClick={clearFilters}
                className="ml-auto"
              >
                Limpiar filtros
              </Button>
            </div>
          </div>
        </div>
        
        {loading ? (
          <p className="text-center">Cargando eventos...</p>
        ) : filteredEvents.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-gray-500">
                No se encontraron eventos que coincidan con tu búsqueda.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map(event => (
              <Card 
                key={event.id} 
                className="cursor-pointer overflow-hidden transition-shadow hover:shadow-md"
                onClick={() => handleEventClick(event)}
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                
                <CardContent className="p-4">
                  <h3 className="mb-1 text-xl font-bold line-clamp-1">{event.title}</h3>
                  
                  <p className="mb-2 text-sm font-medium text-[#6E59A5]">
                    Por: {event.artist_name}
                  </p>
                  
                  <div className="mb-2 flex items-center text-sm text-gray-500">
                    <Calendar size={16} className="mr-1 flex-shrink-0" />
                    <span>
                      {format(new Date(event.date), "EEEE d 'de' MMMM, HH:mm", { locale: es })}
                    </span>
                  </div>
                  
                  <div className="flex items-start text-sm text-gray-500">
                    <MapPin size={16} className="mr-1 mt-1 flex-shrink-0" />
                    <span>{event.address}, {event.city}</span>
                  </div>
                  
                  {event.art_types && event.art_types.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {event.art_types.map(typeId => {
                        const typeInfo = getArtTypeDetails(typeId);
                        return (
                          <Badge 
                            key={typeId}
                            className={`${typeInfo.color} text-white`}
                          >
                            {typeInfo.name}
                          </Badge>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="mt-3">
                      <Badge className="bg-gray-500 text-white">
                        {event.type}
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        <div className="mt-8 flex justify-center">
          <Button
            onClick={() => navigate("/map")}
            className="bg-gradient-to-r from-[#9b87f5] to-[#6E59A5] hover:from-[#8a76e4] hover:to-[#5d4894]"
          >
            Ver todos los eventos en el mapa
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Events;
