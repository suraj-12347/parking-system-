import { Bell, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axioInstance";

const StudentHeader = () => {
  const navigate = useNavigate();

  let student = null;

  try {
    student = JSON.parse(localStorage.getItem("student"));
  } catch (error) {
    console.error("STUDENT DATA ERROR:", error);
  }

  const studentName = student?.name || "Student";
  const initial = studentName.charAt(0).toUpperCase();

  // ==========================================
  // STUDENT PHOTO URL
  // ==========================================

  const getPhotoUrl = () => {
    if (!student?.photo) return null;

    // Agar photo already complete URL hai
    if (
      student.photo.startsWith("http://") ||
      student.photo.startsWith("https://")
    ) {
      return student.photo;
    }

    // axiosInstance ka baseURL
    const baseURL = axiosInstance.defaults.baseURL || "";

    // /api remove karo
    const serverURL = baseURL.replace(/\/api\/?$/, "");

    // uploads/students/...
    return `${serverURL}/${student.photo.replace(/^\/+/, "")}`;
  };

  const studentPhoto = getPhotoUrl();

  console.log("Student Photo:", student?.photo);
  console.log("Photo URL:", studentPhoto);

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem("studentToken");
    localStorage.removeItem("student");

    navigate("/student/login", {
      replace: true,
    });
  };

  // ==========================================
  // PHOTO ERROR
  // ==========================================

  const handleImageError = (e) => {
    console.error("PHOTO LOAD ERROR:", studentPhoto);

    e.currentTarget.style.display = "none";

    const fallback =
      e.currentTarget.parentElement.querySelector(".photo-fallback");

    if (fallback) {
      fallback.classList.remove("hidden");
      fallback.classList.add("flex");
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[82px] max-w-2xl items-center justify-between px-4 sm:px-5">

        {/* LEFT - STUDENT PROFILE */}
        <div className="flex min-w-0 items-center gap-3">

          {/* PHOTO */}
          <div className="relative h-11 w-11 shrink-0">

            {studentPhoto ? (
              <img
                src={studentPhoto}
                alt={studentName}
                className="h-11 w-11 rounded-2xl object-cover shadow-md ring-2 ring-white"
                onError={handleImageError}
              />
            ) : null}

            {/* FALLBACK */}
            <div
              className={`photo-fallback ${
                studentPhoto ? "hidden" : "flex"
              } h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-bold text-white shadow-md shadow-blue-200`}
            >
              {initial}
            </div>

            {/* ONLINE DOT */}
            <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-[3px] border-white bg-emerald-500" />
          </div>

          {/* NAME */}
          <div className="min-w-0">
            <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Welcome back
            </p>

            <h1 className="truncate text-[15px] font-bold leading-tight text-slate-800 sm:text-base">
              {studentName}
            </h1>
          </div>
        </div>

        {/* RIGHT - ACTIONS */}
        <div className="flex items-center gap-3 sm:gap-2">

          {/* NOTIFICATION */}
          <button
            type="button"
            aria-label="Notifications"
            className="group relative flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-500 transition-all duration-200 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 active:scale-95"
          >
            <Bell
              size={20}
              strokeWidth={2}
              className="transition-transform duration-200 group-hover:scale-105"
            />

            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
          </button>

          {/* LOGOUT */}
          <button
            type="button"
            onClick={handleLogout}
            aria-label="Logout"
            className="group flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-500 transition-all duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600 active:scale-95"
          >
            <LogOut
              size={20}
              strokeWidth={2}
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </button>

        </div>
      </div>
    </header>
  );
};

export default StudentHeader;