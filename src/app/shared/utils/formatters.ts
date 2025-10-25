export interface FormattedCurrency {
  numericValue: number | null; // O valor numérico (float), ex: 123.45
  formattedValue: string; // O valor formatado (BRL), ex: "123,45"
}

export function getCurrencyValues(value: string | null | undefined): FormattedCurrency {
  if (!value) {
    return { numericValue: null, formattedValue: '' };
  }

  const digits = value.replace(/\D/g, '');

  if (digits === '') {
    return { numericValue: null, formattedValue: '' };
  }

  const numericValue = parseFloat(digits) / 100;

  const formattedValue = new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericValue);

  return { numericValue, formattedValue };
}
