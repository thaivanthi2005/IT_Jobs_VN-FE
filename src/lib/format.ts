export const formatSalary = (min: number, max: number) => {
  if (!min && !max) return "Thương lượng";
  const fmt = (value: number) => `${Number(value).toLocaleString("vi-VN")}$`;
  return `${fmt(min)} – ${fmt(max)}`;
};
