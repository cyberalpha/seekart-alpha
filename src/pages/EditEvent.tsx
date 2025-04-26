
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { useToast } from "@/components/ui/use-toast";
import { EventForm } from "@/components/events/EventForm";
import { useEventSubmit } from "@/hooks/useEventSubmit";
import { useImageUpload } from "@/hooks/useImageUpload";
import { EventType, EventFormData } from "@/types/event";

const EditEvent = () => {
  const { eventId } = useParams();
  const [loading, setLoading] = useState(true);
  const [eventData, setEventData] = useState<EventType | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { handleSubmit, loading: submitLoading } = useEventSubmit(eventId);
  const { uploading } = useImageUpload();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate("/auth");
          return;
        }
        
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .eq("id", eventId)
          .single();
        
        if (error) throw error;
        
        const eventData = data as EventType;
        
        if (eventData.artist_id !== session.user.id) {
          navigate("/artist-profile");
          toast({
            variant: "destructive",
            title: "Acceso denegado",
            description: "No tienes permiso para editar este evento.",
          });
          return;
        }

        // Format date for datetime-local input
        const eventDate = new Date(eventData.date);
        eventData.date = eventDate.toISOString().slice(0, 16);
        
        setEventData(eventData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching event:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo cargar el evento. Inténtalo de nuevo más tarde.",
        });
        navigate("/artist-profile");
      }
    };

    fetchEvent();
  }, [eventId, navigate, toast]);

  if (loading || !eventData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
        <Navbar />
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-center">Cargando evento...</p>
        </div>
      </div>
    );
  }

  const formattedEventData: Partial<EventFormData> = {
    ...eventData,
    latitude: eventData.latitude.toString(),
    longitude: eventData.longitude.toString()
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Navbar />
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Editar Evento</h1>
        <EventForm
          initialData={formattedEventData}
          onSubmit={handleSubmit}
          submitButtonText="Guardar cambios"
          onCancel={() => navigate("/artist-profile")}
          loading={submitLoading}
          uploading={uploading}
        />
      </div>
    </div>
  );
};

export default EditEvent;
