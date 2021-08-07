jest.mock('../src/layer');

import Feature from 'ol/Feature';
import IndoorEqual, { getLayer } from '../src/';

describe('IndoorEqual', () => {
  it('get the indoorequal layer with the default url', () => {
    const map = { addLayer: jest.fn() };
    const getLayerReturn = { on: jest.fn(), setStyle: jest.fn() };
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
    const getLayerReturn = { on: jest.fn(), setStyle: jest.fn() };
    getLayer.mockReturnValueOnce(getLayerReturn);
    new IndoorEqual(map, { url: 'http://localhost:8090/' });
    expect(getLayer).toHaveBeenCalledWith('http://localhost:8090/');
  });

  it('load and add the the indoorequal layer', () => {
    const map = { addLayer: jest.fn() };
    const getLayerReturn = { on: jest.fn(), setStyle: jest.fn() };
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
      setStyle: jest.fn(),
      getSource: () => {
        return {
          on: (_eventName, callback) => tileLoadEndCallback = callback,
          getFeaturesInExtent: () => {
            return [
              new Feature({ layer: 'area', level: 0 }),
              new Feature({ layer: 'area', level: 1 }),
              new Feature({ layer: 'area', level: -2 }),
            ];
          }
        };
      }
    };
    getLayer.mockReturnValueOnce(getLayerReturn);
    const indoorEqual = new IndoorEqual(map, { apiKey: 'test' });
    expect(indoorEqual.get('levels')).toEqual([]);
    indoorEqual.on('change:levels', (levels) => {
      expect(indoorEqual.get('levels')).toEqual([1, 0, -2]);
      done();
    });
    tileLoadEndCallback();
  });

  it('allows to set the current level', () => {
    const map = { addLayer: jest.fn() };
    const getLayerReturn = { on: jest.fn(), changed: jest.fn(), setStyle: jest.fn() };
    getLayer.mockReturnValueOnce(getLayerReturn);
    const indoorEqual = new IndoorEqual(map, { apiKey: 'test' });
    expect(indoorEqual.get('level')).toEqual('0');
    indoorEqual.set('level', '1');
    expect(indoorEqual.get('level')).toEqual('1');
    expect(getLayerReturn.changed.mock.calls.length).toEqual(1);
  });

  it('allows to set a style function for features on the currently displayed level', () => {
    const map = { addLayer: jest.fn() };
    const getLayerReturn = { on: jest.fn(), setStyle: jest.fn() };
    const stylefunction = jest.fn();
    getLayer.mockReturnValueOnce(getLayerReturn);
    const indoorEqual = new IndoorEqual(map, { url: 'http://localhost:8090/' });
    indoorEqual.setStyle(stylefunction);
    expect(getLayerReturn.setStyle.mock.calls.length).toEqual(1);
    getLayerReturn.setStyle.mock.calls[0][0](new Feature({ layer: 'area', level: '0' }));
    getLayerReturn.setStyle.mock.calls[0][0](new Feature({ layer: 'area', level: '0' }));
    getLayerReturn.setStyle.mock.calls[0][0](new Feature({ layer: 'area', level: '1' }));
    expect(stylefunction.mock.calls.length).toEqual(2);
  });

  it('do not call the style function if not defined', () => {
    const map = { addLayer: jest.fn() };
    const getLayerReturn = { on: jest.fn(), setStyle: jest.fn() };
    getLayer.mockReturnValueOnce(getLayerReturn);
    const indoorEqual = new IndoorEqual(map, { url: 'http://localhost:8090/' });
    expect(() => {
      getLayerReturn.setStyle.mock.calls[0][0](new Feature({ layer: 'area', level: '0' }));
    }).not.toThrow();
  });
});
