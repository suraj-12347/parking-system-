import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { useEffect } from "react";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ==========================================
// WATCHMAN PAGES
// ==========================================
import EntryGate from "./pages/EntryGate";
import ExitGate from "./pages/ExitGate";
import Buttons from "./pages/Buttons";

// ==========================================
// ADMIN PAGES
// ==========================================
import Dashboard from "./pages/Dashboard";
import AdminPage from "./pages/AdminPage";
import AdminLogin from "./pages/AdminLogin";

// ==========================================
// ADMIN COMPONENTS
// ==========================================
import Students from "./components/Students";
import Logs from "./components/Logs";
import AddStudent from "./components/AddNewStudent";
import StudentProfile from "./components/StudentProfile";
import EditStudent from "./components/EditStudent";

// ==========================================
// PROTECTED ROUTE
// ==========================================
import ProtectedRoute from "./components/ProtectedRoutes";

// ==========================================
// PARKING CLEANUP
// ==========================================
import {
  cleanupParkingSessions,
  startMidnightCleanup,
} from "./utils/parkingCleanup";


const App = () => {

  // ==========================================
  // PARKING SESSION CLEANUP
  // ==========================================
  useEffect(() => {

    // App open hone par stale sessions check
    cleanupParkingSessions();

    // Exact 12:00 AM cleanup schedule
    const timer = startMidnightCleanup();

    return () => {
      clearTimeout(timer);
    };

  }, []);


  return (
    <BrowserRouter>

      <Routes>

        {/* ======================================
            DEFAULT ROUTE
        ====================================== */}

        <Route
          path="/"
          element={
            <Navigate
              to="/buttons"
              replace
            />
          }
        />


        {/* ======================================
            WATCHMAN MODULE
        ====================================== */}

        <Route
          path="/buttons"
          element={<Buttons />}
        />

        <Route
          path="/entry"
          element={<EntryGate />}
        />

        <Route
          path="/exit"
          element={<ExitGate />}
        />


        {/* ======================================
            ADMIN LOGIN
            PUBLIC ROUTE
        ====================================== */}

        <Route
          path="/admin-login"
          element={<AdminLogin />}
        />


        {/* ======================================
            PROTECTED ADMIN MODULE
        ====================================== */}

        <Route element={<ProtectedRoute />}>

          {/* ====================================
              ADMIN LAYOUT
          ==================================== */}

          <Route element={<AdminPage />}>

            {/* ==================================
                DASHBOARD / OVERVIEW
            ================================== */}

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />


            {/* ==================================
                STUDENTS
            ================================== */}

            <Route
              path="/students"
              element={<Students />}
            />

            <Route
              path="/students/:enrollment"
              element={<StudentProfile />}
            />

            <Route
              path="/students/:enrollment/edit"
              element={<EditStudent />}
            />


            {/* ==================================
                LOGS
            ================================== */}

            <Route
              path="/logs"
              element={<Logs />}
            />


            {/* ==================================
                ADD STUDENT
            ================================== */}

            <Route
              path="/add-student"
              element={<AddStudent />}
            />


            {/* ==================================
                NOTIFICATIONS
            ================================== */}

            {/* 
            <Route
              path="/notifications"
              element={<Notifications />}
            />
            */}

          </Route>

        </Route>

      </Routes>


      {/* ========================================
          TOAST
      ======================================== */}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
      />

    </BrowserRouter>
  );
};

export default App;