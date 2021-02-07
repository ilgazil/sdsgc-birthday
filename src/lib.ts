import { Calendar } from './store';

export function next(calendar: Calendar) {
  const dates = Object.keys(calendar).sort((a, b) => a < b ? -1 : 1);

  const now = new Date();
  let currentDate = `${now.getMonth() + 1}-${now.getDate()}`;

  // Next birth date is for next year...
  if (dates[dates.length - 1] < currentDate) {
    currentDate = '01-01';
  }

  const nextDate = dates.findIndex((date) => date >= currentDate);

  return `Prochain anniversaire dans x (@todo) jours : ${calendar[nextDate].map(({ name }) => name)}.`;
}
