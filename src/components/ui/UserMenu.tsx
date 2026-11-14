import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";

import Avatar from "./Avatar";
import { useAuth } from "../../hooks/useAuthV2";
import { logout } from "../../services/authService";

const UserMenu = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const displayName = auth.user?.name || auth.user?.nickname || auth.user?.email || "";

  const handleLogout = async () => {
    await logout();
    await auth.signOut();
    navigate({ to: "/", replace: true });
  };

  return (
    <Menu as="div" className="relative">
      <MenuButton
        aria-label="Account menu"
        className="flex rounded-full transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
      >
        <Avatar name={displayName} src={auth.user?.picture || undefined} size={34} />
      </MenuButton>

      <MenuItems
        transition
        anchor="bottom end"
        className="z-50 mt-2 w-60 origin-top-right rounded-xl bg-white p-1.5 shadow-lg ring-1 ring-slate-900/5 transition duration-100 focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
      >
        <div className="border-b border-slate-100 px-3 pb-2.5 pt-2">
          <p className="truncate text-sm font-medium text-slate-900">{displayName}</p>
          <p className="truncate text-xs text-slate-500">{auth.user?.email}</p>
        </div>
        <MenuItem>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 data-[focus]:bg-slate-100"
          >
            <LogOut className="h-4 w-4 text-slate-400" />
            Sign out
          </button>
        </MenuItem>
      </MenuItems>
    </Menu>
  );
};

export default UserMenu;
