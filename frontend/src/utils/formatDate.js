export function formatDate(date) {
  if (!date) return '-';
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(date));
}
