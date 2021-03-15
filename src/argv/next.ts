import { getCalendar } from '../store';
import { next } from '../util';

export const command = 'next';

export const describe = 'Provide incoming birthdays';

export const handler = () => {
  next(getCalendar());
};
