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
import { UserRound, Map, Heart, Home, Users, Calendar, Inbox, Cog } from "lucide-react";

const Navbar = () => {
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
              <NavigationMenuTrigger className="flex items-center gap-1 text-sm font-medium text-gray-700">
                <Users size={16} />
                <span>Explorar</span>
              </NavigationMenuTrigger>
              <NavigationMenuContent className="min-w-[200px]">
                <ul className="grid w-full gap-3 p-4">
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        to="/artists"
                        className="flex items-center gap-2 rounded p-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                      >
                        <Users size={16} />
                        <span>Artistas</span>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        to="/events"
                        className="flex items-center gap-2 rounded p-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                      >
                        <Calendar size={16} />
                        <span>Eventos</span>
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

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  to="/system-check"
                  className="flex items-center gap-1 rounded px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  <Cog size={16} />
                  <span>Sistema</span>
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center space-x-4">
          {session ? (
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
