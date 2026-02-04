import { useState, useEffect } from "react";
import { Plus, Building2 } from "lucide-react";
import Table from "../components/Table";
import Loading from "../components/Loading";
import { hospitalsAPI } from "../services/api";
import { formatDateTime } from "../utils/formatters";
import type { Hospital } from "../types/api.types";
import HospitalForm from "../components/HospitalForm";

export default function Hospitals() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadHospitals();
  }, []);

  const loadHospitals = async () => {
    setLoading(true);
    try {
      const data = await hospitalsAPI.getAll();
      setHospitals(data);
    } catch (error) {
      console.error("Error loading hospitals:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: Hospital) => {
    await hospitalsAPI.create(data);
    await loadHospitals();
  };

  const columns = [
    {
      header: "Nome",
      render: (row: any) => (
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-gray-400" />
          <span className="font-medium">{row.name}</span>
        </div>
      ),
    },
    {
      header: "Código",
      accessor: "code",
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
          <h1 className="text-2xl font-semibold text-gray-900">Hospitais</h1>
          <p className="text-gray-600 mt-1">
            Gerencie os hospitais cadastrados no sistema
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo Hospital
        </button>
      </div>

      {loading ? (
        <Loading />
      ) : (
        <Table
          columns={columns}
          data={hospitals}
          emptyMessage="Nenhum hospital cadastrado"
        />
      )}

      {showForm && (
        <HospitalForm
          onClose={() => setShowForm(false)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
