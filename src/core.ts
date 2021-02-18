import { Message } from 'discord.js';

import config from './config';

export interface Command {
  name: string;
  args: string[];
}

export function composeCommand(message: Message): Command | null {
  if (message.author.bot) {
    return null;
  };

  if (!message.content.startsWith(config.bot.command)) {
    return null;
  };

  const raw = message.content.slice(config.bot.command.length).trim();
  const args = raw.split(' ');
  const name = args.shift();

  return {
    name: name ? name.toLowerCase() : 'next',
    args,
  };
}
