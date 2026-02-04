import { useState, useEffect } from "react";
import { Plus, UserRound } from "lucide-react";
import Loading from "../components/Loading";
import DoctorForm from "../components/DoctorForm";
import { doctorsAPI } from "../services/api";
import { formatDateTime } from "../utils/formatters";
import type { Doctor } from "../types/api.types";
import Table from "../components/Table";

export default function Doctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    setLoading(true);
    try {
      const data = await doctorsAPI.getAll();
      setDoctors(data);
    } catch (error) {
      console.error("Error loading doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: Doctor) => {
    await doctorsAPI.create(data);
    await loadDoctors();
  };

  const columns = [
    {
      header: "Nome",
      render: (row: any) => (
        <div className="flex items-center gap-2">
          <UserRound className="w-4 h-4 text-gray-400" />
          <span className="font-medium">{row.name}</span>
        </div>
      ),
    },
    {
      header: "CRM",
      accessor: "crm",
    },
    {
      header: "Especialidade",
      accessor: "specialty",
    },
    {
      header: "Cadastrado em",
      render: (row: any) => formatDateTime(row.created_at),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Médicos</h1>
          <p className="text-gray-600 mt-1">
            Gerencie os médicos cadastrados no sistema
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo Médico
        </button>
      </div>

      {loading ? (
        <Loading />
      ) : (
        <Table
          columns={columns}
          data={doctors}
          emptyMessage="Nenhum médico cadastrado"
        />
      )}

      {showForm && (
        <DoctorForm
          onClose={() => setShowForm(false)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
