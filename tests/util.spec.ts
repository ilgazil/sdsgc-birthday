import { ChannelManager, Client, ClientUser } from 'discord.js';
import fetch from 'node-fetch';

import config from '../src/config';
import { broadcastBirthdays, composeDateIndex, missing, next, startCron } from '../src/util';
import { importCalendar } from '../src/store';

jest.mock('node-fetch', () => jest.fn());
jest.mock('../src/config', () => ({
  bot: {
    avatar: 'default-avatar',
    username: 'default-username',
  },
  server: {
    channel: '#birth',
  },
}));

function createFakeClient(
  {
    setAvatar,
    setUsername,
    getChannel,
    isTextChannel,
    channelSend,
  }: {
    setAvatar?: jest.Mock,
    setUsername?: jest.Mock,
    getChannel?: jest.Mock,
    isTextChannel?: jest.Mock,
    channelSend?: jest.Mock,
  } = {}
): Client {
  const client = {
    user: {
      avatar: config.bot.avatar,
      setAvatar: setAvatar || jest.fn(),
      username: config.bot.username,
      setUsername: setUsername || jest.fn(),
    } as unknown as ClientUser,
  } as Client;

  client.channels = {
    cache: {
      get: getChannel || jest.fn().mockReturnValue({
        isText: isTextChannel || jest.fn(),
        send: channelSend || jest.fn(),
      }),
    },
  } as unknown as ChannelManager;

  return client;
}

