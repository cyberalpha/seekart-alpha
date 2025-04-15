import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import type { Event } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('events')
          .select('*, artists(name, profile_image)')
          .order('date');
        
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
  }, [toast]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Navbar />
      
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Explorar Eventos</h1>
        
        {loading ? (
          <p className="text-center">Cargando eventos...</p>
        ) : events.length === 0 ? (
          <p className="text-center text-gray-500">
            No hay eventos disponibles en este momento.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
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
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
