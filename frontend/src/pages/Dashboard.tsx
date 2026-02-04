import { useState, useEffect } from "react";
import { TrendingUp, DollarSign, Wallet } from "lucide-react";
import SummaryCard from "../components/SummaryCard";
import { doctorsAPI } from "../services/api";
import Loading from "../components/Loading";
import { formatCurrency } from "../utils/formatters";
import type { Doctor, FinancialSummary } from "../types/api.types";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [dateFilters, setDateFilters] = useState({
    start_date: "",
    end_date: "",
  });

  useEffect(() => {
    loadDoctors();
  }, []);

  useEffect(() => {
    if (selectedDoctor) {
      loadSummary();
    }
  }, [selectedDoctor, dateFilters]);

  const loadDoctors = async () => {
    try {
      const data = await doctorsAPI.getAll();
      setDoctors(data);
      if (data.length > 0) {
        setSelectedDoctor(data[0].id);
      }
    } catch (error) {
      console.error("Error loading doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadSummary = async () => {
    if (!selectedDoctor) return;
    try {
      const data = await doctorsAPI.getFinancialSummary(
        selectedDoctor,
        dateFilters.start_date,
        dateFilters.end_date,
      );
      setSummary(data);
    } catch (error) {
      console.error("Error loading summary:", error);
    }
  };

  if (loading) {
    return <Loading message="Carregando dashboard..." />;
  }

  if (doctors.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
        <p className="text-gray-500">
          Nenhum médico cadastrado. Cadastre um médico para começar.
        </p>
      </div>
    );
  }

  const selectedDoctorData = doctors.find((d) => d.id === selectedDoctor);

  return (
    <div className="space-y-6 bg-black">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selecione o Médico
            </label>
            <select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name} - {doctor.specialty}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data Inicial
            </label>
            <input
              type="date"
              value={dateFilters.start_date}
              onChange={(e) =>
                setDateFilters({ ...dateFilters, start_date: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data Final
            </label>
            <input
              type="date"
              value={dateFilters.end_date}
              onChange={(e) =>
                setDateFilters({ ...dateFilters, end_date: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {selectedDoctorData && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {selectedDoctorData.name}
          </h3>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>{selectedDoctorData.crm}</span>
            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
            <span>{selectedDoctorData.specialty}</span>
          </div>
        </div>
      )}

      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SummaryCard
            title="Total Produzido"
            value={formatCurrency(summary.total_produced)}
            icon={TrendingUp}
            color="blue"
          />
          <SummaryCard
            title="Total Repassado"
            value={formatCurrency(summary.total_transferred)}
            icon={DollarSign}
            color="green"
          />
          <SummaryCard
            title="Saldo"
            value={formatCurrency(summary.balance)}
            icon={Wallet}
            color="orange"
          />
        </div>
      )}
    </div>
  );
}
