import { useNavigate, useLocation } from "react-router-dom";
import logoImg from "../assets/images/logo.png";
import {
  LayoutDashboard,
  UserRound,
  Building2,
  TrendingUp,
  DollarSign,
  LogOut, // Ícone de saída
} from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/doctors", label: "Médicos", icon: UserRound },
    { path: "/hospitals", label: "Hospitais", icon: Building2 },
    { path: "/productions", label: "Produções", icon: TrendingUp },
    { path: "/transfers", label: "Repasses", icon: DollarSign },
  ];

  // Função de Logout
  const handleLogout = () => {
    // 1. Limpa os tokens do navegador
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    // 2. Redireciona para a tela de login
    // O 'replace: true' impede que o usuário volte ao dashboard clicando em "voltar" no browser
    navigate("/login", { replace: true });
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col">
      <div className="p-6 border-b border-gray-200 flex flex-col items-center">
        <img
          src={logoImg}
          alt="Sistema Financeiro Logo"
          className="h-20 w-auto object-contain" // Ajuste a altura (h-12) conforme o tamanho do seu logo
        />
        <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mt-2">
          Sistema Financeiro
        </p>
      </div>

      {/* Navegação Principal - flex-1 faz ele ocupar o espaço restante */}
      <nav className="p-4 space-y-1 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
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

      {/* Botão de Logout fixo no rodapé */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors group"
        >
          <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          <span className="font-medium">Sair do sistema</span>
        </button>
      </div>
    </div>
  );
}
