
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { 
  Home, 
  Map, 
  Users, 
  Calendar, 
  Heart, 
  Cog
} from "lucide-react";

interface NavLinksProps {
  inMobileDropdown?: boolean;
}

export const NavLinks = ({ inMobileDropdown = false }: NavLinksProps) => {
  const isMobile = useIsMobile();

  const links = [
    { to: "/", icon: Home, label: "Inicio", color: "#3498db" },
    { to: "/map", icon: Map, label: "Mapa", color: "#2ecc71" },
    { to: "/artists", icon: Users, label: "Artistas", color: "#9b59b6" },
    { to: "/events", icon: Calendar, label: "Eventos", color: "#f39c12" },
    { to: "/donations", icon: Heart, label: "Donaciones", color: "#e74c3c" },
    { to: "/system-check", icon: Cog, label: "Sistema", color: "#7f8c8d" },
  ];

  // Si estamos en el menú móvil desplegable
  if (inMobileDropdown) {
    return (
      <div className="flex flex-col space-y-1">
        {links.map(({ to, icon: Icon, label, color }) => (
          <Link
            key={to}
            to={to}
            className="flex items-center gap-3 px-6 py-4 text-base font-medium text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors"
          >
            <Icon size={24} color={color} />
            <span>{label}</span>
          </Link>
        ))}
      </div>
    );
  }

  // Versión desktop
  return (
    <NavigationMenu>
      <NavigationMenuList className="relative">
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
    </NavigationMenu>
  );
};
