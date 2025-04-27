import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { SocialShare } from "@/components/social/SocialShare";
import { EventType } from "@/types/event";
import { Plus } from "lucide-react";
import { EventFilters } from "@/components/map/EventFilters";
import { artTypes } from "@/components/map/data";
import { ArtTypeId } from "@/components/map/types";

const Events = () => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isArtist, setIsArtist] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<ArtTypeId[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserType = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setIsArtist(session.user.user_metadata?.user_type === 'artist');
      }
    };

    checkUserType();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        let query = supabase
          .from('events')
          .select('*, artists(name, profile_image)')
          .order('date');
        
        if (selectedTypes.length > 0) {
          query = query.contains('art_types', selectedTypes);
        }
        
        const { data, error } = await query;
        
        if (error) {
          throw error;
        }
        
        setEvents(data || []);
      } catch (error) {
        console.error("Error fetching events:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudieron cargar los eventos. Inténtalo de nuevo más tarde.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [toast, selectedTypes]);

  const renderArtistCard = (event: EventType) => (
    <Card key={event.id} className="overflow-hidden">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={event.image_url}
          alt={event.title}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      
      <CardContent className="p-4">
        <h3 className="mb-2 text-xl font-bold">{event.title}</h3>
        
        <p className="mb-2 text-sm text-gray-600">
          {format(new Date(event.date), "dd/MM/yyyy HH:mm")}
        </p>
        
        <div className="mb-3 flex flex-wrap gap-2">
          {event.art_types && event.art_types.map((type, index) => {
            let color = "";
            switch (type) {
              case "musica": color = "bg-[#2ecc71] text-white"; break;
              case "teatro": color = "bg-[#f1c40f] text-white"; break;
              case "imagenes": color = "bg-[#e74c3c] text-white"; break;
              case "letras": color = "bg-[#3498db] text-white"; break;
              case "cine": color = "bg-[#e67e22] text-white"; break;
              default: color = "bg-[#9b59b6] text-white";
            }
            
            const typeName = {
              "musica": "Música",
              "teatro": "Teatro",
              "imagenes": "Imágenes y formas",
              "letras": "Letras",
              "cine": "Cine",
              "otro": "Otro"
            }[type] || type;
            
            return (
              <Badge key={index} className={color}>
                {typeName}
              </Badge>
            );
          })}
        </div>
        
        <p className="mb-4 line-clamp-2 text-sm text-gray-600">
          {event.description}
        </p>
        
        <Button 
          className="w-full"
          onClick={() => navigate(`/events/${event.id}`)}
        >
          Ver detalles
        </Button>
        
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {event.follower_count || 0} seguidores
          </div>
          
          <SocialShare
            url={`${window.location.origin}/events/${event.id}`}
            title={event.title}
          />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Navbar />
      
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Explorar Eventos</h1>
          
          {isArtist && (
            <Button
              onClick={() => navigate("/create-event")}
              className="bg-gradient-to-r from-[#2ecc71] to-[#3498db] hover:from-[#27ae60] hover:to-[#2980b9]"
            >
              <Plus className="mr-2 h-4 w-4" />
              Crear Evento
            </Button>
          )}
        </div>

        <div className="mb-6">
          <EventFilters
            selectedTypes={selectedTypes}
            setSelectedTypes={setSelectedTypes}
            artTypes={artTypes}
          />
        </div>
        
        {loading ? (
          <p className="text-center">Cargando eventos...</p>
        ) : events.length === 0 ? (
          <p className="text-center text-gray-500">
            No hay eventos disponibles en este momento.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => renderArtistCard(event))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
