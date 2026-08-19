import { NavLink, useLocation } from "react-router-dom";
import {
  QrCode,
  History,
  UserRound,
} from "lucide-react";

const StudentNav = () => {
  const location = useLocation();

  // Dashboard ko bhi Enter tab ka part treat karo
  const isEnterActive =
    location.pathname === "/student/dashboard" ||
    location.pathname === "/student/enter";

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">

      {/* =====================================
          NAV BACKGROUND
      ===================================== */}

      <div className="mx-auto max-w-2xl px-4 pb-4">

        <div className="relative flex h-16 items-center justify-between rounded-2xl border border-slate-200 bg-white/95 px-6 shadow-[0_-8px_30px_rgba(15,23,42,0.10)] backdrop-blur">

          {/* =================================
              LEFT - LOGS
          ================================= */}

          <NavLink
            to="/student/logs"
            className={({ isActive }) =>
              `flex w-20 flex-col items-center justify-center gap-1 transition ${
                isActive
                  ? "text-blue-600"
                  : "text-slate-400 hover:text-slate-600"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <History
                  size={21}
                  strokeWidth={
                    isActive ? 2.5 : 2
                  }
                />

                <span className="text-[11px] font-semibold">
                  Logs
                </span>
              </>
            )}
          </NavLink>


          {/* =================================
              CENTER - ENTER / QR
          ================================= */}

          <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-[22px]">

            <NavLink
              to="/student/enter"
              aria-label="Enter Parking"
              className={`
                group flex h-[78px] w-[78px]
                items-center justify-center
                rounded-full
                border-[5px] border-white
               
                transition duration-200
                ${
                  isEnterActive
                    ? "bg-blue-700 shadow-blue-200"
                    : "bg-blue-600 hover:scale-105 hover:bg-blue-700"
                }
              `}
            >

              <QrCode
                size={40}
                strokeWidth={2.2}
                className="text-white transition group-hover:scale-105"
              />

            </NavLink>


            {/* Enter Label */}

            <div className="absolute left-1/2 top-[73px] -translate-x-1/2 whitespace-nowrap">

              {/* <span
                className={`
                  text-[11px] font-bold
                  ${
                    isEnterActive
                      ? "text-blue-600"
                      : "text-slate-600"
                  }
                `}
              >
                Enter
              </span> */}

            </div>

          </div>


          {/* =================================
              RIGHT - PROFILE
          ================================= */}

          <NavLink
            to="/student/profile"
            className={({ isActive }) =>
              `flex w-20 flex-col items-center justify-center gap-1 transition ${
                isActive
                  ? "text-blue-600"
                  : "text-slate-400 hover:text-slate-600"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <UserRound
                  size={21}
                  strokeWidth={
                    isActive ? 2.5 : 2
                  }
                />

                <span className="text-[11px] font-semibold">
                  Profile
                </span>
              </>
            )}
          </NavLink>

        </div>

      </div>

    </nav>
  );
};

export default StudentNav;