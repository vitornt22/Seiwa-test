import { useState, useEffect } from "react"; // 1. Importe o useEffect
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import logoImg from "../assets/images/logo.png";
import background from "../assets/images/background.avif";

export default function Login() {
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // 2. Checagem automática ao carregar a página
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      // Se já existe token, manda direto pro dashboard sem nem mostrar o form
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const onSubmit = async (data: any) => {
    try {
      const res = await fetch("http://localhost:8004/api/auth/token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Credenciais inválidas");

      const { access, refresh } = await res.json();
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);

      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
  };
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background com logo */}
      <div
        className="absolute inset-0 bg-center bg-no-repeat bg-cover opacity-20"
        style={{ backgroundImage: `url(${background})` }}
      />

      {/* Overlay azul claro */}
      <div className="absolute inset-0 bg-blue-100/60" />

      {/* Card de login */}
      <div className="relative bg-white p-8 rounded-xl shadow-lg w-full max-w-sm z-10">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src={logoImg} alt="Logo" className="h-16 object-contain" />
        </div>

        {/* Título */}
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Login
        </h1>

        {/* Erro */}
        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            {...register("username", { required: true })}
            placeholder="Usuário"
            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            {...register("password", { required: true })}
            type="password"
            placeholder="Senha"
            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2.5 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
