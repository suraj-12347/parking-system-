import { ShieldCheck } from "lucide-react";

const Header = () => {
  return (
    <header className="flex min-h-[100px] max-h-[150px] items-center justify-between border-b border-slate-200 bg-white px-8 shadow-sm pt-5">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
          <ShieldCheck size={26} />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            IPS University Parking System
          </h1>

          <p className="text-sm text-slate-500">
            Smart Semi-Automatic Parking Management
          </p>
        </div>
      </div>

      <div className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
        🟢 System Online
      </div>
    </header>
  );
};

export default Header;