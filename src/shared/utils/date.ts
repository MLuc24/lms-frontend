function pad(value: number) {
  return value.toString().padStart(2, '0');
}

export function getLocalISODate(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function getWeekStartISO(date: Date) {
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const start = new Date(date);
  start.setDate(date.getDate() + diff);
  return getLocalISODate(start);
}

export function getShortDayLabel(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, { weekday: 'short' });
}

export function formatMonthRange(start: string, end: string) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const startLabel = startDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  const endLabel = endDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  return `${startLabel} - ${endLabel}`;
}
