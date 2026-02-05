// mobile/types/api.types.ts

export type Doctor = {
  id: string;
  name: string;
  crm: string;
  specialty: string;
  created_at: string;
};

export type Hospital = {
  id: string;
  name: string;
  code: string;
  created_at: string;
};

export type Production = {
  id: string;
  doctor: string;
  hospital: string;
  amount: number;
  production_date: string;
  created_at: string;
};

export type Transfer = {
  id: string;
  doctor: string;
  hospital: string;
  amount: number;
  transfer_date: string;
  created_at: string;
};

export type CreateDoctor = Omit<Doctor, 'id' | 'created_at'>;
export type CreateHospital = Omit<Hospital, 'id' | 'created_at'>;
export type CreateProduction = Omit<Production, 'id' | 'created_at'>;
export type CreateTransfer = Omit<Transfer, 'id' | 'created_at'>;

export type ListFilters = {
  doctor?: string;
  hospital?: string;
  start_date?: string;
  end_date?: string;
};

export type FinancialSummary = {
  total_produced: number;
  total_transferred: number;
  balance: number;
};