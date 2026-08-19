import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { useEffect } from "react";








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


const App = () => {

  // ==========================================
  // PARKING SESSION CLEANUP
  // ==========================================



  return (
    <BrowserRouter>

      <Routes>

        {/* ======================================
            DEFAULT ROUTE
        ====================================== */}

       


        {/* ======================================
            WATCHMAN MODULE
        ====================================== */}

      

        {/* ======================================
            ADMIN LOGIN
            PUBLIC
        ====================================== */}



        {/* ======================================
            PROTECTED ADMIN MODULE
        ====================================== */}

        


        {/* ======================================
            STUDENT LOGIN
            PUBLIC
        ====================================== */}

        <Route
          path="/"
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

     
    </BrowserRouter>
  );
};

export default App;