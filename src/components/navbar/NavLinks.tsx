import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Home, 
  Map, 
  Users, 
  Calendar, 
  Heart, 
  Cog, 
  Menu 
} from "lucide-react";

export const NavLinks = () => {
  const isMobile = useIsMobile();

  const links = [
    { to: "/", icon: Home, label: "Inicio", color: "#3498db" },
    { to: "/map", icon: Map, label: "Mapa", color: "#2ecc71" },
    { to: "/artists", icon: Users, label: "Artistas", color: "#9b59b6" },
    { to: "/events", icon: Calendar, label: "Eventos", color: "#f39c12" },
    { to: "/donations", icon: Heart, label: "Donaciones", color: "#e74c3c" },
    { to: "/system-check", icon: Cog, label: "Sistema", color: "#7f8c8d" },
  ];

  const renderLinks = () => (
    <NavigationMenuList className={isMobile ? "flex-col space-y-2" : "relative"}>
      {links.map(({ to, icon: Icon, label, color }) => (
        <NavigationMenuItem key={to}>
          <NavigationMenuLink asChild>
            <Link
              to={to}
              className="flex items-center gap-1 rounded px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              <Icon size={16} color={color} />
              <span>{label}</span>
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      ))}
    </NavigationMenuList>
  );

  if (isMobile) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-2 hover:bg-gray-100 rounded-md">
            <Menu size={24} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          side="bottom"
          className="w-56 bg-white"
          sideOffset={8}
        >
          {links.map(({ to, icon: Icon, label, color }) => (
            <DropdownMenuItem key={to} asChild>
              <Link
                to={to}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Icon size={16} color={color} />
                <span>{label}</span>
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <NavigationMenu>
      {renderLinks()}
    </NavigationMenu>
  );
};
