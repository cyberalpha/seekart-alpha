
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NavLinks } from "./NavLinks";

export const NavLogo = () => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/lovable-uploads/e83b09aa-b9e7-4ee0-9f5f-8b22288e2a55.png"
              alt="SeekArt Logo"
              className="h-10 w-auto"
            />
            <span className="text-xl font-bold text-[#1A1F2C]">SeekArt</span>
          </Link>
        </SheetTrigger>
        <SheetContent 
          side="top" 
          className="w-full p-0 bg-white"
        >
          <SheetHeader className="p-4 border-b">
            <div className="flex items-center space-x-2">
              <img
                src="/lovable-uploads/e83b09aa-b9e7-4ee0-9f5f-8b22288e2a55.png"
                alt="SeekArt Logo"
                className="h-10 w-auto"
              />
              <span className="text-xl font-bold text-[#1A1F2C]">SeekArt</span>
            </div>
          </SheetHeader>
          <div className="py-4">
            <NavLinks inMobileDropdown={true} />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Link to="/" className="flex items-center space-x-2">
      <img
        src="/lovable-uploads/e83b09aa-b9e7-4ee0-9f5f-8b22288e2a55.png"
        alt="SeekArt Logo"
        className="h-10 w-auto"
      />
      <span className="text-xl font-bold text-[#1A1F2C]">SeekArt</span>
    </Link>
  );
};
