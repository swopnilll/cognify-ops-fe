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
      <Link to="/" className="flex gap-3 items-center">
        <Logo src="images/main-logo.svg" />
        <div className="flex flex-col text-[#1868DB]">
          <p className="text-2xl font-bold">Cognify Ops</p>
          <p className="text-xs pl-1 font-normal">THINK BEYOND TASKS</p>
        </div>
      </Link>

      {isAuthenticated ? <UserDropdown /> : <AuthButtons />}
    </header>
  );
};

export default Header;
