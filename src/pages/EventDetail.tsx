import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Link, Video, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { artTypes } from "./ArtistProfile";
import { SocialShare } from "@/components/social/SocialShare";
import MetaTags from "@/components/shared/MetaTags";

const EventDetail = () => {
  const {
    eventId
  } = useParams();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const {
          data,
          error
        } = await supabase.from('events').select('*, artists(*)').eq('id', eventId).single();
        if (error) throw error;
        setEvent(data);
      } catch (error) {
        console.error('Error fetching event:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);
  if (loading) {
    return <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <p>Cargando evento...</p>
        </div>
      </div>;
  }
  if (!event) {
    return <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <p>Evento no encontrado</p>
        </div>
      </div>;
  }
  // URL y título para compartir
  const shareUrl = window.location.href;
  const shareTitle = event.title;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <MetaTags 
        title={`${event.title} - SeekArt`}
        description={event.description ? event.description.substring(0, 160) : "Evento de SeekArt"}
        imageUrl={event.image_url}
        type="article"
      />
      <Navbar />
      
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
          <p className="mt-2 text-gray-600">
            Por {event.artists?.name}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-8">
            <Card>
              <div className="aspect-video w-full overflow-hidden">
                <img src={event.image_url} alt={event.title} className="h-full w-full object-cover" />
              </div>
              
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold">Descripción</h2>
                    <p className="mt-2 text-gray-600">{event.description}</p>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold">Tipos de evento</h2>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {event.art_types?.map((typeId: string) => {
                      const type = artTypes.find(t => t.id === typeId);
                      return type ? <Badge key={type.id} className={type.color + ' text-white'}>
                            {type.name}
                          </Badge> : null;
                    })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-4 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Detalles del evento</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-start gap-2">
                  <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Fecha y hora</p>
                    <p className="text-sm text-gray-600">
                      {format(new Date(event.date), "dd/MM/yyyy HH:mm")}
                    </p>
                  </div>
                </div>

                {event.address && <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Ubicación</p>
                      <p className="text-sm text-gray-600">
                        {event.address}
                        {event.city && `, ${event.city}`}
                      </p>
                      {event.cross_streets && <p className="text-sm text-gray-600">
                          Entre calles: {event.cross_streets}
                        </p>}
                    </div>
                  </div>}

                {event.ticket_url && <Button variant="default" className="w-full" asChild>
                    <a href={event.ticket_url} target="_blank" rel="noopener noreferrer">
                      <Link className="mr-2 h-4 w-4" />
                      Comprar entradas
                    </a>
                  </Button>}

                {event.video_url && <Button variant="outline" className="w-full" asChild>
                    <a href={event.video_url} target="_blank" rel="noopener noreferrer">
                      <Video className="mr-2 h-4 w-4" />
                      Ver video
                    </a>
                  </Button>}
              </CardContent>
            </Card>
            
            {/* Add sharing options */}
            <Card>
              <CardHeader>
                <CardTitle>Compartir evento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <SocialShare url={shareUrl} title={shareTitle} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
