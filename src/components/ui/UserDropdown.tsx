// components/UserDropdown.tsx
import { FaUser } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "../../hooks/useAuthV2";

import { useMutation } from "@tanstack/react-query";
import { logout } from "../../services/authService";

const UserDropdown = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  const mutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      auth.signOut();
      navigate({ to: "/", replace: true });
    },
    onError: (error: any) => {
      console.error("Logout error:", error);
    }
  });

  // Logout handler
  const handleLogout = () => {
    mutation.mutate();
    setIsDropdownOpen(false);
    navigate({ to: "/", replace: true });
  };

  // Close the dropdown when clicking outside
  const handleClickOutside = (e: MouseEvent) => {
    if (!(e.target as Element).closest(".user-dropdown")) {
      setIsDropdownOpen(false);
    }
  };

  // Add event listener for click outside of the dropdown
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="relative user-dropdown">
      <FaUser
        style={{ fontSize: "1.5rem", color: "#1868DB", cursor: "pointer" }}
        onClick={toggleDropdown}
      />
      {isDropdownOpen && (
        <div
          className="absolute right-0 mt-2 p-3 bg-white border border-gray-300 rounded-lg shadow-md w-48 z-50"
          style={{
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.12), 0 1px 3px rgba(0, 0, 0, 0.08)",
            borderRadius: "10px",
          }}
        >
          <button
            onClick={handleLogout}
            className="w-full text-left p-3 text-blue-600 hover:text-blue-800 hover:bg-gray-100 rounded-lg transition duration-200 ease-in-out"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
