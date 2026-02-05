import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Seiwa Login
        </h2>
        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            {...register("username", { required: true })}
            placeholder="Usuário"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            {...register("password", { required: true })}
            type="password"
            placeholder="Senha"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
