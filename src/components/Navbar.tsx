
import { NavLogo } from "./navbar/NavLogo";
import { NavLinks } from "./navbar/NavLinks";
import { UserMenu } from "./navbar/UserMenu";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-10 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between p-4">
        <NavLogo />
        <NavLinks />
        <div className="flex items-center space-x-4">
          <UserMenu />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
