import { Message } from 'discord.js';
import { composeCommand, COMMAND_PREFIX } from '../src/core';

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
        content: `${COMMAND_PREFIX} Command with args`,
      } as Message)).toEqual({
        name: 'command',
        args: ['with', 'args'],
      });
    });

    it('should set `next` as default command', () => {
      expect(composeCommand({
        author: { bot: false },
        content: `${COMMAND_PREFIX}`,
      } as Message)).toEqual({
        name: 'next',
        args: [],
      });
    });
  });
});
