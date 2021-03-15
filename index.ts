import yargs from 'yargs';

import * as addCommand from './src/argv/add';
import * as exportCommand from './src/argv/export';
import * as importCommand from './src/argv/import';
import * as missingCommand from './src/argv/missing';
import * as nextCommand from './src/argv/next';
import * as serveCommand from './src/argv/serve';

const parser = yargs(process.argv.slice(2))
  .command(addCommand)
  .command(exportCommand)
  .command(importCommand)
  .command(missingCommand)
  .command(nextCommand)
  .command(serveCommand)
  .argv;
