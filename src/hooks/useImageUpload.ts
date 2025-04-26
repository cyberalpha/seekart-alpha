
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        return null;
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

  return { handleImageUpload, uploading };
};
