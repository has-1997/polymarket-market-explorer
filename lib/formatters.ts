export function formatCurrency(value: number): string {
  const absoluteValue = Math.abs(value);

  if (absoluteValue >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(1)}B`;
  }

  if (absoluteValue >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }

  if (absoluteValue >= 1_000) {
    return `$${(value / 1_000).toFixed(1)}K`;
  }

  return `$${value.toFixed(0)}`;
}

export function formatProbability(value: number | null): string {
  if (value === null) {
    return "N/A";
  }

  return `${Math.round(value * 100)}%`;
}

export function formatDate(value: string | null): string {
  if (!value) {
    return "No end date";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  const day = String(date.getUTCDate());
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
  const month = monthNames[date.getUTCMonth()];
  const year = date.getUTCFullYear();

  return `${day} ${month} ${year}`;
}
