import React from "react";
import { Outlet } from "react-router-dom";

import AdminSidebar from "../components/Sidebar";
import AdminBottomNav from "../components/MobileNav";

const AdminPage = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">

      {/* Desktop Sidebar */}
      <div className="hidden h-screen shrink-0 lg:block">
        <AdminSidebar />
      </div>

      {/* Main Content */}
      <main className="min-w-0 flex-1 overflow-y-auto pb-20 lg:pb-0">
        <Outlet />
      </main>

      {/* Mobile + Tablet Bottom Navigation */}
      <div className="lg:hidden">
        <AdminBottomNav />
      </div>

    </div>
  );
};

export default AdminPage;