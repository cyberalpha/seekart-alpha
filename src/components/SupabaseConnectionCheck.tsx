
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const SupabaseConnectionCheck = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  const checkConnection = async () => {
    try {
      // Simple query to check if we can connect to Supabase
      const { data, error } = await supabase.from('artists').select('id').limit(1);
      
      if (error) {
        throw error;
      }
      
      setIsConnected(true);
      toast({
        title: "Conexión exitosa",
        description: "La conexión a Supabase se estableció correctamente",
        variant: "default",
      });
    } catch (error) {
      console.error('Supabase connection error:', error);
      setIsConnected(false);
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar a Supabase",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <div className="mx-auto max-w-md rounded-md border p-6 shadow-md">
      <h2 className="mb-4 text-xl font-bold">Estado de la conexión a Supabase:</h2>
      
      {isConnected === null ? (
        <p>Verificando conexión...</p>
      ) : isConnected ? (
        <p className="text-green-600">✓ Conectado correctamente</p>
      ) : (
        <p className="text-red-600">✗ Error de conexión</p>
      )}
      
      <Button 
        onClick={checkConnection}
        className="mt-4"
      >
        Verificar conexión
      </Button>
    </div>
  );
};

export default SupabaseConnectionCheck;
