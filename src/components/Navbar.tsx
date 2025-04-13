
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Session } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";
import { UserRound, Map, Heart, Home } from "lucide-react";

const Navbar = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [userType, setUserType] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      
      // Obtener el tipo de usuario si hay sesión
      if (session?.user) {
        const userMetadata = session.user.user_metadata;
        setUserType(userMetadata?.user_type || null);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      
      // Actualizar tipo de usuario cuando cambia la sesión
      if (session?.user) {
        const userMetadata = session.user.user_metadata;
        setUserType(userMetadata?.user_type || null);
      } else {
        setUserType(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

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

  return (
    <nav className="sticky top-0 z-10 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between p-4">
        <Link to="/" className="flex items-center space-x-2">
          <img
            src="/lovable-uploads/e83b09aa-b9e7-4ee0-9f5f-8b22288e2a55.png"
            alt="SeekArt Logo"
            className="h-10 w-auto"
          />
          <span className="text-xl font-bold text-[#1A1F2C]">SeekArt</span>
        </Link>

        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  to="/"
                  className="flex items-center gap-1 rounded px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  <Home size={16} />
                  <span>Inicio</span>
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  to="/map"
                  className="flex items-center gap-1 rounded px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  <Map size={16} />
                  <span>Mapa de Eventos</span>
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-sm font-medium text-gray-700">
                Explorar
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[200px] gap-3 p-4">
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        to="/artists"
                        className="block rounded p-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                      >
                        Artistas
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        to="/events"
                        className="block rounded p-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                      >
                        Eventos
                      </Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  to="/donations"
                  className="flex items-center gap-1 rounded px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  <Heart size={16} />
                  <span>Donaciones</span>
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center space-x-4">
          {session ? (
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="text-sm font-medium"
              >
                Cerrar sesión
              </Button>
              <Link to={userType === "artist" ? "/artist-profile" : "/fan-profile"}>
                <Button
                  variant="default"
                  className="flex items-center gap-1 bg-gradient-to-r from-[#9b87f5] to-[#6E59A5] text-sm font-medium hover:from-[#8a76e4] hover:to-[#5d4894]"
                >
                  <UserRound size={16} />
                  <span>Mi perfil</span>
                </Button>
              </Link>
            </div>
          ) : (
            <Link to="/auth">
              <Button
                variant="default"
                className="bg-gradient-to-r from-[#9b87f5] to-[#6E59A5] text-sm font-medium hover:from-[#8a76e4] hover:to-[#5d4894]"
              >
                Iniciar sesión
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
