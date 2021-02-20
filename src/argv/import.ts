import { importCalendar } from '../store';

export interface ImportArgv {
  json: string;
}

export const command = 'import <json>';

export const describe = 'Erase current calendar with a fresh new one';

export const builder = {
  json: {
    description: 'The json calendar to import',
    type: 'string' as 'string',
  },
};

export const handler = (argv: ImportArgv) => {
  importCalendar(argv.json);
};
