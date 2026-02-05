import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { doctorsAPI, hospitalsAPI } from "../../services/api";
import type { Doctor, Hospital, Production } from "../../types/api.types";

export type ProductionFormProps = {
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: Production | null; // Adicionado suporte para edição
};

export default function ProductionForm({
  onClose,
  onSubmit,
  initialData,
}: ProductionFormProps) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, reset } = useForm<
    Omit<Production, "id" | "created_at">
  >({
    defaultValues: {
      doctor: "",
      hospital: "",
      amount: 0,
      production_date: "",
    },
  });

  // Carrega médicos e hospitais para os selects
  useEffect(() => {
    const loadData = async () => {
      try {
        const [doctorsData, hospitalsData] = await Promise.all([
          doctorsAPI.getAll(),
          hospitalsAPI.getAll(),
        ]);
        setDoctors(doctorsData);
        setHospitals(hospitalsData);
      } catch (error) {
        console.error("Erro ao carregar dependências:", error);
      }
    };
    loadData();
  }, []);

  // Sincroniza o formulário quando entra em modo de edição
  useEffect(() => {
    if (initialData) {
      reset({
        doctor: initialData.doctor,
        hospital: initialData.hospital,
        amount: initialData.amount,
        production_date: initialData.production_date,
      });
    } else {
      reset({
        doctor: "",
        hospital: "",
        amount: 0,
        production_date: "",
      });
    }
  }, [initialData, reset]);

  const onSubmitForm: SubmitHandler<
    Omit<Production, "id" | "created_at">
  > = async (data) => {
    setLoading(true);
    try {
      // Se for edição, garantimos que o ID seja mantido no objeto enviado
      const payload = initialData ? { ...data, id: initialData.id } : data;
      await onSubmit(payload);
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
            {initialData ? "Editar Produção" : "Nova Produção"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
          {/* Médico */}
          <Controller
            name="doctor"
            control={control}
            rules={{ required: "Selecione um médico" }}
            render={({ field, fieldState }) => (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Médico *
                </label>
                <select
                  {...field}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                    fieldState.error ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Selecione um médico...</option>
                  {doctors.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          />

          {/* Hospital */}
          <Controller
            name="hospital"
            control={control}
            rules={{ required: "Selecione um hospital" }}
            render={({ field, fieldState }) => (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Hospital *
                </label>
                <select
                  {...field}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                    fieldState.error ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Selecione um hospital...</option>
                  {hospitals.map((hosp) => (
                    <option key={hosp.id} value={hosp.id}>
                      {hosp.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          />

          {/* Valor */}
          <Controller
            name="amount"
            control={control}
            rules={{ required: "Informe o valor", min: 0.01 }}
            render={({ field, fieldState }) => (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Valor da Produção *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                    R$
                  </span>
                  <input
                    {...field}
                    type="number"
                    step="0.01"
                    className={`w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                      fieldState.error ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="0,00"
                  />
                </div>
              </div>
            )}
          />

          {/* Data */}
          <Controller
            name="production_date"
            control={control}
            rules={{ required: "Selecione a data" }}
            render={({ field, fieldState }) => (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Data *
                </label>
                <input
                  {...field}
                  type="date"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                    fieldState.error ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>
            )}
          />

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
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-200 disabled:opacity-50"
            >
              {loading
                ? "Processando..."
                : initialData
                  ? "Atualizar"
                  : "Salvar Produção"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
