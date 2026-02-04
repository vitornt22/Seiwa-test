import { useState } from "react";
import { X } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { Doctor } from "../../types/api.types";

export type DoctorFormProps = {
  onClose: () => void;
  onSubmit: (data: Doctor) => Promise<void>;
};

export default function DoctorForm({ onClose, onSubmit }: DoctorFormProps) {
  const [loading, setLoading] = useState(false);

  // Inicializando o RHF
  const { register, handleSubmit, reset } = useForm<Doctor>({
    defaultValues: {
      name: "",
      crm: "",
      specialty: "",
    },
  });

  // Função para gerar ID aleatório
  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Função de submit
  const onSubmitForm: SubmitHandler<Doctor> = async (data) => {
    setLoading(true);
    try {
      const doctorWithId: Doctor = {
        ...data,
        id: generateId(),
        created_at: new Date().toISOString(),
      };
      await onSubmit(doctorWithId);
      reset(); // Limpa o formulário
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Novo Médico</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome *
            </label>
            <input
              type="text"
              {...register("name", { required: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Dr. João Silva"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CRM *
            </label>
            <input
              type="text"
              {...register("crm", { required: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="CRM-SP 123456"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Especialidade *
            </label>
            <input
              type="text"
              {...register("specialty", { required: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Cardiologia"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
