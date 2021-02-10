interface ImportEntry {
  portrait?: string;
  birthdate: string;
  gift?: string;
  location?: string;
};
type Import = Record<string, ImportEntry>;

export interface Character extends ImportEntry {
  name: string;
}

export type Calendar = Record<string, Character[]>;

export class InvalidImportError extends Error {};

let calendar: Calendar = {};

export function isImportEntry(character: any): character is Character {
  if (!character || typeof character !== 'object') {
    return false;
  }

  if ('portrait' in character && typeof character['portrait'] !== 'string') {
    return false;
  }

  if (!(/\d{2}-\d{2}/.exec(character['birthdate']))) {
    return false;
  }

  if ('gift' in character && typeof character['gift'] !== 'string') {
    return false;
  }

  if ('location' in character && typeof character['location'] !== 'string') {
    return false;
  }

  return true;
}

export function isImport(importedCalendar: any): importedCalendar is Import {
  if (!importedCalendar || typeof importedCalendar !== 'object') {
    return false;
  }

  return Object.keys(importedCalendar).every((name) => {
    if (!name) {
      return false;
    }

    return isImportEntry(importedCalendar[name]);
  });
}

export function composeCalendar(input: Import): Calendar {
  return Object.keys(input).reduce((calendar: Calendar, name) => {
    const birthdate = input[name].birthdate;

    if (!(birthdate in calendar)) {
      calendar[birthdate] = [];
    }

    calendar[birthdate].push({
      ...input[name],
      name,
    });

    return calendar;
  }, {});
}

export function composeImport(calendar: Calendar): Import {
  return Object.keys(calendar).reduce((output: Import, date) => {
    calendar[date].forEach((character) => output[character.name] = {
      portrait: character.portrait,
      birthdate: character.birthdate,
      gift: character.gift,
      location: character.location,
    })

    return output;
  }, {});
}

export function sortImport(input: Import): Import {
  return Object.keys(input).sort((a, b) => a > b ? 1 : -1).reduce((sortedInput: Import, name) => {
    sortedInput[name] = input[name];

    return sortedInput;
  }, {});
}

export function importCalendar(raw: string): string {
  const importedCalendar = JSON.parse(raw);

  if (!isImport(importedCalendar)) {
    throw new InvalidImportError('Invalid import');
  }

  calendar = composeCalendar(sortImport(importedCalendar));

  return `Calendrier importé avec succès.`;
}

export function exportCalendar(calendar: Calendar): Import {
  return sortImport(composeImport(calendar));
}

export function addToCalendar(raw: string): string {
  const input = JSON.parse(raw);

  if (!isImport(input)) {
    throw new InvalidImportError('Invalid import');
  }

  calendar = composeCalendar(sortImport({
    ...composeImport(calendar),
    ...input,
  }));

  return `Calendrier mis à jour avec succès.`;
}

export function getCalendar(): Calendar {
  return calendar;
}
