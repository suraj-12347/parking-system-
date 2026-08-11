import { useEffect } from "react";
import StudentCard from "./StudentCard";
import Countdown from "./CountDown";

const variants = {
  success: {
    bg: "bg-green-600",
    title: "ACCESS ALLOWED",
    icon: "🤗",
    sound: "/sounds/success.wav",
  },

  danger: {
    bg: "bg-red-600",
    title: "ACCESS DENIED",
    icon: "😏",
    sound: "/sounds/danger.mp3",
  },

  warning: {
    bg: "bg-yellow-500",
    title: "WARNING",
    icon: "🟡",
    // sound: "/sounds/warning.mp3",
  },
};

const ScanResult = ({
  status = "success",
  message = "",
  student = null,
  countdownTime = 10,
}) => {
  const current = variants[status];

  useEffect(() => {
    if (!current?.sound) return;

    const audio = new Audio(current.sound);
    audio.volume = 1;
    audio.play().catch(() => {});
  }, [status]);

  return (
    <div className="space-y-6">
      <div
        className={`${current.bg} rounded-3xl p-10 text-center text-white shadow-2xl`}
      >
        <div className="text-7xl">{current.icon}</div>

        <h1 className="mt-4 text-4xl font-black tracking-wide">
          {current.title}
        </h1>

        {message && (
          <p className="mt-3 text-xl font-medium text-white/90">
            {message}
          </p>
        )}
      </div>

      {student && <StudentCard student={student} />}

      <Countdown seconds={countdownTime} />
    </div>
  );
};

export default ScanResult;