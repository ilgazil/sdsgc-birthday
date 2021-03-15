import * as Discord from 'discord.js';
import * as yargs from 'yargs';

import * as addCommand from './add';
import * as exportCommand from './export';
import * as importCommand from './import';
import * as missingCommand from './missing';
import * as nextCommand from './next';
import config from '../config';
import { startCron } from '../util';

type Argv = yargs.Argv;

export const command = 'serve';

export const describe = 'Login to discord and listen for questions';

export const handler = () => {
  const client = new Discord.Client();

  const parser = yargs
    .command(addCommand)
    .command(exportCommand)
    .command(importCommand)
    .command(missingCommand)
    .command(nextCommand)
    .help();

  client.on('message', async (message) => {
    if (message.author.bot) {
      return;
    };

    const args = message.content.split(' ');

    if (args[0] !== config.bot.command) {
      return;
    }

    parser.parse(args.splice(1), (error: Error | undefined, argv: Argv, output: string) => {
      if (!error) {
        message.reply(output);
      }
    });
  });

  client.login(config.bot.token);

  startCron(client);
};
