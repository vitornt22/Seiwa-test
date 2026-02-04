import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { doctorsAPI, hospitalsAPI } from "../../services/api";
import type { Hospital, Doctor, Transfer } from "../../types/api.types";

export type TransferFormProps = {
  onClose: () => void;
  onSubmit: (data: Transfer) => Promise<void>;
};

export default function TransferForm({ onClose, onSubmit }: TransferFormProps) {
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

  useEffect(() => {
    const loadData = async () => {
      const [doctorsData, hospitalsData] = await Promise.all([
        doctorsAPI.getAll(),
        hospitalsAPI.getAll(),
      ]);
      setDoctors(doctorsData);
      setHospitals(hospitalsData);
    };
    loadData();
  }, []);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const onSubmitForm: SubmitHandler<
    Omit<Transfer, "id" | "created_at">
  > = async (data) => {
    setLoading(true);
    try {
      const transfer: Transfer = {
        ...data,
        id: generateId(),
        created_at: new Date().toISOString(),
      };
      await onSubmit(transfer);
      reset(); // limpa o form
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
          <h2 className="text-xl font-semibold text-gray-900">Novo Repasse</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
          {/* Médico */}
          <Controller
            name="doctor"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Médico *
                </label>
                <select
                  {...field}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione...</option>
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
            rules={{ required: true }}
            render={({ field }) => (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hospital *
                </label>
                <select
                  {...field}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione...</option>
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
            rules={{ required: true, min: 0 }}
            render={({ field }) => (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valor *
                </label>
                <input
                  {...field}
                  type="number"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>
            )}
          />

          {/* Data */}
          <Controller
            name="transfer_date"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data do Repasse *
                </label>
                <input
                  {...field}
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          />

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
