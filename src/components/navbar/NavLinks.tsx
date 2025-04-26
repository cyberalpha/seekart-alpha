
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { 
  Calendar, 
  Home, 
  Heart, 
  Map, 
  Users, 
  Cog,
  Menu 
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export const NavLinks = () => {
  const isMobile = useIsMobile();

  const links = [
    { to: "/", icon: Home, label: "Inicio" },
    { to: "/map", icon: Map, label: "Mapa" },
    { to: "/artists", icon: Users, label: "Artistas" },
    { to: "/events", icon: Calendar, label: "Eventos" },
    { to: "/donations", icon: Heart, label: "Donaciones" },
    { to: "/system-check", icon: Cog, label: "Sistema" },
  ];

  const renderLinks = () => (
    <NavigationMenuList className={isMobile ? "flex-col space-y-2" : "relative"}>
      {links.map(({ to, icon: Icon, label }) => (
        <NavigationMenuItem key={to}>
          <NavigationMenuLink asChild>
            <Link
              to={to}
              className="flex items-center gap-1 rounded px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              <Icon size={16} />
              <span>{label}</span>
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      ))}
    </NavigationMenuList>
  );

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <button className="p-2 hover:bg-gray-100 rounded-md">
            <Menu size={24} />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] sm:w-[280px]">
          <SheetHeader>
            <SheetTitle>Menú</SheetTitle>
          </SheetHeader>
          <div className="py-4">
            <NavigationMenu className="w-full">
              {renderLinks()}
            </NavigationMenu>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <NavigationMenu>
      {renderLinks()}
    </NavigationMenu>
  );
};
