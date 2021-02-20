import { getCalendar } from '../store';
import { missing } from '../util';

export const command = 'missing';

export const describe = 'Check external database to get missing entries';

export const handler = () => {
  missing(getCalendar());
};
