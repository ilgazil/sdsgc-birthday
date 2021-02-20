import yargs, { Arguments } from 'yargs';

import * as addCommand from '../src/argv/add';
import * as exportCommand from '../src/argv/export';
import * as importCommand from '../src/argv/import';
import * as missingCommand from '../src/argv/missing';
import * as nextCommand from '../src/argv/next';
import { addToCalendar, getCalendar, exportCalendar, importCalendar } from '../src/store';
import { missing, next } from '../src/util';

jest.mock('../src/store', () => ({
  addToCalendar: jest.fn(),
  getCalendar: jest.fn(),
  exportCalendar: jest.fn(),
  importCalendar: jest.fn(),
}));

jest.mock('../src/util', () => ({
  missing: jest.fn(),
  next: jest.fn(),
}));

describe('argv', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('import should call importCalendar with provided json', async () => {
    const json = '{"Foo":{"birthdate":"01-01"},"Bar":{"birthdate":"01-02"},"Baz":{"birthdate":"01-01"}}';

    const parser = yargs.command(importCommand).help();

    await new Promise((resolve) => {
      parser.parse(`import ${json}`, (err: Error | undefined, argv: importCommand.ImportArgv, output: string) => {
        resolve(output);
      })
    });

    expect(importCalendar).toBeCalledWith(json);
  });

  it('add should call addToCalendar with provided json', async () => {
    const json = '{"Foo":{"birthdate":"01-01"},"Bar":{"birthdate":"01-02"},"Baz":{"birthdate":"01-01"}}';

    const parser = yargs.command(addCommand).help();

    await new Promise((resolve) => {
      parser.parse(`add ${json}`, (err: Error | undefined, argv: addCommand.AddArgv, output: string) => {
        resolve(output);
      })
    });

    expect(addToCalendar).toBeCalledWith(json);
  });

  it('export should call exportCalendar', async () => {
    const parser = yargs.command(exportCommand).help();

    await new Promise((resolve) => {
      parser.parse(`export`, (err: Error | undefined, argv: Arguments<{}>, output: string) => {
        resolve(output);
      })
    });

    expect(exportCalendar).toBeCalled();
  });

  it('missing should call utils missing with current calendar', async () => {
    const parser = yargs.command(missingCommand).help();

    const calendar = {};
    (getCalendar as jest.Mock).mockReturnValueOnce(calendar);

    await new Promise((resolve) => {
      parser.parse(`missing`, (err: Error | undefined, argv: Arguments<{}>, output: string) => {
        resolve(output);
      })
    });

    expect(getCalendar).toBeCalled();
    expect(missing).toBeCalledWith(calendar);
  });

  it('next should call utils next with current calendar', async () => {
    const parser = yargs.command(nextCommand).help();

    const calendar = {};
    (getCalendar as jest.Mock).mockReturnValueOnce(calendar);

    await new Promise((resolve) => {
      parser.parse(`next`, (err: Error | undefined, argv: Arguments<{}>, output: string) => {
        resolve(output);
      })
    });

    expect(getCalendar).toBeCalled();
    expect(next).toBeCalledWith(calendar);
  });
});
