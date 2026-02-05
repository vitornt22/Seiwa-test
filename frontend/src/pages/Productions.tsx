import { useState, useEffect } from "react";
import { Plus, Search, Trash2, Edit3, Filter } from "lucide-react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Table from "../components/Table";
import Loading from "../components/Loading";
import { productionsAPI, doctorsAPI, hospitalsAPI } from "../services/api";
import {
  formatCurrency,
  formatDate,
  formatDateTime,
} from "../utils/formatters";
import ProductionForm from "../components/forms/ProductionForm";
import type {
  Doctor,
  Hospital,
  ListFilters,
  Production,
} from "../types/api.types";
import Filters from "../components/Filters";

const MySwal = withReactContent(Swal);

export default function Productions() {
  const [productions, setProductions] = useState<Production[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduction, setEditingProduction] = useState<Production | null>(
    null,
  );

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
      MySwal.fire("Erro", "Falha ao carregar médicos ou hospitais.", "error");
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

  const handleSubmit = async (data: any) => {
    try {
      if (editingProduction) {
        await productionsAPI.update(editingProduction.id, data);
        MySwal.fire({
          title: "Produção atualizada!",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        await productionsAPI.create(data);
        MySwal.fire({
          title: "Produção registrada!",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }
      setShowForm(false);
      setEditingProduction(null);
      await loadProductions();
    } catch (error) {
      MySwal.fire("Erro", "Erro ao processar a produção.", "error");
    }
  };

  const handleDelete = async (production: Production) => {
    MySwal.fire({
      title: "Excluir esta produção?",
      text: "Isso afetará o saldo total e os repasses do médico!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sim, excluir",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await productionsAPI.delete(production.id);
          setProductions(productions.filter((p) => p.id !== production.id));
          MySwal.fire("Excluída!", "A produção foi removida.", "success");
        } catch (error) {
          MySwal.fire("Erro", "Não foi possível excluir o registro.", "error");
        }
      }
    });
  };

  const handleEdit = (production: Production) => {
    setEditingProduction(production);
    setShowForm(true);
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
      header: "Médico",
      render: (row: any) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">
            {getDoctorName(row.doctor)}
          </span>
          <span className="text-[10px] text-gray-400 font-mono uppercase tracking-tighter">
            ID: {row.id.slice(0, 8)}
          </span>
        </div>
      ),
    },
    {
      header: "Hospital",
      render: (row: any) => (
        <span className="text-gray-600 italic text-sm">
          {getHospitalName(row.hospital)}
        </span>
      ),
    },
    {
      header: "Valor",
      render: (row: any) => (
        <span className="font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
          {formatCurrency(row.amount)}
        </span>
      ),
    },
    {
      header: "Data de Produção",
      render: (row: any) => formatDate(row.production_date),
    },
    {
      header: "Ações",
      render: (row: Production) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEdit(row)}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Editar Produção"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(row)}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Excluir Produção"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Produções
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Lance e acompanhe a produção financeira por médico e hospital.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingProduction(null);
            setShowForm(true);
          }}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md shadow-blue-100 transition-all font-semibold"
        >
          <Plus className="w-5 h-5" />
          Nova Produção
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 mb-4 text-gray-700 font-medium">
          <Filter className="w-4 h-4" />
          <span>Filtros de busca</span>
        </div>
        <Filters
          filters={filters}
          onFilterChange={setFilters}
          doctors={doctors}
          hospitals={hospitals}
        />
      </div>

      {loading ? (
        <Loading />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <Table
            columns={columns as any}
            data={productions}
            emptyMessage="Nenhuma produção encontrada para os filtros selecionados"
          />
        </div>
      )}

      {showForm && (
        <ProductionForm
          onClose={() => {
            setShowForm(false);
            setEditingProduction(null);
          }}
          onSubmit={handleSubmit}
          initialData={editingProduction} // Suporte para preenchimento automático na edição
        />
      )}
    </div>
  );
}
