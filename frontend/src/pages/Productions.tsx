import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import Table from "../components/Table";
import Loading from "../components/Loading";
import { productionsAPI, doctorsAPI, hospitalsAPI } from "../services/api";
import {
  formatCurrency,
  formatDate,
  formatDateTime,
} from "../utils/formatters";
import ProductionForm from "../components/ProductionForm";
import type {
  Doctor,
  Hospital,
  ListFilters,
  Production,
} from "../types/api.types";
import Filters from "../components/Filters";

export default function Productions() {
  const [productions, setProductions] = useState<Production[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState<ListFilters>({
    doctor: "",
    hospital: "",
    start_date: "",
    end_date: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadProductions();
  }, [filters]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [doctorsData, hospitalsData] = await Promise.all([
        doctorsAPI.getAll(),
        hospitalsAPI.getAll(),
      ]);
      setDoctors(doctorsData);
      setHospitals(hospitalsData);
      await loadProductions();
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadProductions = async () => {
    try {
      const data = await productionsAPI.getAll(filters);
      setProductions(data);
    } catch (error) {
      console.error("Error loading productions:", error);
    }
  };

  const handleSubmit = async (data: Production) => {
    await productionsAPI.create(data);
    await loadProductions();
  };

  const getDoctorName = (doctorId: string) => {
    const doctor = doctors.find((d) => d.id === doctorId);
    return doctor ? doctor.name : "N/A";
  };

  const getHospitalName = (hospitalId: string) => {
    const hospital = hospitals.find((h) => h.id === hospitalId);
    return hospital ? hospital.name : "N/A";
  };

  const columns = [
    {
      header: "ID",
      accessor: "id",
      render: (row: any) => (
        <span className="font-mono text-xs text-gray-500">
          {row.id.slice(0, 8)}
        </span>
      ),
    },
    {
      header: "Médico",
      render: (row: any) => getDoctorName(row.doctor),
    },
    {
      header: "Hospital",
      render: (row: any) => getHospitalName(row.hospital),
    },
    {
      header: "Valor",
      render: (row: any) => (
        <span className="font-semibold text-green-600">
          {formatCurrency(row.amount)}
        </span>
      ),
    },
    {
      header: "Data da Produção",
      render: (row: any) => formatDate(row.production_date),
    },
    {
      header: "Registrado em",
      render: (row: any) => formatDateTime(row.created_at),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Produções</h1>
          <p className="text-gray-600 mt-1">
            Gerencie as produções registradas no sistema
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nova Produção
        </button>
      </div>

      <Filters
        filters={filters}
        onFilterChange={setFilters}
        doctors={doctors}
        hospitals={hospitals}
      />

      {loading ? (
        <Loading />
      ) : (
        <Table
          columns={columns}
          data={productions}
          emptyMessage="Nenhuma produção registrada"
        />
      )}

      {showForm && (
        <ProductionForm
          onClose={() => setShowForm(false)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
