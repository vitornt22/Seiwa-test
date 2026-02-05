import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  // Busca o token que você salvou no momento do login
  const token = localStorage.getItem("access_token");

  // Se NÃO existir token, redireciona para o login
  // O "replace" impede que o usuário volte para a rota protegida ao clicar em "voltar"
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Se existir, o Outlet renderiza o componente filho (Dashboard, Doctors, etc.)
  return <Outlet />;
}
