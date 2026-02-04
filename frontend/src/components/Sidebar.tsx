import {
  LayoutDashboard,
  UserRound,
  Building2,
  TrendingUp,
  DollarSign,
} from "lucide-react";

export type SidebarProps = {
  currentPage: string;
  onNavigate: React.Dispatch<React.SetStateAction<string>>;
};

export default function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "doctors", label: "Médicos", icon: UserRound },
    { id: "hospitals", label: "Hospitais", icon: Building2 },
    { id: "productions", label: "Produções", icon: TrendingUp },
    { id: "transfers", label: "Repasses", icon: DollarSign },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-blue-300 text-gray-900">
          Sistema Financeiro
        </h1>
        <p className="text-sm text-gray-600 mt-1">Médico</p>
      </div>

      <nav className="p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
