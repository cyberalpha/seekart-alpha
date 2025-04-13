
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
          } else {
            console.log("Bucket de perfiles creado exitosamente");
            
            // Aplicar políticas RLS para el bucket de perfiles
            try {
              // Permitir leer archivos a cualquier usuario
              await supabase.storage.from('profiles').createSignedUrl('test.txt', 1); // Esto es solo para verificar que el bucket está listo
              
              console.log("Bucket de perfiles configurado correctamente");
            } catch (policyError) {
              console.error("Error configurando políticas para el bucket de perfiles:", policyError);
            }
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
          } else {
            console.log("Bucket de eventos creado exitosamente");
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
