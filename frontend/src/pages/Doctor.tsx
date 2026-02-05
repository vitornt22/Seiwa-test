import { useState, useEffect } from "react";
import { Plus, UserRound, Search, Trash2, Edit3 } from "lucide-react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Loading from "../components/Loading";
import DoctorForm from "../components/forms/DoctorForm";
import { doctorsAPI } from "../services/api";
import { formatDateTime } from "../utils/formatters";
import type { Doctor } from "../types/api.types";
import Table from "../components/Table";

const MySwal = withReactContent(Swal);

export default function Doctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Estado para controlar se estamos editando um médico existente
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);

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
      MySwal.fire("Erro", "Não foi possível carregar os médicos.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      if (editingDoctor) {
        // Lógica de Edição
        await doctorsAPI.update(editingDoctor.id, data);
        MySwal.fire({
          title: "Atualizado!",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        // Lógica de Criação
        await doctorsAPI.create(data);
        MySwal.fire({
          title: "Cadastrado!",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }
      setShowForm(false);
      setEditingDoctor(null);
      loadDoctors();
    } catch (error) {
      MySwal.fire("Erro", "Ocorreu um erro ao salvar os dados.", "error");
    }
  };

  const handleDelete = async (doctor: Doctor) => {
    MySwal.fire({
      title: `Excluir médico?`,
      text: `Tem certeza que deseja remover ${doctor.name}? Esta ação não pode ser desfeita.`,
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
          await doctorsAPI.delete(doctor.id);
          setDoctors(doctors.filter((d) => d.id !== doctor.id));
          MySwal.fire(
            "Excluído!",
            "O registro foi removido com sucesso.",
            "success",
          );
        } catch (error) {
          MySwal.fire("Erro", "Não foi possível excluir o médico.", "error");
        }
      }
    });
  };

  const handleEdit = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    setShowForm(true);
  };

  // Filtro de pesquisa
  const filteredDoctors = doctors.filter(
    (d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.crm.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const columns = [
    {
      header: "Nome",
      render: (row: any) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
            {row.name.substring(0, 2).toUpperCase()}
          </div>
          <span className="font-medium text-gray-900">{row.name}</span>
        </div>
      ),
    },
    {
      header: "CRM",
      accessor: "crm",
    },
    {
      header: "Especialidade",
      render: (row: any) => (
        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium uppercase">
          {row.specialty}
        </span>
      ),
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
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            title="Editar"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(row)}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
            title="Excluir"
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
            Médicos
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Administre a listagem de profissionais e seus registros.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingDoctor(null);
            setShowForm(true);
          }}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md shadow-blue-100 transition-all font-medium"
        >
          <Plus className="w-4 h-4" />
          Novo Médico
        </button>
      </div>

      {/* BARRA DE PESQUISA */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Pesquisar por nome ou CRM..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
          />
        </div>
      </div>

      {loading ? (
        <Loading />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <Table
            columns={columns}
            data={filteredDoctors}
            emptyMessage="Nenhum médico encontrado"
          />
        </div>
      )}

      {showForm && (
        <DoctorForm
          onClose={() => {
            setShowForm(false);
            setEditingDoctor(null);
          }}
          onSubmit={handleSubmit}
          initialData={editingDoctor} // Passa os dados se for edição
        />
      )}
    </div>
  );
}
