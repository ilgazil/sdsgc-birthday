import { Message } from 'discord.js';

import config from '../config.json';

export interface Command {
  name: string;
  args: string[];
}

export function composeCommand(message: Message): Command | null {
  if (message.author.bot) {
    return null;
  };

  if (!message.content.startsWith(config.prefix)) {
    return null;
  };

  const raw = message.content.slice(config.prefix.length).trim();
  const args = raw.split(' ');
  const name = args.shift();

  return {
    name: name ? name.toLowerCase() : 'next',
    args,
  };
}
