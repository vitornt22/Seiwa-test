import { useState, useEffect } from "react";
import { Plus, Building2, Search, Trash2, Edit3 } from "lucide-react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Table from "../components/Table";
import Loading from "../components/Loading";
import { hospitalsAPI } from "../services/api";
import { formatDateTime } from "../utils/formatters";
import type { Hospital } from "../types/api.types";
import HospitalForm from "../components/forms/HospitalForm";

const MySwal = withReactContent(Swal);

export default function Hospitals() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingHospital, setEditingHospital] = useState<Hospital | null>(null);

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
      MySwal.fire("Erro", "Falha ao carregar lista de hospitais.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      if (editingHospital) {
        await hospitalsAPI.update(editingHospital.id, data);
        MySwal.fire({
          title: "Hospital atualizado!",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        await hospitalsAPI.create(data);
        MySwal.fire({
          title: "Hospital cadastrado!",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }
      setShowForm(false);
      setEditingHospital(null);
      await loadHospitals();
    } catch (error) {
      MySwal.fire("Erro", "Erro ao salvar dados do hospital.", "error");
    }
  };

  const handleDelete = async (hospital: Hospital) => {
    MySwal.fire({
      title: `Excluir ${hospital.name}?`,
      text: "Todos os registros de produções deste hospital serão afetados!",
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
          await hospitalsAPI.delete(hospital.id);
          setHospitals(hospitals.filter((h) => h.id !== hospital.id));
          MySwal.fire("Excluído!", "Hospital removido com sucesso.", "success");
        } catch (error) {
          MySwal.fire("Erro", "Não foi possível excluir o hospital.", "error");
        }
      }
    });
  };

  const handleEdit = (hospital: Hospital) => {
    setEditingHospital(hospital);
    setShowForm(true);
  };

  const filteredHospitals = hospitals.filter(
    (h) =>
      h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.code?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const columns = [
    {
      header: "Nome do Hospital",
      render: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Building2 className="w-4 h-4 text-blue-600" />
          </div>
          <span className="font-semibold text-gray-900">{row.name}</span>
        </div>
      ),
    },
    {
      header: "Código/CNPJ",
      accessor: "code",
    },
    {
      header: "Data de Cadastro",
      render: (row: any) => formatDateTime(row.created_at),
    },
    {
      header: "Ações",
      render: (row: any) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEdit(row)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Editar Hospital"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(row)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Excluir Hospital"
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
            Hospitais
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Gerencie as unidades de saúde parceiras.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingHospital(null);
            setShowForm(true);
          }}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md shadow-blue-100 transition-all font-medium"
        >
          <Plus className="w-4 h-4" />
          Novo Hospital
        </button>
      </div>

      {/* Barra de Pesquisa */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Pesquisar hospital por nome ou código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
          />
        </div>
      </div>

      {loading ? (
        <Loading />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <Table
            columns={columns as any} // Cast 'as any' para evitar erro de compatibilidade de tipo do Doctor
            data={filteredHospitals}
            emptyMessage="Nenhum hospital encontrado"
          />
        </div>
      )}

      {showForm && (
        <HospitalForm
          onClose={() => {
            setShowForm(false);
            setEditingHospital(null);
          }}
          onSubmit={handleSubmit}
          initialData={editingHospital} // Passa os dados para o formulário preencher
        />
      )}
    </div>
  );
}
