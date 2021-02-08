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

let calendar: Calendar = {};

export function isImportEntry(character: unknown): character is Character {
  if (!character || typeof character !== 'object') {
    return false;
  }

  return (typeof character['portrait'] === 'string' || typeof character['portrait'] === 'undefined') &&
    !!(/\d{2}-\d{2}/.exec(character['birthdate'])) &&
    (typeof character['gift'] === 'string' || typeof character['gift'] === 'undefined') &&
    (typeof character['location'] === 'string' || typeof character['location'] === 'undefined')
  ;
}

export function isImport(importedCalendar: unknown): importedCalendar is Import {
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

export function composeCalendar(importedCalendar: Import): Calendar {
  return Object.keys(importedCalendar).reduce((calendar, name) => {
    const birthdate = importedCalendar[name].birthdate;

    if (!(birthdate in calendar)) {
      calendar[birthdate] = [];
    }

    calendar[birthdate].push({
      ...importedCalendar[name],
      name,
    });

    return calendar;
  }, {});
}

export function importCalendar(raw: string): string {
  const importedCalendar = JSON.parse(raw);

  if (!isImport(importedCalendar)) {
    throw 'Invalid import';
  }

  calendar = composeCalendar(importedCalendar);

  return `Calendrier importé avec ${Object.keys(calendar).length} anniversaires.`;
}

export function addToCalendar(raw: string): string {
  const importedCalendar = JSON.parse(raw);

  if (!isImport(importedCalendar)) {
    throw 'Invalid import';
  }

  calendar = {
    ...calendar,
    ...composeCalendar(importedCalendar),
  };

  return `${Object.keys(importedCalendar).length} anniversaires importés (ou mis à jour).`;
}

export function getCalendar(): Calendar {
  return calendar;
}
