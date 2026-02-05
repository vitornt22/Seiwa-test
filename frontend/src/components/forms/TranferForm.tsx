import { useEffect, useState } from "react";
import { X, DollarSign } from "lucide-react";
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { doctorsAPI, hospitalsAPI } from "../../services/api";
import type { Hospital, Doctor, Transfer } from "../../types/api.types";

export type TransferFormProps = {
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: Transfer | null; // Adicionado suporte para edição
};

export default function TransferForm({
  onClose,
  onSubmit,
  initialData,
}: TransferFormProps) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, reset } = useForm<
    Omit<Transfer, "id" | "created_at">
  >({
    defaultValues: {
      doctor: "",
      hospital: "",
      amount: 0,
      transfer_date: "",
    },
  });

  // Carrega médicos e hospitais
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
        console.error("Erro ao carregar dados:", error);
      }
    };
    loadData();
  }, []);

  // Efeito para resetar o form quando for edição ou novo
  useEffect(() => {
    if (initialData) {
      reset({
        doctor: initialData.doctor,
        hospital: initialData.hospital,
        amount: initialData.amount,
        transfer_date: initialData.transfer_date,
      });
    } else {
      reset({
        doctor: "",
        hospital: "",
        amount: 0,
        transfer_date: "",
      });
    }
  }, [initialData, reset]);

  const onSubmitForm: SubmitHandler<
    Omit<Transfer, "id" | "created_at">
  > = async (data) => {
    setLoading(true);
    try {
      // Se tiver initialData, incluímos o ID no envio para a API saber que é um update
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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-scaleUp border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              {initialData ? "Editar Repasse" : "Novo Repasse"}
            </h2>
          </div>
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
            rules={{ required: "Selecione o médico" }}
            render={({ field, fieldState }) => (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Médico Beneficiário *
                </label>
                <select
                  {...field}
                  className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all appearance-none bg-gray-50 ${
                    fieldState.error ? "border-red-500" : "border-gray-200"
                  }`}
                >
                  <option value="">Selecione o médico...</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name}
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
            rules={{ required: "Selecione o hospital" }}
            render={({ field, fieldState }) => (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Hospital de Origem *
                </label>
                <select
                  {...field}
                  className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all appearance-none bg-gray-50 ${
                    fieldState.error ? "border-red-500" : "border-gray-200"
                  }`}
                >
                  <option value="">Selecione o hospital...</option>
                  {hospitals.map((hospital) => (
                    <option key={hospital.id} value={hospital.id}>
                      {hospital.name}
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
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Valor do Repasse (R$) *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                    R$
                  </span>
                  <input
                    {...field}
                    type="number"
                    step="0.01"
                    className={`w-full pl-12 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all ${
                      fieldState.error ? "border-red-500" : "border-gray-200"
                    }`}
                    placeholder="0,00"
                  />
                </div>
              </div>
            )}
          />

          {/* Data */}
          <Controller
            name="transfer_date"
            control={control}
            rules={{ required: "A data é obrigatória" }}
            render={({ field, fieldState }) => (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Data do Pagamento *
                </label>
                <input
                  {...field}
                  type="date"
                  className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all ${
                    fieldState.error ? "border-red-500" : "border-gray-200"
                  }`}
                />
              </div>
            )}
          />

          <div className="flex gap-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-gray-600 font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 disabled:opacity-50"
            >
              {loading
                ? "Processando..."
                : initialData
                  ? "Confirmar Edição"
                  : "Registrar Repasse"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
