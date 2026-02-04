import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64flex-1 p-6 bg-zinc-100 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
