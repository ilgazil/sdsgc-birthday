import { Message } from 'discord.js';
import { composeCommand } from '../src/core';
import config from '../config.json';

describe('core', () => {
  describe('composeCommand', () => {
    it('should not process for bot message', () => {
      expect(composeCommand({ author: { bot: true }} as Message)).toBeNull();
    });

    it('should not process if bot is not queried', () => {
      expect(composeCommand({ author: { bot: false }, content: 'Foo message'} as Message)).toBeNull();
    });

    it('should not process if bot is not queried', () => {
      expect(composeCommand({ author: { bot: false }, content: 'Foo message'} as Message)).toBeNull();
    });

    it('should parse raw entry', () => {
      expect(composeCommand({
        author: { bot: false },
        content: `${config.prefix} Command with args`,
      } as Message)).toEqual({
        name: 'command',
        args: ['with', 'args'],
      });
    });

    it('should set `next` as default command', () => {
      expect(composeCommand({
        author: { bot: false },
        content: `${config.prefix}`,
      } as Message)).toEqual({
        name: 'next',
        args: [],
      });
    });
  });
});
