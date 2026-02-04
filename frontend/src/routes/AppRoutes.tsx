import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import DashboardLayout from "../layouts/DashboardLayout";
import Doctors from "../pages/Doctor";
import Hospitals from "../pages/Hospital";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/users" element={<Doctors />} />
        <Route path="/users" element={<Hospitals />} />
      </Route>
    </Routes>
  );
}
