import { Link } from "@tanstack/react-router";
import Logo from "./ui/Logo";
import { useAuth } from "../hooks/useAuthV2";
import UserDropdown from "./ui/UserDropdown";
import AuthButtons from "./ui/AuthButtons";

const Header = () => {
  const { isAuthenticated } = useAuth();

  console.log("Header isAuthenticated:", isAuthenticated);

  return (
    <header className="p-4 flex justify-between items-center bg-white shadow-lg">
      <Link to="/">
        <Logo src="images/logo.jpeg" />
      </Link>

      {isAuthenticated ? <UserDropdown /> : < AuthButtons/>}
    </header>
  );
};

export default Header;
