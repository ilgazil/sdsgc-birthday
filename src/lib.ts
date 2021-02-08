import { Calendar } from './store';

export function next(calendar: Calendar): string {
  const dates = Object.keys(calendar).sort((a, b) => a < b ? -1 : 1);

  if (!dates.length) {
    return '';
  }

  const now = new Date(Date.now());
  const month = `0${now.getMonth() + 1}`;
  const date = `0${now.getDate()}`;
  let currentDate = `${month.slice(month.length - 2)}-${date.slice(date.length - 2)}`;

  // Next birth date is for next year...
  if (dates[dates.length - 1] < currentDate) {
    currentDate = '01-01';
  }

  const nextDate = dates.find((date) => date >= currentDate);

  return `Prochain anniversaire dans x (@todo) jours : ${calendar[nextDate].map(({ name }) => name).join(', ')}.`;
}
