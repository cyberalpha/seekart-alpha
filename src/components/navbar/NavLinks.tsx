
import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Calendar, Home, Heart, Map, Users, Cog } from "lucide-react";

export const NavLinks = () => {
  return (
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
  );
};
