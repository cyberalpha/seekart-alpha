
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
      
      const nullIfEmpty = (v: string) => (v && v.trim() !== "" ? v.trim() : null);
      const eventData = {
        ...formData,
        description: nullIfEmpty(formData.description),
        address: nullIfEmpty(formData.address),
        city: nullIfEmpty(formData.city),
        state: nullIfEmpty(formData.state),
        country: nullIfEmpty(formData.country),
        cross_street_1: nullIfEmpty(formData.cross_street_1),
        cross_street_2: nullIfEmpty(formData.cross_street_2),
        locality: nullIfEmpty(formData.locality),
        ticket_url: nullIfEmpty(formData.ticket_url),
        video_url: nullIfEmpty(formData.video_url),
        type: formData.art_types[0] || formData.type,
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
