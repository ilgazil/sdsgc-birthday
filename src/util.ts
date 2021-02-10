import fetch from 'node-fetch';
import matchAll from 'string.prototype.matchall';
import { Calendar, exportCalendar } from './store';

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

export function next(calendar: Calendar): string {
  const dates = Object.keys(calendar).sort((a, b) => a < b ? -1 : 1);

  if (!dates.length) {
    return '';
  }

  const now = new Date(Date.now());
  const month = `0${now.getMonth() + 1}`;
  const date = `0${now.getDate()}`;
  let currentDate = `${month.slice(month.length - 2)}-${date.slice(date.length - 2)}`;

  // Next birth date is for next year...
  if (dates[dates.length - 1] <= currentDate) {
    currentDate = '01-01';
  }

  const nextDate: string = dates.find((date) => date >= currentDate) as string;

  return `Prochain anniversaire dans x (@todo) jours : ${calendar[nextDate].map(({ name }) => name).join(', ')}.`;
}
