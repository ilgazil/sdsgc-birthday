import { Message } from 'discord.js';

export const prefix = '!birth';

export interface Command {
  command: string;
  args: string[];
}

export function composeCommand(message: Message): Command {
  if (message.author.bot) {
    throw 'Bot message';
  };

  if (!message.content.startsWith(prefix)) {
    throw 'Not concerned';
  };

  if (!message.guild) {
    throw 'Out of scope';
  }

  const raw = message.content.slice(prefix.length).trim();
  const args = raw.split(' ');

  return {
    command: args.length > 0 ? args.shift().toLowerCase() : 'next',
    args,
  };
}
