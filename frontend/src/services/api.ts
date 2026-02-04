import type {
  Doctor,
  Hospital,
  Production,
  Transfer,
  CreateDoctor,
  CreateHospital,
  CreateProduction,
  CreateTransfer,
  ListFilters,
  FinancialSummary,
} from '../types/api.types'

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const delay = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

const useMockData = true;

// Mocks

let mockDoctors: Doctor[] = [];
let mockHospitals: Hospital[] = [];
let mockProductions: Production[] = [];
let mockTransfers: Transfer[] = [];

// Doctors

export const doctorsAPI = {
  async getAll(): Promise<Doctor[]> {
    await delay(300);
    if (useMockData) return mockDoctors;

    const res = await fetch(`${API_BASE_URL}/doctors/`);
    return res.json();
  },

  async create(data: CreateDoctor): Promise<Doctor> {
    await delay(300);

    if (useMockData) {
      const doctor: Doctor = {
        id: String(Date.now()),
        created_at: new Date().toISOString(),
        ...data,
      };

      mockDoctors.push(doctor);
      return doctor;
    }

    const res = await fetch(`${API_BASE_URL}/doctors/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    return res.json();
  },

  async getFinancialSummary(
    doctorId: string,
    startDate?: string,
    endDate?: string
  ): Promise<FinancialSummary> {
    await delay(300);

    if (useMockData) {
      const produced = mockProductions.filter(p =>
        p.doctor === doctorId &&
        (!startDate || p.production_date >= startDate) &&
        (!endDate || p.production_date <= endDate)
      );

      const transferred = mockTransfers.filter(t =>
        t.doctor === doctorId &&
        (!startDate || t.transfer_date >= startDate) &&
        (!endDate || t.transfer_date <= endDate)
      );

      const total_produced = produced.reduce((s, p) => s + p.amount, 0);
      const total_transferred = transferred.reduce((s, t) => s + t.amount, 0);

      return {
        total_produced,
        total_transferred,
        balance: total_produced - total_transferred,
      };
    }

    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);

    const res = await fetch(
      `${API_BASE_URL}/doctors/${doctorId}/financial-summary/?${params}`
    );

    return res.json();
  },
};

// Hospitasls

export const hospitalsAPI = {
  async getAll(): Promise<Hospital[]> {
    await delay(300);
    if (useMockData) return mockHospitals;

    const res = await fetch(`${API_BASE_URL}/hospitals/`);
    return res.json();
  },

  async create(data: CreateHospital): Promise<Hospital> {
    await delay(300);

    if (useMockData) {
      const hospital: Hospital = {
        id: String(Date.now()),
        created_at: new Date().toISOString(),
        ...data,
      };

      mockHospitals.push(hospital);
      return hospital;
    }

    const res = await fetch(`${API_BASE_URL}/hospitals/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    return res.json();
  },
};

// Productions
export const productionsAPI = {
  async getAll(filters: ListFilters = {}): Promise<Production[]> {
    await delay(300);

    if (useMockData) {
      return mockProductions.filter(p =>
        (!filters.doctor || p.doctor === filters.doctor) &&
        (!filters.hospital || p.hospital === filters.hospital) &&
        (!filters.start_date || p.production_date >= filters.start_date) &&
        (!filters.end_date || p.production_date <= filters.end_date)
      );
    }

    const params = new URLSearchParams(filters as Record<string, string>);
    const res = await fetch(`${API_BASE_URL}/productions/?${params}`);
    return res.json();
  },

  async create(data: CreateProduction): Promise<Production> {
    await delay(300);

    if (useMockData) {
      const production: Production = {
        id: String(Date.now()),
        created_at: new Date().toISOString(),
        ...data,
      };

      mockProductions.push(production);
      return production;
    }

    const res = await fetch(`${API_BASE_URL}/productions/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    return res.json();
  },
};

/* ========= TRANSFERS ========= */

export const transfersAPI = {
  async getAll(filters: ListFilters = {}): Promise<Transfer[]> {
    await delay(300);

    if (useMockData) {
      return mockTransfers.filter(t =>
        (!filters.doctor || t.doctor === filters.doctor) &&
        (!filters.hospital || t.hospital === filters.hospital) &&
        (!filters.start_date || t.transfer_date >= filters.start_date) &&
        (!filters.end_date || t.transfer_date <= filters.end_date)
      );
    }

    const params = new URLSearchParams(filters as Record<string, string>);
    const res = await fetch(`${API_BASE_URL}/transfers/?${params}`);
    return res.json();
  },

  async create(data: CreateTransfer): Promise<Transfer> {
    await delay(300);

    if (useMockData) {
      const transfer: Transfer = {
        id: String(Date.now()),
        created_at: new Date().toISOString(),
        ...data,
      };

      mockTransfers.push(transfer);
      return transfer;
    }

    const res = await fetch(`${API_BASE_URL}/transfers/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    return res.json();
  },
};
