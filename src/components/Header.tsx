import { Link } from "@tanstack/react-router";

import { useAuth } from "../hooks/useAuthV2";
import UserMenu from "./ui/UserMenu";

const linkButton =
  "inline-flex h-9 items-center rounded-lg px-4 text-sm font-medium transition-colors";

const Header = () => {
  const { isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
      <Link to={isAuthenticated ? "/projects" : "/"} className="flex items-center gap-2.5">
        <img src="/images/main-logo.svg" alt="" className="h-8 w-8" />
        <span className="text-lg font-semibold tracking-tight text-slate-900">Cognify Ops</span>
      </Link>

      {isAuthenticated ? (
        <div className="flex items-center gap-2">
          <Link
            to="/projects"
            className={`${linkButton} text-slate-600 hover:bg-slate-100 hover:text-slate-900`}
            activeProps={{ className: "bg-slate-100 text-slate-900" }}
          >
            Projects
          </Link>
          <UserMenu />
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className={`${linkButton} text-slate-600 hover:bg-slate-100 hover:text-slate-900`}
          >
            Log in
          </Link>
          <Link
            to="/signup"
            className={`${linkButton} bg-brand-600 text-white shadow-sm hover:bg-brand-700`}
          >
            Sign up
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
