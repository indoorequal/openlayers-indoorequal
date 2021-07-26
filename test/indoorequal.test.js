jest.mock('../src/layer');

import Feature from 'ol/Feature';
import IndoorEqual, { getLayer } from '../src/';

describe('IndoorEqual', () => {
  it('get the indoorequal layer with the default url', () => {
    const map = { addLayer: jest.fn() };
    const getLayerReturn = { on: jest.fn() };
    getLayer.mockReturnValueOnce(getLayerReturn);
    new IndoorEqual(map, { apiKey: 'test' });
    expect(getLayer).toHaveBeenCalledWith('https://tiles.indoorequal.org/?key=test');
  });

  it('throws an error if the apiKey is not defined with the default tiles url', () => {
    expect(() => {
      new IndoorEqual({});
    }).toThrow('You must register your apiKey at https://indoorequal.com before and set it as apiKey param.');
  });

  it('get the indoorequal layer with the user defined url', () => {
    const map = { addLayer: jest.fn() };
    const getLayerReturn = { on: jest.fn() };
    getLayer.mockReturnValueOnce(getLayerReturn);
    new IndoorEqual(map, { url: 'http://localhost:8090/' });
    expect(getLayer).toHaveBeenCalledWith('http://localhost:8090/');
  });

  it('load and add the the indoorequal layer', () => {
    const map = { addLayer: jest.fn() };
    const getLayerReturn = { on: jest.fn() };
    getLayer.mockReturnValueOnce(getLayerReturn);
    new IndoorEqual(map, { apiKey: 'test' });
    expect(map.addLayer.mock.calls.length).toEqual(1);
  });

  it('expose the available levels', (done) => {
    let tileLoadEndCallback;

    const map = {
      addLayer: jest.fn(),
      getView: () => {
        return {
          calculateExtent: () => 1
        };
      },
      getSize: jest.fn(),
    };
    const getLayerReturn = {
      on: (_eventName, callback) => callback(),
      getSource: () => {
        return {
          on: (_eventName, callback) => tileLoadEndCallback = callback,
          getFeaturesInExtent: () => {
            return [
              new Feature({ layer: 'area', level: 0 }),
              new Feature({ layer: 'area', level: 1 }),
              new Feature({ layer: 'area', level: -2 }),
              new Feature({ layer: 'poi',  level: 3 }),
            ];
          }
        };
      }
    };
    getLayer.mockReturnValueOnce(getLayerReturn);
    const indoorequal = new IndoorEqual(map, { apiKey: 'test' });
    expect(indoorequal.get('levels')).toEqual([]);
    indoorequal.on('change:levels', (levels) => {
      expect(indoorequal.get('levels')).toEqual([1, 0, -2]);
      done();
    });
    tileLoadEndCallback();
  });
});
