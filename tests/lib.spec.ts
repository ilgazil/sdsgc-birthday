import { next } from '../src/lib';

describe('lib', () => {
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
          new Date('2021-09-04T12:45:07.135Z').valueOf()
        );

      expect(next({
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
