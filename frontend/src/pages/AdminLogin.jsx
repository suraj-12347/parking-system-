import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LockKeyhole,
  UserRound,
  LogIn,
  ArrowLeft,
} from "lucide-react";
import { toast } from "react-toastify";
import axiosInstance from "../api/axioInstance";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error("Username and password are required");
      return;
    }

    try {
      setLoading(true);

      const response = await axiosInstance.post(
        "/admin/login",
        {
          username,
          password,
        }
      );

      if (response.data.success) {
        // JWT token save
        localStorage.setItem(
          "adminToken",
          response.data.token
        );

        // Admin information save
        localStorage.setItem(
          "admin",
          JSON.stringify(response.data.admin)
        );

        toast.success("Admin login successful");

        // Dashboard
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Admin Login Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Admin login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">

      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">

        {/* ==================================
            HEADER
        ================================== */}

        <div className="mb-8 text-center">

          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white">
            <LockKeyhole size={32} />
          </div>

          <h1 className="text-3xl font-bold text-slate-800">
            Admin Login
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Sign in to access the admin panel
          </p>

        </div>


        {/* ==================================
            LOGIN FORM
        ================================== */}

        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >

          {/* Username */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Username
            </label>

            <div className="relative">

              <UserRound
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
                placeholder="Enter username"
                autoComplete="username"
                className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>
          </div>


          {/* Password */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Password
            </label>

            <div className="relative">

              <LockKeyhole
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Enter password"
                autoComplete="current-password"
                className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>
          </div>


          {/* Login Button */}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogIn size={20} />

            {loading
              ? "Signing in..."
              : "Sign In"}
          </button>

        </form>


        {/* ==================================
            BACK TO HOME
        ================================== */}

        <button
          type="button"
          onClick={() => navigate("/")}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 font-medium text-slate-600 transition hover:bg-slate-50 hover:text-blue-600"
        >
          <ArrowLeft size={18} />

          <span>Back to Home</span>
        </button>

      </div>
    </div>
  );
};

export default AdminLogin;