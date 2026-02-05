import { useState, useEffect } from "react";
import { Plus, Trash2, Edit3, Filter, Receipt } from "lucide-react"; // Adicionado ícone de recibo
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Table from "../components/Table";
import Filters from "../components/Filters";
import Loading from "../components/Loading";
import { transfersAPI, doctorsAPI, hospitalsAPI } from "../services/api";
import { formatCurrency, formatDate } from "../utils/formatters";
import type {
  Doctor,
  ListFilters,
  Hospital,
  Transfer,
} from "../types/api.types";
import TransferForm from "../components/forms/TranferForm";

const MySwal = withReactContent(Swal);

export default function Transfers() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTransfer, setEditingTransfer] = useState<Transfer | null>(null); // Estado para edição

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
    loadTransfers();
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
      await loadTransfers();
    } catch (error) {
      console.error("Error loading data:", error);
      MySwal.fire(
        "Erro",
        "Não foi possível carregar os dados de suporte.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const loadTransfers = async () => {
    try {
      const data = await transfersAPI.getAll(filters);
      setTransfers(data);
    } catch (error) {
      console.error("Error loading transfers:", error);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      if (editingTransfer) {
        await transfersAPI.update(editingTransfer.id, data);
        MySwal.fire({
          title: "Repasse atualizado!",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        await transfersAPI.create(data);
        MySwal.fire({
          title: "Repasse registrado!",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }
      setShowForm(false);
      setEditingTransfer(null);
      await loadTransfers();
    } catch (error) {
      MySwal.fire("Erro", "Erro ao processar o repasse.", "error");
    }
  };

  const handleDelete = async (transfer: Transfer) => {
    MySwal.fire({
      title: "Excluir repasse?",
      text: "Isso alterará o saldo devedor do médico no dashboard!",
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
          await transfersAPI.delete(transfer.id);
          setTransfers(transfers.filter((t) => t.id !== transfer.id));
          MySwal.fire("Removido!", "O repasse foi excluído.", "success");
        } catch (error) {
          MySwal.fire("Erro", "Não foi possível remover o repasse.", "error");
        }
      }
    });
  };

  const handleEdit = (transfer: Transfer) => {
    setEditingTransfer(transfer);
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
      header: "Beneficiário (Médico)",
      render: (row: any) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900">
            {getDoctorName(row.doctor)}
          </span>
          <span className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">
            REF: {row.id.slice(0, 8)}
          </span>
        </div>
      ),
    },
    {
      header: "Origem (Hospital)",
      render: (row: any) => (
        <span className="text-sm text-gray-600 font-medium">
          {getHospitalName(row.hospital)}
        </span>
      ),
    },
    {
      header: "Valor Pago",
      render: (row: any) => (
        <span className="font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
          {formatCurrency(row.amount)}
        </span>
      ),
    },
    {
      header: "Data do Pagamento",
      render: (row: any) => formatDate(row.transfer_date),
    },
    {
      header: "Ações",
      render: (row: Transfer) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEdit(row)}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
            title="Editar Pagamento"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(row)}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-all"
            title="Excluir Registro"
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
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <Receipt className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Repasses Médicos
            </h1>
            <p className="text-sm text-gray-500">
              Histórico de pagamentos e transferências realizadas.
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setEditingTransfer(null);
            setShowForm(true);
          }}
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all font-bold"
        >
          <Plus className="w-5 h-5" />
          Novo Repasse
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 mb-4 text-gray-800 font-semibold">
          <Filter className="w-4 h-4 text-blue-500" />
          <span>Filtrar Repasses</span>
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
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <Table
            columns={columns as any}
            data={transfers}
            emptyMessage="Nenhum registro de repasse encontrado"
          />
        </div>
      )}

      {showForm && (
        <TransferForm
          onClose={() => {
            setShowForm(false);
            setEditingTransfer(null);
          }}
          onSubmit={handleSubmit}
          initialData={editingTransfer} // Passando dados para edição
        />
      )}
    </div>
  );
}
