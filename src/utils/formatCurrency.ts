export function formatCurrency(amount: number | string | null | undefined): string {
  const n = Math.round(Number(amount || 0));
  return `${n.toLocaleString('vi-VN')} đ`;
}

export default formatCurrency;
