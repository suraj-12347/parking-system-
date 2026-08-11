
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Bell,
  PlusCircle,
} from "lucide-react";

const AdminBottomNav = () => {
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
      name: "Add New Student",
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

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">

      <div className="mx-auto flex h-20 max-w-xl items-center justify-around px-2">

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex min-w-[70px] flex-col items-center justify-center gap-1 rounded-xl px-3 py-2 transition ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-500 hover:text-blue-600"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={22}
                    strokeWidth={isActive ? 2.5 : 2}
                  />

                  {/* <span
                    className={`text-xs ${
                      isActive
                        ? "font-semibold"
                        : "font-medium"
                    }`}
                  >
                    {item.name}
                  </span> */}
                </>
              )}
            </NavLink>
          );
        })}

      </div>

    </nav>
  );
};

export default AdminBottomNav;









