import { getCalendar } from '../store';
import { next } from '../util';

export const command = 'next';

export const describe = 'Check external database to get next birthdays';

export const handler = () => {
  next(getCalendar());
};
