// src/pages/GateSelection.jsx

import { LogIn, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const GateSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto flex h-[90vh] max-w-7xl gap-8 flex-col lg:flex-row lg:items-center lg:justify-center">

        {/* ENTRY */}
        <button
          onClick={() => navigate("/entry")}
          className="group h-full flex-1 rounded-[40px] bg-emerald-600 text-white shadow-2xl transition-all duration-300 active:scale-[0.98]"
        >
          <div className="flex h-full flex-col items-center justify-center">

            <div className="mb-8 rounded-full bg-white/15 p-10">
              <LogIn size={90} strokeWidth={2.2} />
            </div>

            <h1 className="text-6xl font-extrabold tracking-wide">
              ENTRY
            </h1>

            <p className="mt-5 text-2xl text-emerald-100">
              Tap to Start Entry Scan
            </p>

          </div>
        </button>

        {/* EXIT */}
        <button
          onClick={() => navigate("/exit")}
          className="group flex-1 h-full rounded-[40px] bg-red-600 text-white shadow-2xl transition-all duration-300 active:scale-[0.98]"
        >
          <div className="flex h-full flex-col items-center justify-center">

            <div className="mb-8 rounded-full bg-white/15 p-10">
              <LogOut size={90} strokeWidth={2.2} />
            </div>

            <h1 className="text-6xl font-extrabold tracking-wide">
              EXIT
            </h1>

            <p className="mt-5 text-2xl text-red-100">
              Tap to Start Exit Scan
            </p>

          </div>
        </button>

      </div>
    </div>
  );
};

export default GateSelection;