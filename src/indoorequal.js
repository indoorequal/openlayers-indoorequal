import BaseObject from 'ol/Object';
import { getLayer } from './layer';
import findAllLevels from './levels';

/**
 * Load the indoor= source and layers in your map.
 * @param {object} map the OpenLayers instance of the map
 * @param {object} options
 * @param {url} [options.url] Override the default tiles URL (https://tiles.indoorequal.org/).
 * @param {string} [options.apiKey] The API key if you use the default tile URL (get your free key at [indoorequal.com](https://indoorequal.com)).
 * @return {IndoorEqual} `this`
 */
export default class IndoorEqual extends BaseObject {
  constructor(map, options = {}) {
    const defaultOpts = { url: 'https://tiles.indoorequal.org/' };
    const opts = { ...defaultOpts, ...options };
    if (opts.url === defaultOpts.url && !opts.apiKey) {
      throw 'You must register your apiKey at https://indoorequal.com before and set it as apiKey param.';
    }
    super({ levels: [] });

    this.map = map;
    this.url = opts.url;
    this.apiKey = opts.apiKey;

    this._addLayer();
  }

  _addLayer() {
    const urlParams = this.apiKey ? `?key=${this.apiKey}` : '';
    this.layer = getLayer(`${this.url}${urlParams}`);
    this.map.addLayer(this.layer);

    this._listenForLevels();
  }

  _listenForLevels() {
    this.layer.on('change:source', () => {
      const source = this.layer.getSource();

      source.on('tileloadend', () => {
        const extent = this.map.getView().calculateExtent(this.map.getSize());
        const features = source.getFeaturesInExtent(extent);
        const areaFeatures = features.filter((feature) => {
          return feature.getProperties().layer === 'area';
        });
        this.set('levels', findAllLevels(areaFeatures));
      });
    });
  }
}
