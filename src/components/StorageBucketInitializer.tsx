
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

const StorageBucketInitializer = () => {
  const [initialized, setInitialized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkBuckets = async () => {
      try {
        // Verificar qué buckets existen
        const { data: buckets, error } = await supabase.storage.listBuckets();
        
        if (error) {
          console.error("Error listando buckets:", error);
          toast({
            title: "Error al verificar almacenamiento",
            description: "No se pudieron verificar los buckets de almacenamiento",
            variant: "destructive"
          });
          return;
        }
        
        const existingBuckets = new Set(buckets.map(bucket => bucket.name));
        let bucketsCreated = false;
        
        // Solo intentar crear el bucket si no existe
        if (!existingBuckets.has("profiles")) {
          try {
            const { error: profilesError } = await supabase.storage.createBucket("profiles", {
              public: true,
              fileSizeLimit: 5242880 // 5MB
            });
            
            if (profilesError) {
              console.error("Error creando bucket de perfiles:", profilesError);
              // No mostrar error al usuario, ya que podría ser por permisos RLS
            } else {
              console.log("Bucket de perfiles creado exitosamente");
              bucketsCreated = true;
            }
          } catch (err) {
            console.error("Error al crear bucket de perfiles:", err);
            // Error silencioso para el usuario final
          }
        } else {
          console.log("El bucket de perfiles ya existe");
        }
        
        // Solo intentar crear el bucket si no existe
        if (!existingBuckets.has("events")) {
          try {
            const { error: eventsError } = await supabase.storage.createBucket("events", {
              public: true,
              fileSizeLimit: 10485760 // 10MB
            });
            
            if (eventsError) {
              console.error("Error creando bucket de eventos:", eventsError);
              // No mostrar error al usuario
            } else {
              console.log("Bucket de eventos creado exitosamente");
              bucketsCreated = true;
            }
          } catch (err) {
            console.error("Error al crear bucket de eventos:", err);
            // Error silencioso para el usuario final
          }
        } else {
          console.log("El bucket de eventos ya existe");
        }
        
        if (bucketsCreated) {
          toast({
            title: "Almacenamiento configurado",
            description: "Los buckets de almacenamiento han sido configurados correctamente",
            variant: "default"
          });
        }
        
        setInitialized(true);
      } catch (err) {
        console.error("Error inicializando buckets:", err);
      } finally {
        setIsChecking(false);
      }
    };

    if (!initialized && isChecking) {
      checkBuckets();
    }
  }, [initialized, isChecking]);

  // Este componente no renderiza nada, solo inicializa los buckets
  return null;
};

export default StorageBucketInitializer;
