
import { Link } from "@tanstack/react-router";
import Logo from "./ui/Logo";
import { useAuth } from "../hooks/useAuth";
import UserDropdown from "./ui/UserDropdown";
import AuthButtons from "./ui/AuthButtons";


const Header = () => {
  const { user } = useAuth();

  return (
    <header className="p-4 flex justify-between items-center bg-white shadow-lg">
      <Link to="/">
        <Logo src="images/logo.jpeg" />
      </Link>

      {user ? (
        <UserDropdown />
      ) : (
        <AuthButtons />
      )}
    </header>
  );
};

export default Header;
