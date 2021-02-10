import { addToCalendar, composeCalendar, getCalendar, importCalendar, isImport, isImportEntry, InvalidImportError, exportCalendar } from '../src/store';

describe('store', () => {
  describe('isImportEntry', () => {
    const badEntries = [
      null,
      'foo',
      123,
      { portrait: null, birthdate: '01-01' },
      { portrait: 123, birthdate: '01-01' },
      { portrait: {}, birthdate: '01-01' },
      { birthdate: '1-1' },
      { birthdate: '01-01', gift: null },
      { birthdate: '01-01', gift: 123 },
      { birthdate: '01-01', gift: {}, },
      { birthdate: '01-01', location: null },
      { birthdate: '01-01', location: 123 },
      { birthdate: '01-01', location: {}, },
    ];

    const goodEntries = [
      { portrait: 'some-url', birthdate: '01-01' },
      { birthdate: '01-01' },
      { birthdate: '01-01', gift: 'Some gift' },
      { birthdate: '01-01', location: 'Some place' },
    ];

    it.each(badEntries)('should deny %p', (character) => {
      expect(isImportEntry(character)).toBeFalsy();
    });

    it.each(goodEntries)('should accept %p', (character) => {
      expect(isImportEntry(character)).toBeTruthy();
    });
  });

  describe('isImport', () => {
    const badEntries = [
      null,
      'foo',
      123,
      [{ birthdate: '1-1' }],
      { '': { birthdate: '1-1' } },
    ];

    it.each(badEntries)('should deny %p', (calendar) => {
      expect(isImport(calendar)).toBeFalsy();
    });

    it('should accept a well formatted entry', () => {
      expect(isImport({ 'Foo': { birthdate: '01-01' } })).toBeTruthy();
    });
  });

  describe('importCalendar', () => {
    it('should throw if import is wrong', () => {
      expect(() => importCalendar('123')).toThrowError(new InvalidImportError('Invalid import'));
    });

    it('should properly import calendar', () => {
      expect(importCalendar(`{"Foo":{"birthdate":"01-01"},"Bar":{"birthdate":"01-02"},"Baz":{"birthdate":"01-01"}}`)).toBe('Calendrier importé avec succès.');
      expect(getCalendar()).toEqual({
        '01-01': [
          { name: 'Baz', birthdate: '01-01' },
          { name: 'Foo', birthdate: '01-01' },
        ],
        '01-02': [
          { name: 'Bar', birthdate: '01-02' },
        ],
      });
    });
  });

  describe('addToCalendar', () => {
    it('should throw if import is wrong', () => {
      expect(() => addToCalendar('123')).toThrowError(new InvalidImportError('Invalid import'));
    });

    it('should properly add to existing calendar', () => {
      importCalendar(`{"Foo":{"birthdate":"01-01"}}`);

      expect(addToCalendar('{"Bar":{"birthdate":"01-02"},"Baz":{"birthdate":"01-01"}}')).toBe('Calendrier mis à jour avec succès.');

      expect(getCalendar()).toEqual({
        '01-01': [
          { name: 'Baz', birthdate: '01-01' },
          { name: 'Foo', birthdate: '01-01' },
        ],
        '01-02': [
          { name: 'Bar', birthdate: '01-02' },
        ],
      });
    });

    it('should properly update entries in existing calendar', () => {
      importCalendar(`{"Foo":{"birthdate":"01-01"}}`);
      addToCalendar('{"Foo":{"birthdate":"01-02"}}');

      expect(getCalendar()).toEqual({
        '01-02': [
          { name: 'Foo', birthdate: '01-02' },
        ],
      });
    });
  });

  describe('exportCalendar', () => {
    importCalendar(`{"Foo":{"birthdate":"01-01"},"Bar":{"birthdate":"01-02"}}`);

    expect(exportCalendar(getCalendar())).toEqual({
      Bar: { birthdate: '01-02' },
      Foo: { birthdate: '01-01' },
    });
  });
});
