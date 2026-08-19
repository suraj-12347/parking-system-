import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LockKeyhole,
  UserRound,
  Eye,
  EyeOff,
  LogIn,
} from "lucide-react";
import { toast } from "react-toastify";

import axiosInstance from "../../api/axioInstance";

const StudentLogin = () => {
  const navigate = useNavigate();

  const [enrollment, setEnrollment] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  // ========================================
  // LOGIN
  // ========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanEnrollment =
      enrollment.trim().toUpperCase();

    if (!cleanEnrollment) {
      toast.error("Please enter your enrollment number.");
      return;
    }

    if (!password) {
      toast.error("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      const response =
        await axiosInstance.post(
          "/students/login",
          {
            enrollment: cleanEnrollment,
            password,
          }
        );

      console.log(
        "LOGIN RESPONSE:",
        response.data
      );

      if (!response.data?.success) {
        toast.error(
          response.data?.message ||
            "Login failed"
        );
        return;
      }

      // ========================================
      // SAVE LOGIN DATA
      // ========================================

      localStorage.setItem(
        "studentToken",
        response.data.token
      );

      localStorage.setItem(
        "student",
        JSON.stringify(
          response.data.student
        )
      );

      toast.success(
        response.data.message ||
          "Login successful"
      );

      // ========================================
      // REDIRECT
      // ========================================

      navigate("/student/enter");

    } catch (error) {
      console.error(
        "STUDENT LOGIN ERROR:",
        error
      );

      const message =
        error.response?.data?.message ||
        "Unable to login. Please try again.";

      toast.error(message);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">

      <div className="flex min-h-screen">

        {/* ====================================
            LEFT SIDE
        ==================================== */}

        <div className="hidden lg:flex lg:w-1/2 bg-blue-600">

          <div className="flex w-full flex-col justify-center px-12 xl:px-20">

            <div className="max-w-md">

              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-white">
                <LockKeyhole size={32} />
              </div>

              <h1 className="text-4xl font-bold text-white">
                Student Parking Portal
              </h1>

              <p className="mt-4 text-lg leading-7 text-blue-100">
                Login to access your parking
                account, subscription details
                and vehicle information.
              </p>

              <div className="mt-8 space-y-4">

                <div className="flex items-center gap-3 text-blue-100">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
                    ✓
                  </div>
                  Secure student login
                </div>

                <div className="flex items-center gap-3 text-blue-100">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
                    ✓
                  </div>
                  View parking subscription
                </div>

                <div className="flex items-center gap-3 text-blue-100">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
                    ✓
                  </div>
                  Manage vehicle information
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* ====================================
            RIGHT SIDE
        ==================================== */}

        <div className="flex w-full items-center justify-center px-4 py-10 sm:px-6 lg:w-1/2">

          <div className="w-full max-w-md">

            {/* Mobile Logo */}

            <div className="mb-8 text-center lg:hidden">

              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg">
                <LockKeyhole size={28} />
              </div>

              <h1 className="text-2xl font-bold text-slate-800">
                Student Parking Portal
              </h1>

            </div>

            {/* =================================
                LOGIN CARD
            ================================= */}

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

              <div className="mb-8">

                <h2 className="text-2xl font-bold text-slate-800">
                  Welcome Back
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Login using your enrollment
                  number and password.
                </p>

              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >

                {/* =================================
                    ENROLLMENT
                ================================= */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Enrollment / Roll No.
                  </label>

                  <div className="relative">

                    <UserRound
                      size={19}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="text"
                      value={enrollment}
                      onChange={(e) =>
                        setEnrollment(
                          e.target.value
                        )
                      }
                      placeholder="IPS2024006"
                      autoComplete="username"
                      disabled={loading}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pl-10 uppercase outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                    />

                  </div>

                  <p className="mt-1.5 text-xs text-slate-400">
                    Enrollment number is not
                    case-sensitive.
                  </p>

                </div>

                {/* =================================
                    PASSWORD
                ================================= */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Password
                  </label>

                  <div className="relative">

                    <LockKeyhole
                      size={19}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={password}
                      onChange={(e) =>
                        setPassword(
                          e.target.value
                        )
                      }
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      disabled={loading}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pl-10 pr-12 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (prev) => !prev
                        )
                      }
                      disabled={loading}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                    >
                      {showPassword ? (
                        <EyeOff size={19} />
                      ) : (
                        <Eye size={19} />
                      )}
                    </button>

                  </div>

                </div>

                {/* =================================
                    LOGIN BUTTON
                ================================= */}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {loading ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-blue-300 border-t-white" />

                      Logging in...
                    </>
                  ) : (
                    <>
                      <LogIn size={19} />

                      Login
                    </>
                  )}

                </button>

              </form>

              {/* =================================
                  SECURITY NOTE
              ================================= */}

              <div className="mt-6 rounded-xl bg-slate-50 px-4 py-3">

                <p className="text-center text-xs leading-5 text-slate-500">
                  Your login credentials are
                  securely protected. Do not share
                  your password with anyone.
                </p>

              </div>

            </div>

            <p className="mt-6 text-center text-xs text-slate-400">
              IPS College Parking Management
              System
            </p>

          </div>

        </div>

      </div>

    </div>
  );
};

export default StudentLogin;