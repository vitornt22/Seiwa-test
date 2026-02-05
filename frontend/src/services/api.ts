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

// Porta 8004 conforme configurado no seu Docker
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8004/api';

/**
 * Helper centralizado para chamadas API
 * Gerencia automaticamente os headers de autenticação
 */
async function apiClient(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("access_token");

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Se o backend retornar 401, o token expirou ou é inválido
  if (response.status === 401) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/login";
    throw new Error("Sessão expirada. Faça login novamente.");
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Erro na requisição");
  }

  return response.json();
}

/* ========= AUTH API ========= */

export const authAPI = {
  async login(credentials: any) {
    // Note que aqui usamos a rota do seu app 'accounts' configurada anteriormente
    const res = await fetch(`${API_BASE_URL}/auth/token/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!res.ok) throw new Error("Usuário ou senha inválidos");
    
    const data = await res.json();
    localStorage.setItem("access_token", data.access);
    localStorage.setItem("refresh_token", data.refresh);
    return data;
  },

  async getProfile() {
    return apiClient('/auth/profile/');
  }
};

/* ========= DOCTORS API ========= */

export const doctorsAPI = {
  async getAll(): Promise<Doctor[]> {
    return apiClient('/doctors/');
  },

  async create(data: CreateDoctor): Promise<Doctor> {
    return apiClient('/doctors/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getFinancialSummary(
    doctorId: string,
    startDate?: string,
    endDate?: string
  ): Promise<FinancialSummary> {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);

    return apiClient(`/doctors/${doctorId}/financial-summary/?${params}`);
  },
};

/* ========= HOSPITALS API ========= */

export const hospitalsAPI = {
  async getAll(): Promise<Hospital[]> {
    return apiClient('/hospitals/');
  },

  async create(data: CreateHospital): Promise<Hospital> {
    return apiClient('/hospitals/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

/* ========= PRODUCTIONS API ========= */

export const productionsAPI = {
  async getAll(filters: ListFilters = {}): Promise<Production[]> {
    const params = new URLSearchParams(filters as Record<string, string>);
    return apiClient(`/productions/?${params}`);
  },

  async create(data: CreateProduction): Promise<Production> {
    return apiClient('/productions/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

/* ========= TRANSFERS API ========= */

export const transfersAPI = {
  async getAll(filters: ListFilters = {}): Promise<Transfer[]> {
    const params = new URLSearchParams(filters as Record<string, string>);
    return apiClient(`/transfers/?${params}`);
  },

  async create(data: CreateTransfer): Promise<Transfer> {
    return apiClient('/transfers/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};