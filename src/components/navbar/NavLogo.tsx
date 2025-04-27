
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NavLinks } from "./NavLinks";

export const NavLogo = () => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/lovable-uploads/e83b09aa-b9e7-4ee0-9f5f-8b22288e2a55.png"
              alt="SeekArt Logo"
              className="h-10 w-auto"
            />
            <span className="text-xl font-bold text-[#1A1F2C]">SeekArt</span>
          </Link>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="start" 
          side="bottom" 
          className="w-56 bg-white"
          sideOffset={8}
        >
          <NavLinks inMobileDropdown={true} />
        </DropdownMenuContent>
      </DropdownMenu>
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
