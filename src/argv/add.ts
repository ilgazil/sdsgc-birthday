import { addToCalendar } from '../store';

export interface AddArgv {
  json: string;
}

export const command = 'add <json>';

export const describe = 'Add entries to the current calendar';

export const builder = {
  json: {
    description: 'The json entries to add',
    type: 'string' as 'string',
  },
};

export const handler = (argv: AddArgv) => {
  addToCalendar(argv.json);
};
