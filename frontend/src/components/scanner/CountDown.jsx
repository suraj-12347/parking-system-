import { RotateCcw } from "lucide-react";

const Countdown = ({ seconds = 10 }) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600">
        <RotateCcw size={28} />
      </div>

      <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
        Camera Restarting In
      </p>

      <h2 className="mt-2 text-7xl font-black text-blue-600">
        {seconds}
      </h2>

      <p className="mt-2 text-sm text-slate-400">
        Please wait...
      </p>
    </div>
  );
};

export default Countdown;