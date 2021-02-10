import { Message } from 'discord.js';

export const COMMAND_PREFIX = process.env.COMMAND_PREFIX || '!birth';

export interface Command {
  name: string;
  args: string[];
}

export function composeCommand(message: Message): Command | null {
  if (message.author.bot) {
    return null;
  };

  if (!message.content.startsWith(COMMAND_PREFIX)) {
    return null;
  };

  const raw = message.content.slice(COMMAND_PREFIX.length).trim();
  const args = raw.split(' ');
  const name = args.shift();

  return {
    name: name ? name.toLowerCase() : 'next',
    args,
  };
}
