
import { Link } from "react-router-dom";

export const NavLogo = () => {
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
