import { Search } from "lucide-react";
import type { Doctor, Hospital, ListFilters } from "../types/api.types";

export type FiltersProps = {
  filters: ListFilters;
  onFilterChange: React.Dispatch<React.SetStateAction<ListFilters>>;
  doctors: Doctor[];
  hospitals: Hospital[];
};

export default function Filters({
  filters,
  onFilterChange,
  doctors = [],
  hospitals = [],
}: FiltersProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Search className="w-5 h-5 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-900">Filtros</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {doctors.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Médico
            </label>
            <select
              value={filters.doctor || ""}
              onChange={(e) =>
                onFilterChange({ ...filters, doctor: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {hospitals.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hospital
            </label>
            <select
              value={filters.hospital || ""}
              onChange={(e) =>
                onFilterChange({ ...filters, hospital: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos</option>
              {hospitals.map((hospital) => (
                <option key={hospital.id} value={hospital.id}>
                  {hospital.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data Inicial
          </label>
          <input
            type="date"
            value={filters.start_date || ""}
            onChange={(e) =>
              onFilterChange({ ...filters, start_date: e.target.value })
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
            value={filters.end_date || ""}
            onChange={(e) =>
              onFilterChange({ ...filters, end_date: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
}
