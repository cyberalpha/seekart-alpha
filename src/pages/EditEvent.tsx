
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { useToast } from "@/components/ui/use-toast";
import { EventForm } from "@/components/events/EventForm";
import type { EventFormData } from "@/types/event";

type EventData = {
  id: string;
  title: string;
  description: string | null;
  date: string;
  address: string | null;
  city: string | null;
  cross_streets: string | null;
  locality: string | null;
  type: string;
  art_types?: string[];
  ticket_url: string | null;
  video_url: string | null;
  image_url: string;
  latitude: number;
  longitude: number;
  artist_id: string;
  created_at: string;
};

const EditEvent = () => {
  const { eventId } = useParams();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [eventData, setEventData] = useState<EventData | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

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
        
        const eventData = data as EventData;
        
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

  const handleSubmit = async (formData: EventFormData) => {
    try {
      setLoading(true);
      
      if (!formData.image_url) {
        toast({
          variant: "destructive",
          title: "Imagen requerida",
          description: "Debes subir una imagen para el evento.",
        });
        return;
      }
      
      if (formData.art_types.length === 0) {
        toast({
          variant: "destructive",
          title: "Tipo de arte requerido",
          description: "Debes seleccionar al menos un tipo de arte para el evento.",
        });
        return;
      }
      
      if (!formData.latitude || !formData.longitude) {
        toast({
          variant: "destructive",
          title: "Ubicación requerida",
          description: "Debes proporcionar la latitud y longitud del evento.",
        });
        return;
      }
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }
      
      const updatedEventData = {
        ...formData,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
      };
      
      const { error } = await supabase
        .from("events")
        .update(updatedEventData)
        .eq("id", eventId);
      
      if (error) throw error;
      
      toast({
        title: "Evento actualizado",
        description: "Tu evento ha sido actualizado correctamente.",
      });
      
      navigate("/artist-profile");
    } catch (error) {
      console.error("Error updating event:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo actualizar el evento. Inténtalo de nuevo más tarde.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
      
      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `event-images/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from("events")
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (uploadError) throw uploadError;
      
      const { data: urlData } = supabase.storage
        .from("events")
        .getPublicUrl(filePath);
      
      return urlData.publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo subir la imagen. Inténtalo de nuevo más tarde.",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

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

  // Convert numeric latitude and longitude to strings for the form
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
          loading={loading}
          uploading={uploading}
        />
      </div>
    </div>
  );
};

export default EditEvent;
