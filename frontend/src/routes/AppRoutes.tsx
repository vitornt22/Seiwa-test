import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import DashboardLayout from "../layouts/DashboardLayout";
import Doctors from "../pages/Doctor";
import Hospitals from "../pages/Hospital";
import Productions from "../pages/Productions";
import Transfers from "../pages/Transfers";
import Login from "../pages/Login";
import ProtectedRoute from "../components/ProtectedRoutes";
export default function AppRoutes() {
  return (
    <Routes>
      {/* Rota Pública */}
      <Route path="/login" element={<Login />} />

      {/* Rotas Protegidas */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/hospitals" element={<Hospitals />} />
          <Route path="/productions" element={<Productions />} />
          <Route path="/transfers" element={<Transfers />} />
        </Route>
      </Route>

      {/* Fallback: Se não existir a rota, manda pro dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
