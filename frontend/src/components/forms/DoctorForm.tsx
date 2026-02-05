import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { Doctor } from "../../types/api.types";

export type DoctorFormProps = {
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: Doctor | null; // Adicionado suporte a dados iniciais
};

export default function DoctorForm({
  onClose,
  onSubmit,
  initialData,
}: DoctorFormProps) {
  const [loading, setLoading] = useState(false);

  // Inicializando o RHF com valores iniciais se existirem
  const { register, handleSubmit, reset } = useForm<Doctor>({
    defaultValues: initialData || {
      name: "",
      crm: "",
      specialty: "",
    },
  });

  // Sempre que o initialData mudar (abrir para editar outro médico), resetamos o form
  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({ name: "", crm: "", specialty: "" });
    }
  }, [initialData, reset]);

  const onSubmitForm: SubmitHandler<Doctor> = async (data) => {
    setLoading(true);
    try {
      // Enviamos os dados. Se for edição, o objeto já contém o ID original via RHF
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-scaleUp">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {initialData ? "Editar Médico" : "Novo Médico"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Nome Completo *
            </label>
            <input
              type="text"
              {...register("name", { required: "O nome é obrigatório" })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Ex: Dr. Vitor Neto"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              CRM *
            </label>
            <input
              type="text"
              {...register("crm", { required: "O CRM é obrigatório" })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="000000-PI"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Especialidade *
            </label>
            <input
              type="text"
              {...register("specialty", {
                required: "A especialidade é obrigatória",
              })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Ex: Sistemas de Informação"
            />
          </div>

          <div className="flex gap-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md shadow-blue-200 disabled:opacity-50 disabled:shadow-none"
            >
              {loading
                ? "Processando..."
                : initialData
                  ? "Atualizar"
                  : "Cadastrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
