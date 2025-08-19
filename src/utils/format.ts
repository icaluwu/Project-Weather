export function fmtHourLabel(iso: string) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(d);
}

export function fmtLong(iso: string) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(d);
}
