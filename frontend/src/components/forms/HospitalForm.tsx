import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { Hospital } from "../../types/api.types";

export type HospitalFormProps = {
  onClose: () => void;
  onSubmit: (hospital: any) => Promise<void>;
  initialData?: Hospital | null; // Adicionado suporte a dados iniciais
};

export default function HospitalForm({
  onClose,
  onSubmit,
  initialData,
}: HospitalFormProps) {
  const [loading, setLoading] = useState(false);

  // React Hook Form com valores padrão condicionais
  const { register, handleSubmit, reset } = useForm<Hospital>({
    defaultValues: initialData || {
      name: "",
      code: "",
    },
  });

  // Atualiza o formulário sempre que o initialData mudar (abrir/fechar edição)
  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({ name: "", code: "" });
    }
  }, [initialData, reset]);

  const onSubmitForm: SubmitHandler<Hospital> = async (data) => {
    setLoading(true);
    try {
      // Se for edição, o "data" já trará o ID original por conta do reset(initialData)
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
            {initialData ? "Editar Hospital" : "Novo Hospital"}
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
              Nome do Hospital *
            </label>
            <input
              type="text"
              {...register("name", { required: "O nome é obrigatório" })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Ex: Hospital Regional"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Código / CNPJ *
            </label>
            <input
              type="text"
              {...register("code", { required: "O código é obrigatório" })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Ex: HRP001"
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
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md shadow-blue-200 disabled:opacity-50"
            >
              {loading
                ? "Processando..."
                : initialData
                  ? "Atualizar"
                  : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
