
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Bell,
  Car,
  ChevronLeft,
  PlusCircle,
} from "lucide-react";

const AdminSidebar = ({ collapsed = false, onToggle }) => {
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
      name: "Logs",
      path: "/logs",
      icon: ClipboardList,
    },
     {
      name: "Add New Students",
      path: "/add-student",
      icon: PlusCircle,
    },
    // {
    //   name: "Notifications",
    //   path: "/notifications",
    //   icon: Bell,
    // },
  ];

  return (
    <aside
      className={`flex h-screen flex-col bg-blue-700 text-white shadow-xl transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Logo */}
      <div className="flex h-20 items-center border-b border-blue-600 px-5">

        <div className="flex min-w-0 items-center gap-3">

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-blue-700">
            <Car size={24} strokeWidth={2.5} />
          </div>

          {!collapsed && (
            <div>
              <h1 className="text-lg font-bold">
                Parking Admin
              </h1>

              <p className="text-xs text-blue-200">
                Management System
              </p>
            </div>
          )}

        </div>

      </div>


      {/* Navigation */}
      <nav className="flex-1 space-y-2 px-3 py-6">

        {menuItems.map((item) => {

          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-4 py-3.5 font-medium transition ${
                  isActive
                    ? "bg-white text-blue-700 shadow-sm"
                    : "text-blue-100 hover:bg-blue-600 hover:text-white"
                }`
              }
            >
              <Icon
                size={21}
                strokeWidth={2}
                className="shrink-0"
              />

              {!collapsed && (
                <span>{item.name}</span>
              )}
            </NavLink>
          );
        })}

      </nav>


      {/* Bottom */}
      <div className="border-t border-blue-600 p-3">

        <button
          type="button"
          onClick={onToggle}
          className="flex w-full items-center justify-center rounded-xl py-3 text-blue-100 transition hover:bg-blue-600 hover:text-white"
        >
          <ChevronLeft
            size={20}
            className={`transition-transform ${
              collapsed ? "rotate-180" : ""
            }`}
          />

          {!collapsed && (
            <span className="ml-2 text-sm">
              Collapse Sidebar
            </span>
          )}
        </button>

      </div>

    </aside>
  );
};

export default AdminSidebar;

