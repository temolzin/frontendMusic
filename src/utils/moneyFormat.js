export function formatMoney(value) {
  const num = Number(value);
  const safe = Number.isFinite(num) ? num : 0;
  return safe.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function formatCurrency(value) {
  return `$${formatMoney(value)} MXN`;
}
