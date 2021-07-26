import { getLayer } from './layer';

/**
 * Load the indoor= source and layers in your map.
 * @param {object} map the OpenLayers instance of the map
 * @param {object} options
 * @param {url} [options.url] Override the default tiles URL (https://tiles.indoorequal.org/).
 * @param {string} [options.apiKey] The API key if you use the default tile URL (get your free key at [indoorequal.com](https://indoorequal.com)).
 * @return {IndoorEqual} `this`
 */
export default class IndoorEqual {
  constructor(map, options = {}) {
    const defaultOpts = { url: 'https://tiles.indoorequal.org/' };
    const opts = { ...defaultOpts, ...options };
    if (opts.url === defaultOpts.url && !opts.apiKey) {
      throw 'You must register your apiKey at https://indoorequal.com before and set it as apiKey param.';
    }
    const urlParams = opts.apiKey ? `?key=${opts.apiKey}` : '';
    map.addLayer(getLayer(`${opts.url}${urlParams}`));
  }
}
