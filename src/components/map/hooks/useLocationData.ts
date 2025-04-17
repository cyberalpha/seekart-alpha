
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";
import { MapEvent } from '../types';

export const useLocationData = () => {
  const { toast } = useToast();
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [events, setEvents] = useState<MapEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Efecto para obtener la ubicación del usuario
  useEffect(() => {
    const getUserLocation = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        toast({
          title: "Error",
          description: "Debes iniciar sesión para ver el mapa de eventos",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const { data: userData, error } = await supabase
        .from('profiles')
        .select('latitude, longitude')
        .eq('id', session.user.id)
        .single();

      if (error || !userData?.latitude || !userData?.longitude) {
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const newLocation: [number, number] = [position.coords.longitude, position.coords.latitude];
              setUserLocation(newLocation);
              
              await supabase
                .from('profiles')
                .update({
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                })
                .eq('id', session.user.id);
                
              await fetchEvents(newLocation);
            },
            () => {
              toast({
                title: "Error",
                description: "No se pudo obtener tu ubicación",
                variant: "destructive",
              });
              setIsLoading(false);
            }
          );
        } else {
          setIsLoading(false);
        }
      } else {
        const location: [number, number] = [userData.longitude, userData.latitude];
        setUserLocation(location);
        await fetchEvents(location);
      }
    };

    getUserLocation();
  }, [toast]);

  // Función para cargar eventos cercanos
  const fetchEvents = async (location?: [number, number]) => {
    const userLoc = location || userLocation;
    if (!userLoc) {
      setIsLoading(false);
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*');
      
      if (error) {
        throw error;
      }
      
      console.log("Eventos obtenidos:", data);
      setEvents(data || []);
    } catch (error) {
      console.error("Error al obtener eventos:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los eventos cercanos",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { userLocation, events, isLoading };
};
