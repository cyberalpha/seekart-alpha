
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const StorageBucketInitializer = () => {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initializeBuckets = async () => {
      try {
        // Verificar qué buckets existen
        const { data: buckets, error } = await supabase.storage.listBuckets();
        
        if (error) {
          console.error("Error listando buckets:", error);
          return;
        }
        
        const existingBuckets = buckets.map(bucket => bucket.name);
        
        // Crear bucket de perfiles si no existe
        if (!existingBuckets.includes("profiles")) {
          const { error: profilesError } = await supabase.storage.createBucket("profiles", {
            public: true,
            fileSizeLimit: 5242880 // 5MB
          });
          
          if (profilesError) {
            console.error("Error creando bucket de perfiles:", profilesError);
          }
        }
        
        // Crear bucket de eventos si no existe
        if (!existingBuckets.includes("events")) {
          const { error: eventsError } = await supabase.storage.createBucket("events", {
            public: true,
            fileSizeLimit: 10485760 // 10MB
          });
          
          if (eventsError) {
            console.error("Error creando bucket de eventos:", eventsError);
          }
        }
        
        setInitialized(true);
      } catch (err) {
        console.error("Error inicializando buckets:", err);
      }
    };

    if (!initialized) {
      initializeBuckets();
    }
  }, [initialized]);

  // Este componente no renderiza nada, solo inicializa los buckets
  return null;
};

export default StorageBucketInitializer;
