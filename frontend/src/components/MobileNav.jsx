import { NavLink, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Bell,
  PlusCircle,
  LogOut,
} from "lucide-react";

const AdminBottomNav = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      name: "Overview",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Students",
      path: "/students",
      icon: Users,
    },
    {
      name: "Add Student",
      path: "/add-student",
      icon: PlusCircle,
    },
    {
      name: "Logs",
      path: "/logs",
      icon: ClipboardList,
    },
    {
      name: "Notifications",
      path: "/notifications",
      icon: Bell,
    },
  ];

  // ==========================================
  // LOGOUT
  // ==========================================
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");

    navigate("/admin-login", {
      replace: true,
    });
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">

      <div className="mx-auto flex h-20 max-w-xl items-center px-1">

        {/* ==================================
            NAVIGATION ITEMS
        ================================== */}

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-1 items-center justify-center rounded-xl py-3 transition ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-500 hover:text-blue-600"
                }`
              }
            >
              {({ isActive }) => (
                <Icon
                  size={22}
                  strokeWidth={
                    isActive ? 2.5 : 2
                  }
                />
              )}
            </NavLink>
          );
        })}

        {/* ==================================
            LOGOUT
        ================================== */}

        <button
          type="button"
          onClick={handleLogout}
          title="Logout"
          className="flex flex-1 items-center justify-center rounded-xl py-3 text-red-500 transition hover:bg-red-50 hover:text-red-600"
        >
          <LogOut
            size={22}
            strokeWidth={2}
          />
        </button>

      </div>

    </nav>
  );
};

export default AdminBottomNav;