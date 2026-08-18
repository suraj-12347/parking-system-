import { Outlet } from "react-router-dom";

import StudentNav from "../../components/StudentNav";
import StudentHeader from "../../components/StudentHeader";

const StudentDashboard = () => {
  return (
    <div className="min-h-screen bg-white fixed top-0 left-0 right-0 overflow-x-hidden">

      {/* ======================================
          MAIN CONTENT
      ====================================== */}
      <StudentHeader/>

      <main className="min-h-screen pb-28">
        <Outlet />
      </main>

      {/* ======================================
          STUDENT BOTTOM NAV
      ====================================== */}

      <StudentNav />

    </div>
  );
};

export default StudentDashboard;