describe('lib', () => {
  describe('missing', () => {
    const sdsgcDocumentBody = '<body><h3 class="brand"><img src="https://rerollcdn.com/SDSGC/ui/piggy_neutral.png" alt="brand">SDSGC.GG</h3><div class="character-list tier-list grid"><a class="character-list-item data-hover new" data-title="Jericho" href="/characters/156/jericho"><img class="character-icon " src="https://rerollcdn.com/SDSGC/portraits/portrait_156.png" alt="Jericho"><div class="character-main"><h3 class="character-name">Jericho</h3><p class="character-description">Knight of Frost</p></div></a><a class="character-list-item data-hover new" data-title="King" href="/characters/90/king"><img class="character-icon " src="https://rerollcdn.com/SDSGC/portraits/portrait_90.png" alt="King"><div class="character-main"><h3 class="character-name">King</h3><p class="character-description">Disaster</p></div></a><a class="character-list-item data-hover new" data-title="Roxy" href="/characters/155/roxy"><img class="character-icon " src="https://rerollcdn.com/SDSGC/portraits/portrait_155.png" alt="Roxy"><div class="character-main"><h3 class="character-name">Roxy</h3><p class="character-description">Halloween</p></div></a><a class="character-list-item data-hover new" data-title="Shin" href="/characters/154/shin"><img class="character-icon " src="https://rerollcdn.com/SDSGC/portraits/portrait_154.png" alt="Shin"><div class="character-main"><h3 class="character-name">Shin</h3><p class="character-description">Halloween</p></div></a><a class="character-list-item data-hover" data-title="Alioni" href="/characters/20/alioni"><img class="character-icon " src="https://rerollcdn.com/SDSGC/portraits/portrait_20.png" alt="Alioni"><div class="character-main"><h3 class="character-name">Alioni</h3><p class="character-description">Beard of the Mountain Cat</p></div></a><a class="character-list-item data-hover" data-title="Roxy" href="/characters/129/roxy"><img class="character-icon " src="https://rerollcdn.com/SDSGC/portraits/portrait_129.png" alt="Roxy"><div class="character-main"><h3 class="character-name">Roxy</h3><p class="character-description">Mad Destroyer</p></div></a></div></body>';
    const currentCalendar = {
      '01-20': [{ name: 'Roxy', birthdate: '01-20' }],
      '09-06': [{ name: 'Jericho', birthdate: '09-06' }],
    };

    it('should pick missing characters from sdsgc.gg', async () => {
      (fetch as unknown as jest.Mock).mockResolvedValueOnce({
        text() {
          return sdsgcDocumentBody;
        }
      });

      expect(await missing(currentCalendar)).toBe('Il manque les anniversaires des personnages suivants : Alioni, King, Shin.');
    });

    it('should tell calendar is up to date if so', async () => {
      (fetch as unknown as jest.Mock).mockResolvedValueOnce({
        text() {
          return sdsgcDocumentBody;
        }
      });

      expect(await missing({
        ...currentCalendar,
        '02-22': [{ name: 'Alioni', birthdate: '02-22' }],
        '04-01': [{ name: 'King', birthdate: '04-01' }],
        '07-28': [{ name: 'Shin', birthdate: '07-28' }],
      })).toBe('Le calendrier est à jour.');
    });

    it('should warn if sdsgc.gg is unreachable', async () => {
      (fetch as unknown as jest.Mock).mockRejectedValueOnce('HTTP/404');

      async function failingMissing() {
        return await missing(currentCalendar);
      }

      expect(await failingMissing()).toBe('Impossible de contacter https://www.sdsgc.gg/.');
    });

    it('should warn if sdsgc.gg cannot be parsed', async () => {
      (fetch as unknown as jest.Mock).mockResolvedValueOnce({
        text() {
          return sdsgcDocumentBody.replace(/character-icon/g, 'char-portrait');
        }
      });

      expect(await missing(currentCalendar)).toBe('Il semble que https://www.sdsgc.gg/ ait été mis à jour et ne peut être parsé.');
    });
  });

  describe('next', () => {
    it('should be empty with empty calendar', () => {
      expect(next({})).toBe('');
    });

    it ('should find next birthday in calendar', () => {
      jest
        .spyOn(global.Date, 'now')
        .mockImplementationOnce(() =>
          new Date('2021-07-22T12:45:07.135Z').valueOf()
        );

      expect(next({
        '09-06': [
          {
            name: 'Jericho',
            birthdate: '09-06',
          }
        ],
        '10-30': [
          {
            name: 'Derrierie',
            birthdate: '10-30',
          }
        ],
        '08-23': [
          {
            name: 'Camila',
            birthdate: '08-23',
          },
          {
            name: "Beast Camila",
            birthdate: '08-23',
          }
        ],
      })).toBe('Prochain anniversaire dans x (@todo) jours : Camila, Beast Camila.');
    });

    it ('should find next year birthday in calendar', () => {
      jest
        .spyOn(global.Date, 'now')
        .mockImplementationOnce(() =>
          new Date('2021-10-30T12:45:07.135Z').valueOf()
        );

      expect(next({
        '09-06': [
          {
            name: 'Jericho',
            birthdate: '09-06',
          }
        ],
        '10-30': [
          {
            name: 'Derrierie',
            birthdate: '10-30',
          }
        ],
        '08-23': [
          {
            name: 'Camila',
            birthdate: '08-23',
          },
          {
            name: "Beast Camila",
            birthdate: '08-23',
          }
        ],
      })).toBe('Prochain anniversaire dans x (@todo) jours : Camila, Beast Camila.');
    });
  });

  describe('startCron', () =>  {
    beforeEach(() => {
      jest.useFakeTimers('modern');
    });

    afterEach(() => {
      jest.clearAllTimers();
      jest.useRealTimers();
    });

    it('should broadcast at the first second of the first minute of the next hour', () => {
      startCron({} as Client);

      const startedAt = new Date();
      jest.advanceTimersToNextTimer();

      const now = new Date(Date.now());
      const minutes = `0${now.getMinutes()}`;
      const seconds = `0${now.getSeconds()}`;
      expect(
        `${now.getHours()}:${minutes.slice(minutes.length - 2)}:${seconds.slice(seconds.length - 2)}`
      ).toBe(`${startedAt.getHours() + 1}:00:00`);
    });

    it('should broadcast for concerned birthdays', async () => {
      const isTextChannel = jest.fn().mockResolvedValueOnce(true);
      const channelSend = jest.fn();
      const client = createFakeClient({ isTextChannel, channelSend });
      startCron(client);

      const now = new Date();
      const today = composeDateIndex(now);

      now.setDate(now.getDate() + 1)
      const tomorrow = composeDateIndex(now);

      importCalendar(JSON.stringify({
        Roxy: { birthdate: today },
        Jericho: { birthdate: tomorrow },
      }));

      jest.advanceTimersToNextTimer();
      jest.clearAllTimers();
      jest.useRealTimers();
      await new Promise(setImmediate);

      expect(channelSend).toBeCalledWith(`C'est mon anniversaire !`);
    });
  });

  describe('broadcastBirthdays', () =>  {
    it('should do nothing if no birthdays are provided', async () => {
      const setAvatar = jest.fn();
      const setUsername = jest.fn();
      const isTextChannel = jest.fn().mockReturnValueOnce(true);
      const channelSend = jest.fn();
      const client = createFakeClient({
        setAvatar,
        setUsername,
        isTextChannel,
        channelSend,
      });

      await broadcastBirthdays(client, []);

      expect(setAvatar).not.toBeCalled();
      expect(setUsername).not.toBeCalled();
      expect(isTextChannel).not.toBeCalled();
      expect(channelSend).not.toBeCalled();
    });

    it('should change portrait if needed and restore it to default', async () => {
      const setAvatar = jest.fn();
      const client = createFakeClient({ setAvatar });
      setAvatar.mockImplementation((avatar: string) => {
        (client.user as { avatar: string }).avatar = avatar;
      });

      await broadcastBirthdays(client, [
        {
          name: 'With no portrait (will be ignored)',
          birthdate: '01-01',
        },
        {
          name: 'With portrait',
          birthdate: '01-01',
          portrait: 'first-custom-portrait',
        },
        {
          name: 'With no portrait too',
          birthdate: '01-01',
        },
        {
          name: 'With portrait too',
          birthdate: '01-01',
          portrait: 'second-custom-portrait'
        },
      ]);

      expect(setAvatar).toHaveBeenCalledTimes(4);
      expect(setAvatar).toHaveBeenNthCalledWith(1, 'first-custom-portrait');
      expect(setAvatar).toHaveBeenNthCalledWith(2, config.bot.avatar);
      expect(setAvatar).toHaveBeenNthCalledWith(3,'second-custom-portrait');
      expect(setAvatar).toHaveBeenNthCalledWith(4, config.bot.avatar);
    });

    it('should set default avatar portrait if defining a custom one fails', async () => {
      const setAvatar = jest.fn().mockRejectedValueOnce(new Error('Network error'));
      const client = createFakeClient({ setAvatar });

      await broadcastBirthdays(client, [
        {
          name: 'Foo',
          birthdate: '01-01',
          portrait: 'failing-portrait',
        },
      ]);

      expect(setAvatar).toHaveBeenCalledTimes(2);
      expect(setAvatar).toHaveBeenNthCalledWith(1, 'failing-portrait');
      expect(setAvatar).toHaveBeenNthCalledWith(2, config.bot.avatar);
    });

    it('should change username with character name and restore it to default', async () => {
      const setUsername = jest.fn();
      const client = createFakeClient({ setUsername });

      await broadcastBirthdays(client, [
        {
          name: 'Foo',
          birthdate: '01-01',
        },
        {
          name: 'Bar',
          birthdate: '01-01',
        },
        {
          name: 'Baz',
          birthdate: '01-01',
        },
      ]);

      expect(setUsername).toHaveBeenCalledTimes(4);
      expect(setUsername).toHaveBeenNthCalledWith(1, 'Foo');
      expect(setUsername).toHaveBeenNthCalledWith(2, 'Bar');
      expect(setUsername).toHaveBeenNthCalledWith(3, 'Baz');
      expect(setUsername).toHaveBeenNthCalledWith(4, config.bot.username);
    });


    it('should throw errors after all birthdays are handled', async () => {
      const setUsername = jest.fn()
        .mockImplementationOnce(() => {})
        .mockRejectedValueOnce(new Error('Network error'))
        .mockImplementationOnce(() => {})
        .mockRejectedValueOnce(new Error('Other network error'));
      const client = createFakeClient({ setUsername });

      expect(async () => await broadcastBirthdays(client, [
        {
          name: 'Foo',
          birthdate: '01-01',
        },
        {
          name: 'Bar',
          birthdate: '01-01',
        },
        {
          name: 'Baz',
          birthdate: '01-01',
        },
      ])).rejects.toMatch('Errors occured!\nBar: Network error\nWhile restoring config: Other network error');
    });
  });
});
