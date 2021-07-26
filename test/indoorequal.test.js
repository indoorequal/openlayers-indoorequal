jest.mock('../src/layer');

import IndoorEqual, { getLayer } from '../src/';

describe('IndoorEqual', () => {
  it('get the indoorequal layer with the default url', () => {
    const map = { addLayer: () => {} };
    new IndoorEqual(map, { apiKey: 'test' });
    expect(getLayer).toHaveBeenCalledWith('https://tiles.indoorequal.org/?key=test');
  });

  it('throws an error if the apiKey is not defined with the default tiles url', () => {
    expect(() => {
      new IndoorEqual({});
    }).toThrow('You must register your apiKey at https://indoorequal.com before and set it as apiKey param.');
  });

  it('get the indoorequal layer with the user defined url', () => {
    const map = { addLayer: () => {} };
    new IndoorEqual(map, { url: 'http://localhost:8090/' });
    expect(getLayer).toHaveBeenCalledWith('http://localhost:8090/');
  });

  it('load and add the the indoorequal layer', () => {
    const addLayerMock = jest.fn();
    const map = { addLayer: addLayerMock };
    new IndoorEqual(map, { apiKey: 'test' });
    expect(addLayerMock.mock.calls.length).toEqual(1);
  });
});
