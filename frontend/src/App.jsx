
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import EntryGate from "./pages/EntryGate";
import ExitGate from "./pages/ExitGate";
import Buttons from "./pages/Buttons";

import Dashboard from "./pages/Dashboard";
import Students from "./components/Students";
import Logs from "./components/Logs";
import AddStudent from "./components/AddNewStudent";
// import Notifications from "./pages/Notifications";
import StudentProfile from "./components/StudentProfile";
import EditStudent from "./components/EditStudent";

import AdminPage from "./pages/AdminPage";

import {
  cleanupParkingSessions,
  startMidnightCleanup,
} from "./utils/parkingCleanup";

const App = () => {

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

        {/* Default */}
        <Route
          path="/"
          element={<Navigate to="/buttons" replace />}
        />

        {/* Watchman Buttons */}
        <Route
          path="/buttons"
          element={<Buttons />}
        />

        {/* Entry Gate */}
        <Route
          path="/entry"
          element={<EntryGate />}
        />

        {/* Exit Gate */}
        <Route
          path="/exit"
          element={<ExitGate />}
        />
         {/* <Route
          path="/admin"
          element={<AdminPage />}
        /> */}
        


        {/* ================= ADMIN PANEL ================= */}

        <Route  element={<AdminPage />}>

          {/* Overview */}
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          {/* Students */}
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

          {/* Logs */}
          <Route
            path="/logs"
            element={<Logs />}
          />
           <Route
            path="/add-student"
            element={<AddStudent />}
          />


          {/* Notifications */}
          {/* <Route
            path="/notifications"
            element={<Notifications />}
          /> */}

        </Route>

      </Routes>

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
