
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Session } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { UserRound } from "lucide-react";
import { getVerifiedUserType, VerifiedUserType } from "@/lib/userTypeVerification";

export const UserMenu = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [userType, setUserType] = useState<VerifiedUserType>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      
      if (session?.user) {
        // Use database verification instead of JWT metadata
        const verifiedType = await getVerifiedUserType(session.user.id);
        setUserType(verifiedType);
        
        if (verifiedType) {
          fetchProfileImage(session.user.id, verifiedType);
        }
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      
      if (session?.user) {
        // Defer database verification to avoid deadlock
        setTimeout(async () => {
          const verifiedType = await getVerifiedUserType(session.user.id);
          setUserType(verifiedType);
          
          if (verifiedType) {
            fetchProfileImage(session.user.id, verifiedType);
          }
        }, 0);
      } else {
        setUserType(null);
        setProfileImage(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfileImage = async (userId: string, userType: VerifiedUserType) => {
    try {
      if (!userId || !userType) return;
      
      const tableName = userType === "artist" ? "artists" : "fans";
      
      const { data, error } = await supabase
        .from(tableName)
        .select("profile_image")
        .eq("id", userId)
        .single();
      
      if (error) throw error;
      
      if (data && data.profile_image) {
        setProfileImage(data.profile_image);
      }
    } catch (error) {
      console.error("Error fetching profile image:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      setIsLoggingOut(true);

      // Limpiar el estado local primero
      setSession(null);
      setUserType(null);
      setProfileImage(null);

      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;

      // Solo navegar y mostrar el toast después de un cierre de sesión exitoso
      navigate("/");
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente.",
      });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo cerrar la sesión. Inténtalo de nuevo.",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (session) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              {profileImage ? (
                <AvatarImage src={profileImage} alt="Profile" />
              ) : (
                <AvatarFallback className="bg-gradient-to-r from-[#9b87f5] to-[#6E59A5]">
                  <UserRound className="h-5 w-5 text-white" />
                </AvatarFallback>
              )}
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link to={userType === "artist" ? "/artist-profile" : "/fan-profile"}>
              Mi perfil
            </Link>
          </DropdownMenuItem>
          {userType === "artist" && (
            <DropdownMenuItem asChild>
              <Link to="/create-event">Crear evento</Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={handleSignOut}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? "Cerrando sesión..." : "Cerrar sesión"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Link to="/auth">
      <Button
        variant="default"
        className="bg-gradient-to-r from-[#9b87f5] to-[#6E59A5] text-sm font-medium hover:from-[#8a76e4] hover:to-[#5d4894]"
      >
        Iniciar sesión
      </Button>
    </Link>
  );
};
