
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

const Navbar = () => {
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
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
          <span className="text-xl font-bold">SeekArt</span>
        </Link>

        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  to="/"
                  className="rounded px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  Inicio
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
              <Link to="/profile">
                <Button
                  variant="default"
                  className="bg-gradient-to-r from-green-500 to-teal-500 text-sm font-medium hover:from-green-600 hover:to-teal-600"
                >
                  Mi perfil
                </Button>
              </Link>
            </div>
          ) : (
            <Link to="/auth">
              <Button
                variant="default"
                className="bg-gradient-to-r from-green-500 to-teal-500 text-sm font-medium hover:from-green-600 hover:to-teal-600"
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
