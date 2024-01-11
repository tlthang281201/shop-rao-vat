export const formatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});
export function formatMoney(amount) {
  if (amount >= 10000000) {
    return (amount / 1000000).toFixed(1) + " triệu";
  } else {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  }
}

export function formatDongCu(amount) {
  return new Intl.NumberFormat("vi-VN").format(amount);
}
