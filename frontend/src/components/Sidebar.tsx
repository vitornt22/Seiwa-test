import { useNavigate, useLocation } from "react-router-dom";
import logoImg from "../assets/images/logo.png";
import iconImg from "../assets/images/icon.png";
import Swal from "sweetalert2"; // 1. Importe o SweetAlert2

import {
  LayoutDashboard,
  UserRound,
  Building2,
  TrendingUp,
  DollarSign,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type SidebarProps = {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
};

export default function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/doctors", label: "Médicos", icon: UserRound },
    { path: "/hospitals", label: "Hospitais", icon: Building2 },
    { path: "/productions", label: "Produções", icon: TrendingUp },
    { path: "/transfers", label: "Repasses", icon: DollarSign },
  ];

  const handleLogout = () => {
    Swal.fire({
      title: "Deseja sair?",
      text: "Você precisará fazer login novamente para acessar o sistema.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2563eb", // Azul do seu sistema
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, sair",
      cancelButtonText: "Cancelar",
      reverseButtons: true, // Inverte a posição dos botões para o padrão moderno
    }).then((result: any) => {
      if (result.isConfirmed) {
        // 3. Executa a limpeza apenas se confirmado
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        navigate("/login", { replace: true });

        // Opcional: Toast de despedida
        Swal.fire({
          title: "Sessão encerrada!",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  return (
    <div
      className={`bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col transition-all duration-300 z-50 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Botão de Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-10 bg-white border border-gray-200 rounded-full p-1 hover:bg-gray-50 text-gray-500 shadow-sm"
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
      {/* Logo Area */}

      <div className="p-6 border-b border-gray-200 flex flex-col items-center overflow-hidden min-h-[140px] justify-center">
        <img
          // 2. Lógica para trocar a imagem baseada no estado
          src={isCollapsed ? iconImg : logoImg}
          alt="Logo"
          className={`transition-all duration-300 object-contain ${
            isCollapsed ? "h-10 w-10" : "h-20 w-auto"
          }`}
        />

        {!isCollapsed && (
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mt-2 whitespace-nowrap animate-fadeIn">
            Sistema Financeiro
          </p>
        )}
      </div>
      {/* Navegação */}
      <nav className="p-4 space-y-1 flex-1 overflow-x-hidden">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              title={isCollapsed ? item.label : ""} // Mostra tooltip se estiver encolhido
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative group ${
                isActive
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-5 h-5 min-w-[20px]" />
              <span
                className={`transition-all duration-300 whitespace-nowrap ${
                  isCollapsed
                    ? "opacity-0 translate-x-10 pointer-events-none"
                    : "opacity-100"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
      {/* Logout */}
      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout} // Chama a função com o alerta
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors group overflow-hidden"
        >
          <LogOut className="w-5 h-5 min-w-[20px] group-hover:translate-x-1 transition-transform" />
          <span
            className={`transition-all duration-300 whitespace-nowrap ${
              isCollapsed
                ? "opacity-0 translate-x-10 pointer-events-none"
                : "opacity-100"
            }`}
          >
            Sair do sistema
          </span>
        </button>
      </div>
    </div>
  );
}
