
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
import { useToast } from "@/components/ui/use-toast";
import { UserRound } from "lucide-react";

export const UserMenu = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [userType, setUserType] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      
      if (session?.user) {
        const userMetadata = session.user.user_metadata;
        setUserType(userMetadata?.user_type || null);
        
        fetchProfileImage(session.user.id, userMetadata?.user_type);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      
      if (session?.user) {
        const userMetadata = session.user.user_metadata;
        setUserType(userMetadata?.user_type || null);
        
        fetchProfileImage(session.user.id, userMetadata?.user_type);
      } else {
        setUserType(null);
        setProfileImage(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfileImage = async (userId: string, userType: string | undefined) => {
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
      await supabase.auth.signOut();
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
          <DropdownMenuItem onClick={handleSignOut}>
            Cerrar sesión
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
