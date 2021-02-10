import fetch from 'node-fetch';
import { missing, next } from '../src/util';

jest.mock('node-fetch', () => jest.fn());

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
});
