import { Message } from 'discord.js';

import config from '../src/config';
import { composeCommand } from '../src/core';

jest.mock('../src/config', () => ({
  bot: {
    command: '!command',
  }
}));

describe('core', () => {
  describe('composeCommand', () => {
    it('should not process for bot message', () => {
      expect(composeCommand({ author: { bot: true }} as Message)).toBeNull();
    });

    it('should not process if bot is not queried', () => {
      expect(composeCommand({ author: { bot: false }, content: 'Foo message'} as Message)).toBeNull();
    });

    it('should parse raw entry', () => {
      expect(composeCommand({
        author: { bot: false },
        content: `${config.bot.command} Command with args`,
      } as Message)).toEqual({
        name: 'command',
        args: ['with', 'args'],
      });
    });

    it('should set `next` as default command', () => {
      expect(composeCommand({
        author: { bot: false },
        content: config.bot.command,
      } as Message)).toEqual({
        name: 'next',
        args: [],
      });
    });
  });
});
