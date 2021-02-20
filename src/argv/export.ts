import { exportCalendar } from '../store';

export const command = 'export';

export const describe = 'Export current calendar under json format';

export const handler = () => {
  exportCalendar();
};
