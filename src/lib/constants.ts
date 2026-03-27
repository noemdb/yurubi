// src/lib/constants.ts

/**
 * Símbolo de moneda global configurado vía variable de entorno.
 * Por defecto es "USD" si no se define NEXT_PUBLIC_CURRENCY_SYMBOL.
 */
export const CURRENCY_SYMBOL = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "USD";

/**
 * Formatea un número como moneda usando el símbolo global.
 */
export function formatCurrency(amount: number, locale: string = "en-US") {
  // Nota: Si el símbolo es "USD", el formateador de Intl podría poner "$" 
  // por defecto para el locale "en-US". Forzamos el uso del símbolo literal 
  // para cumplir con el requerimiento del usuario de intercambiar "$" por "USD".
  
  const formattedAmount = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return `${CURRENCY_SYMBOL}${formattedAmount}`;
}
