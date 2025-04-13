
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Map as MapIcon } from "lucide-react";
import type { Event } from "@/integrations/supabase/client";

const EventMap = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('events')
          .select('*, artists(name, profile_image)');
        
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
        <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <h1 className="text-3xl font-bold text-gray-900">Mapa de Eventos</h1>
          
          <div className="relative flex w-full max-w-md items-center">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Buscar eventos por nombre, ubicación o artista"
              className="pl-10"
            />
          </div>
        </div>
        
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex h-[70vh] items-center justify-center bg-gray-100">
              <div className="text-center">
                <MapIcon size={48} className="mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900">Mapa en construcción</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Próximamente podrás ver los eventos en un mapa interactivo
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <p className="col-span-full text-center">Cargando eventos...</p>
          ) : events.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">
              No hay eventos disponibles en este momento.
            </p>
          ) : (
            events.map((event) => (
              <Card key={event.id} className="overflow-hidden">
                <div className="relative aspect-video">
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="mb-2 text-lg font-bold">{event.title}</h3>
                  <p className="mb-2 text-sm text-gray-600">
                    {new Date(event.date).toLocaleDateString()}
                  </p>
                  <Button className="w-full">Ver detalles</Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default EventMap;
