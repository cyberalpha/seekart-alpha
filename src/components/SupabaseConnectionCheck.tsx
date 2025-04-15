import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
const SupabaseConnectionCheck = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [session, setSession] = useState(null);
  useEffect(() => {
    // Verificar la sesión actual al montar el componente
    supabase.auth.getSession().then(({
      data: {
        session
      }
    }) => {
      setSession(session);
    });

    // Suscribirse a cambios en el estado de autenticación
    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);
  const checkConnection = async () => {
    try {
      // Intentar una consulta simple para verificar la conexión y las políticas
      const {
        data: artists,
        error: artistsError
      } = await supabase.from('artists').select('id').limit(1);
      if (artistsError) throw artistsError;
      const {
        data: fans,
        error: fansError
      } = await supabase.from('fans').select('id').limit(1);
      if (fansError) throw fansError;
      setIsConnected(true);
      toast({
        title: "Conexión exitosa",
        description: "La conexión a Supabase y las políticas RLS están funcionando correctamente",
        variant: "default"
      });
    } catch (error) {
      console.error('Error de conexión o políticas:', error);
      setIsConnected(false);
      toast({
        title: "Error de conexión",
        description: "Hubo un problema al verificar la conexión y las políticas",
        variant: "destructive"
      });
    }
  };
  useEffect(() => {
    checkConnection();
  }, []);
  return <div className="mx-auto max-w-md rounded-md border p-6 shadow-md">
      <h2 className="mb-4 text-xl font-bold">Estado de la Base de Datos:</h2>
      
      <div className="space-y-4">
        <div>
          <p className="font-medium">Conexión:</p>
          {isConnected === null ? <p>Verificando conexión...</p> : isConnected ? <p className="text-green-600">✓ Conectado correctamente</p> : <p className="text-red-600">✗ Error de conexión</p>}
        </div>

        <div>
          <p className="font-medium">Autenticación:</p>
          {session ? <p className="text-green-600">✓ Usuario autenticado</p> : <p className="text-yellow-600">! Usuario no autenticado</p>}
        </div>
      
        <Button onClick={checkConnection} className="w-full">
          Verificar conexión y políticas
        </Button>
      </div>
    </div>;
};
export default SupabaseConnectionCheck;