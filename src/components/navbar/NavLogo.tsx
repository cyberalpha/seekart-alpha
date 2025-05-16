import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "@/components/ui/sheet";
import { NavLinks } from "./NavLinks";
import { Menu } from "lucide-react";
export const NavLogo = () => {
  const isMobile = useIsMobile();

  // Verificar que estamos en móvil antes de renderizar
  console.log('Estado móvil en NavLogo:', isMobile);
  if (isMobile) {
    return <Sheet>
        <SheetTrigger asChild>
          <button className="flex items-center space-x-2">
            <img src="/lovable-uploads/e83b09aa-b9e7-4ee0-9f5f-8b22288e2a55.png" alt="SeekArt Logo" className="h-10 w-auto" />
            <span className="text-xl font-bold text-[#1A1F2C]">SeekArt</span>
            <Menu className="ml-2 h-6 w-6 md:hidden" />
          </button>
        </SheetTrigger>
        <SheetContent side="top" className="w-full p-0 bg-white h-[100dvh] flex flex-col">
          <SheetHeader className="p-4 border-b">
            <div className="flex items-center space-x-2">
              <img src="/lovable-uploads/e83b09aa-b9e7-4ee0-9f5f-8b22288e2a55.png" alt="SeekArt Logo" className="h-10 w-auto" />
              <span className="text-xl font-bold text-[#1A1F2C]">SeekArt</span>
            </div>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto py-4">
            <NavLinks inMobileDropdown={true} />
          </div>
        </SheetContent>
      </Sheet>;
  }

  // Versión desktop
  return <Link to="/" className="flex items-center space-x-2">
      <img alt="SeekArt Logo" className="h-10 w-auto" src="/lovable-uploads/38d26705-e1cc-4e41-b34b-78d05cfe5b0b.png" />
      <span className="text-xl font-bold text-[#1A1F2C]">SeekArt</span>
    </Link>;
};