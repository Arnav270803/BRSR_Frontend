export function formatReportDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function formatReportDateTime(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function formatKgCo2e(value: string | number | null | undefined) {
  const numericValue = Number(value ?? 0);

  return `${numericValue.toLocaleString("en-IN", {
    maximumFractionDigits: 3,
  })} kg CO2e`;
}
