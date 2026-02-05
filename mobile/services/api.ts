// services/api.ts
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
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
} from '../types/api.types';

const IP = "SEU_IP_AQUI";
const API_BASE_URL = `http://${IP}:8004/api`;

// Função auxiliar para lidar com armazenamento em diferentes plataformas
const storage = {
  getItem: async (key: string) => {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return await SecureStore.getItemAsync(key);
  },
  setItem: async (key: string, value: string) => {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  },
  deleteItem: async (key: string) => {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  }
};

async function apiClient(endpoint: string, options: RequestInit = {}) {
  const token = await storage.getItem("access_token");

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      await storage.deleteItem("access_token");
      await storage.deleteItem("refresh_token");
      // O redirecionamento no Mobile deve ser feito via router.replace('/') na tela que chama
      throw new Error("Sessão expirada.");
    }

    if (response.status === 204) return;

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || "Erro na requisição");
    }

    return response.json();
  } catch (error) {
    console.error("Erro na requisição:", error);
    throw error;
  }
}

/* AUTH API  */
export const authAPI = {
  async login(credentials: any) {
    const res = await fetch(`${API_BASE_URL}/auth/token/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    
    if (!res.ok) throw new Error("Usuário ou senha inválidos");
    
    const data = await res.json();
    await storage.setItem("access_token", data.access);
    await storage.setItem("refresh_token", data.refresh);
    return data;
  },
  async getProfile() {
    return apiClient('/auth/profile/');
  }
};

/* DOCTORS API  */
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
  async update(id: string, data: Partial<Doctor>): Promise<Doctor> {
    return apiClient(`/doctors/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
  async delete(id: string): Promise<void> {
    return apiClient(`/doctors/${id}/`, {
      method: 'DELETE',
    });
  },
  async getFinancialSummary(doctorId: string, startDate?: string, endDate?: string): Promise<FinancialSummary> {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    return apiClient(`/doctors/${doctorId}/financial-summary/?${params.toString()}`);
  },
};

/* HOSPITALS API  */
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
  async update(id: string, data: Partial<Hospital>): Promise<Hospital> {
    return apiClient(`/hospitals/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
  async delete(id: string): Promise<void> {
    return apiClient(`/hospitals/${id}/`, {
      method: 'DELETE',
    });
  },
};

/* PRODUCTIONS API  */
export const productionsAPI = {
  async getAll(filters: ListFilters = {}): Promise<Production[]> {
    const params = new URLSearchParams(filters as any);
    return apiClient(`/productions/?${params.toString()}`);
  },
  async create(data: CreateProduction): Promise<Production> {
    return apiClient('/productions/', { method: 'POST', body: JSON.stringify(data) });
  },
  async update(id: string, data: Partial<Production>): Promise<Production> {
    return apiClient(`/productions/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
  async delete(id: string): Promise<void> {
    return apiClient(`/productions/${id}/`, {
      method: 'DELETE',
    });
  },
};

/* TRANSFERS API  */
export const transfersAPI = {
  async getAll(filters: ListFilters = {}): Promise<Transfer[]> {
    const params = new URLSearchParams(filters as any);
    return apiClient(`/transfers/?${params.toString()}`);
  },
  async create(data: CreateTransfer): Promise<Transfer> {
    return apiClient('/transfers/', { method: 'POST', body: JSON.stringify(data) });
  },
  async update(id: string, data: Partial<Transfer>): Promise<Transfer> {
    return apiClient(`/transfers/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
  async delete(id: string): Promise<void> {
    return apiClient(`/transfers/${id}/`, {
      method: 'DELETE',
    });
  },
};

export { storage };