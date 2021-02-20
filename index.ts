import Discord from 'discord.js';
import yargs, { Argv } from 'yargs';

import * as addCommand from './src/argv/add';
import * as exportCommand from './src/argv/export';
import * as importCommand from './src/argv/import';
import * as missingCommand from './src/argv/missing';
import * as nextCommand from './src/argv/next';
import config from './src/config';
import { startCron } from './src/util';

const parser = yargs
  .command(addCommand)
  .command(exportCommand)
  .command(importCommand)
  .command(missingCommand)
  .command(nextCommand)
  .help();

const client = new Discord.Client();

client.on('message', async (message) => {
  if (message.author.bot) {
    return;
  };

  parser.parse(message.content, (error: Error | undefined, argv: Argv, output: string) => {
    if (!error) {
      message.reply(output);
    }
  });
});

client.login(config.bot.token);

startCron(client);
