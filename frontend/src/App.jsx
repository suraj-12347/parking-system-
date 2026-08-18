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
// ADMIN PROTECTED ROUTE
// ==========================================

import ProtectedRoute from "./components/ProtectedRoutes";

// ==========================================
// STUDENT PAGES
// ==========================================

import StudentLogin from "./pages/student/StudentLogin";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentEnter from "./pages/student/StudentEnter";

// Future pages
// import StudentLogs from "./pages/student/StudentLogs";
// import StudentProfilePage from "./pages/student/StudentProfile";

// ==========================================
// STUDENT PROTECTED ROUTE
// ==========================================

import StudentPrivateRoute from "./components/StudentPrivateRoute";

// ==========================================
// PARKING CLEANUP
// ==========================================

import {
  cleanupParkingSessions,
  startMidnightCleanup,
} from "./utils/parkingCleanup";


// ==========================================
// APP
// ==========================================

const App = () => {

  // ==========================================
  // PARKING SESSION CLEANUP
  // ==========================================

  useEffect(() => {

    // App open hone par stale sessions check
    cleanupParkingSessions();

    // Exact midnight cleanup
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
            PUBLIC
        ====================================== */}

        <Route
          path="/admin-login"
          element={<AdminLogin />}
        />


        {/* ======================================
            PROTECTED ADMIN MODULE
        ====================================== */}

        <Route element={<ProtectedRoute />}>

          {/* ADMIN LAYOUT */}

          <Route
            element={<AdminPage />}
          >

            {/* ==================================
                ADMIN DASHBOARD
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


        {/* ======================================
            STUDENT LOGIN
            PUBLIC
        ====================================== */}

        <Route
          path="/student/login"
          element={<StudentLogin />}
        />


        {/* ======================================
            PROTECTED STUDENT MODULE
        ====================================== */}

        <Route
          element={<StudentPrivateRoute />}
        >

          {/* ==================================
              STUDENT LAYOUT
          ================================== */}

          <Route
            path="/student"
            element={<StudentDashboard />}
          >

            {/* ==================================
                DEFAULT STUDENT PAGE

                /student
                    ↓
                /student/enter
            ================================== */}

            <Route
              index
              element={
                <Navigate
                  to="enter"
                  replace
                />
              }
            />


            {/* ==================================
                STUDENT ENTER
            ================================== */}

            <Route
              path="enter"
              element={<StudentEnter />}
            />


            {/* ==================================
                STUDENT LOGS
            ================================== */}

            {/*
            <Route
              path="logs"
              element={<StudentLogs />}
            />
            */}


            {/* ==================================
                STUDENT PROFILE
            ================================== */}

            {/*
            <Route
              path="profile"
              element={<StudentProfilePage />}
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