import { Client } from 'discord.js';
import fetch from 'node-fetch';
import matchAll from 'string.prototype.matchall';

import config from './config';
import { Calendar, Character, exportCalendar, getCalendar } from './store';

export async function missing(calendar: Calendar): Promise<string> {
  const importedCharacters = Object.keys(exportCalendar(calendar));

  try {
    const result = await (await fetch('https://www.sdsgc.gg/characters')).text();
    const allCharacters: string[] = [];

    for (let match of matchAll(result, /img[^>]+character-icon[^>]+alt="(\w+)/gi)) {
      if (allCharacters.indexOf(match[1]) === -1) {
        allCharacters.push(match[1]);
      }
    }

    if (!allCharacters.length) {
      return 'Il semble que https://www.sdsgc.gg/ ait été mis à jour et ne peut être parsé.'
    }

    const missingCharacters = allCharacters
      .filter((name) => importedCharacters.indexOf(name) === -1)
      .sort((a, b) => a > b ? 1 : -1);

    if (!missingCharacters.length) {
      return 'Le calendrier est à jour.';
    }

    return `Il manque les anniversaires des personnages suivants : ${missingCharacters.join(', ')}.`;
  } catch (e) {
    return `Impossible de contacter https://www.sdsgc.gg/.`;
  }
}

export function composeDateIndex(reference: Date): string {
  const month = `0${reference.getMonth() + 1}`;
  const date = `0${reference.getDate()}`;
  return `${month.slice(month.length - 2)}-${date.slice(date.length - 2)}`;
}

export function next(calendar: Calendar): string {
  const dates = Object.keys(calendar).sort((a, b) => a < b ? -1 : 1);

  if (!dates.length) {
    return '';
  }

  let currentDate = composeDateIndex(new Date(Date.now()));

  // Next birth date is for next year...
  if (dates[dates.length - 1] <= currentDate) {
    currentDate = '01-01';
  }

  const nextDate: string = dates.find((date) => date >= currentDate) as string;

  return `Prochain anniversaire dans x (@todo) jours : ${calendar[nextDate].map(({ name }) => name).join(', ')}.`;
}

export function startCron(client: Client): void {
  function handle() {
    const now = new Date(Date.now());
    broadcastBirthdays(client, getCalendar()[composeDateIndex(new Date(Date.now()))] || []);
  }

  const now = new Date(Date.now());

  setTimeout(() => {
    handle();
    setInterval(handle, 3600000);
  }, 60000 * (59 - now.getMinutes()) + 1000 * (60 - now.getSeconds()));
}

export async function broadcastBirthdays(client: Client, characters: Character[]): Promise<void> {
  if (!characters.length) {
    return;
  }

  const defaultAvatar = client.user?.avatar || config.bot.avatar;
  const defaultUsername = client.user?.username || config.bot.username;

  const errors: { character?: Character, message: string }[] = [];

  await characters
    .map((character) => async () => {
      try {
        if (character.portrait) {
          try {
            await client.user?.setAvatar(character.portrait);
          } catch (e) {
            await client.user?.setAvatar(defaultAvatar);
          }
        } else {
          if (client.user?.avatar !== defaultAvatar) {
            await client.user?.setAvatar(defaultAvatar);
          }
        }

        await client.user?.setUsername(character.name);

        const channel = client.channels.cache.get(`#${config.server.channel}`);

        if (channel?.isText()) {
          await channel.send(`C'est mon anniversaire !`);
        }
      } catch (e) {
        errors.push({ character, message: e.message });
      }
    })
    .reduce(async (previousPromise, promise) => {
      await previousPromise;

      return promise();
    }, Promise.resolve());

  try {
    if (client.user?.avatar !== defaultAvatar) {
      await client.user?.setAvatar(defaultAvatar);
    }

    await client.user?.setUsername(defaultUsername);
  } catch (e) {
    errors.push({ message: e.message });
  }

  if (errors.length) {
    throw `Errors occured!\n${errors.map(({ character, message }) => `${character?.name || 'While restoring config'}: ${message}`).join('\n')}`;
  }
}
