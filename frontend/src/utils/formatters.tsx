export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export const formatDate = (date?: string | Date | null): string => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("pt-BR");
};

export const formatDateTime = (date?: string | Date | null): string => {
  if (!date) return "";
  return new Date(date).toLocaleString("pt-BR");
};

export const parseDate = (dateString?: string | null): Date | null => {
  if (!dateString) return null;
  return new Date(dateString);
};
