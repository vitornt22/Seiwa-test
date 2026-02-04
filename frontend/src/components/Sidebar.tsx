import {
  LayoutDashboard,
  UserRound,
  Building2,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const menuItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/doctors", label: "Médicos", icon: UserRound },
  { to: "/hospitals", label: "Hospitais", icon: Building2 },
  { to: "/productions", label: "Produções", icon: TrendingUp },
  { to: "/transfers", label: "Repasses", icon: DollarSign },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">Sistema Financeiro</h1>
        <p className="text-sm text-gray-600 mt-1">Médico</p>
      </div>

      {/* Menu */}
      <nav className="p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `
                flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                ${
                  isActive
                    ? "bg-blue-50 text-blue-600 font-medium shadow-sm"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }
              `
              }
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
