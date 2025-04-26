
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { EventFormData } from "@/types/event";

export const useEventSubmit = (eventId?: string) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

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
      
      const eventData = {
        ...formData,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        artist_id: session.user.id,
      };
      
      const { error } = eventId 
        ? await supabase.from("events").update(eventData).eq("id", eventId)
        : await supabase.from("events").insert(eventData);
      
      if (error) throw error;
      
      toast({
        title: eventId ? "Evento actualizado" : "Evento creado",
        description: eventId 
          ? "Tu evento ha sido actualizado correctamente."
          : "Tu evento ha sido creado correctamente.",
      });
      
      navigate("/artist-profile");
    } catch (error) {
      console.error("Error submitting event:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo procesar el evento. Inténtalo de nuevo más tarde.",
      });
    } finally {
      setLoading(false);
    }
  };

  return { handleSubmit, loading };
};
