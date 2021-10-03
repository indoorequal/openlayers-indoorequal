import BaseObject from 'ol/Object';
import debounce from 'debounce';

import { getLayer } from './layer';
import findAllLevels from './levels';
import defaultStyle from './defaultstyle';

/**
 * Load the indoor= source and layers in your map.
 * @param {object} map the OpenLayers instance of the map
 * @param {object} options
 * @param {boolean} [options.defaultStyle] False to not set the default style. Default true.
 * @param {string} [options.spriteBaseUrl] The base url of the sprite (without .json or .png). If not set, no sprite will be used in the default style.
 * @param {string} [options.url] Override the default tiles URL (https://tiles.indoorequal.org/).
 * @param {string} [options.apiKey] The API key if you use the default tile URL (get your free key at [indoorequal.com](https://indoorequal.com)).
 * @fires change:levels
 * @fires change:level
 * @return {IndoorEqual} `this`
 */
export default class IndoorEqual extends BaseObject {
  constructor(map, options = {}) {
    const defaultOpts = { url: 'https://tiles.indoorequal.org/', defaultStyle: true, spriteBaseUrl: null };
    const opts = { ...defaultOpts, ...options };
    if (opts.url === defaultOpts.url && !opts.apiKey) {
      throw 'You must register your apiKey at https://indoorequal.com before and set it as apiKey param.';
    }
    super({ levels: [], level: '0' });

    this.map = map;
    this.url = opts.url;
    this.apiKey = opts.apiKey;

    this._addLayer();
    this.styleFunction = opts.defaultStyle ? defaultStyle(this.map, this.layer, opts.spriteBaseUrl) : null;
    this._changeLayerOnLevelChange();
    this._setLayerStyle();
  }

  /**
   * Set the style for displayed features. This function takes a feature and resolution and returns an array of styles. If set to null, the layer has no style (a null style), so only features that have their own styles will be rendered in the layer. Call setStyle() without arguments to reset to the default style. See module:ol/style for information on the default style.
   * @param {function} styleFunction the style function
   */
  setStyle(styleFunction) {
    this.styleFunction = styleFunction;
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

      const refreshLevels = debounce(() => {
        const extent = this.map.getView().calculateExtent(this.map.getSize());
        const features = source.getFeaturesInExtent(extent);
        this.set('levels', findAllLevels(features));
      }, 1000);

      source.on('tileloadend', refreshLevels);
      this.map.getView().on('change:center', refreshLevels);
    });
  }

  _changeLayerOnLevelChange() {
    this.on('change:level', () => {
      this.layer.changed();
    });
  }

  _setLayerStyle() {
    this.layer.setStyle((feature, resolution) => {
      if (feature.getProperties().level === this.get('level')) {
        return this.styleFunction && this.styleFunction(feature, resolution);
      }
    });
  }
}

/**
 * Emitted when the list of available levels has been updated
 *
 * @event IndoorEqual#change:levels
 * @type {array}
 */

/**
 * Emitted when the current level has been updated
 *
 * @event IndoorEqual#levelchange
 * @type {string} always emitted when the level displayed has changed
 */
