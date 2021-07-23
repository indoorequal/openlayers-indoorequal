import Feature from 'ol/Feature';
import findAllLevels from '../src/levels';

describe('findAllLevels', () => {
  it('find one level', () => {
    expect(findAllLevels([
      new Feature({ level: 0 }),
      new Feature({ level: 0 })
    ])).toEqual([0]);
  });

  it('find multiple levels', () => {
    expect(findAllLevels([
      new Feature({ level: 0 }),
      new Feature({ level: 1 })
    ])).toEqual([1, 0]);
  });

  it('sort levels', () => {
    expect(findAllLevels([
      new Feature({ level: 1 }),
      new Feature({ level: 0 })
    ])).toEqual([1, 0]);
  });

   it('sort levels with minus', () => {
    expect(findAllLevels([
      new Feature({ level: 1 }),
      new Feature({ level: -1 }),
      new Feature({ level: -2 }),
      new Feature({ level: 0  })
    ])).toEqual([1, 0, -1, -2]);
  });

  it('ignore levels from indoor=level', () => {
    expect(findAllLevels([
      new Feature({ level: 0 }),
      new Feature({ class: 'level', level: 1 })
    ])).toEqual([0]);
  });

  it('find zero levels', () => {
    expect(findAllLevels([])).toEqual([]);
  });
});
