import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {/* O Outlet é onde as páginas (Dashboard, Doctors) vão aparecer */}
          <Outlet />
        </div>
      </div>
    </div>
  );
}
