import BaseObject from 'ol/Object';
import debounce from 'debounce';

import { loadSourceFromTileJSON, getLayer, getHeatmapLayer, createHeatmapSource } from './layer';
import findAllLevels from './levels';
import defaultStyle from './defaultstyle';

/**
 * Load the indoor= source and layers in your map.
 * @param {Object} map the OpenLayers instance of the map
 * @param {Object} options
 * @param {boolean} [options.defaultStyle] False to not set the default style. Default true.
 * @param {string} [options.spriteBaseUrl] The base url of the sprite (without .json or .png). If not set, no sprite will be used in the default style.
 * @param {string} [options.url] Override the default tiles URL (https://tiles.indoorequal.org/).
 * @param {string} [options.apiKey] The API key if you use the default tile URL (get your free key at [indoorequal.com](https://indoorequal.com)).
 * @param {boolean} [options.heatmap] Should the heatmap layer be visible at start (true : visible, false : hidden). Defaults to true/visible.
 * @fires change:levels
 * @fires change:level
 * @return {IndoorEqual} `this`
 */
export default class IndoorEqual extends BaseObject {
  constructor(map, options = {}) {
    const defaultOpts = { url: 'https://tiles.indoorequal.org/', defaultStyle: true, spriteBaseUrl: null, heatmap: true };
    const opts = { ...defaultOpts, ...options };
    if (opts.url === defaultOpts.url && !opts.apiKey) {
      throw 'You must register your apiKey at https://indoorequal.com before and set it as apiKey param.';
    }
    super({ levels: [], level: '0' });

    this.map = map;
    this.url = opts.url;
    this.apiKey = opts.apiKey;

    this._createLayers(opts.heatmap);
    this._loadSource();
    this.styleFunction = opts.defaultStyle ? defaultStyle(this.map, this.indoorLayer, opts.spriteBaseUrl) : null;
    this._changeLayerOnLevelChange();
    this._setLayerStyle();
    this._resetLevelOnLevelsChange();
  }

  /**
   * Set the style for displayed features. This function takes a feature and resolution and returns an array of styles. If set to null, the layer has no style (a null style), so only features that have their own styles will be rendered in the layer. Call setStyle() without arguments to reset to the default style. See module:ol/style for information on the default style.
   * @param {function} styleFunction the style function
   */
  setStyle(styleFunction) {
    this.styleFunction = styleFunction;
  }

  /**
   * Change the heatmap layer visibility
   * @param {boolean} visible True to make it visible, false to hide it
   */
  setHeatmapVisible(visible) {
    this.heatmapLayer.setVisible(visible);
  }

  async _loadSource() {
    const urlParams = this.apiKey ? `?key=${this.apiKey}` : '';
    this.source = await loadSourceFromTileJSON(`${this.url}${urlParams}`);

    this.indoorLayer.setSource(this.source);
    this.heatmapLayer.setSource(createHeatmapSource(this.source));
    this._listenForLevels();
  }

  _createLayers(heatmapVisible) {
    this.indoorLayer = getLayer();
    this.heatmapLayer = getHeatmapLayer({ visible: heatmapVisible });
    [this.indoorLayer, this.heatmapLayer].forEach((layer) => {
      this.map.addLayer(layer);
    });
  }

  _listenForLevels() {
    const source = this.source;

    const refreshLevels = debounce(() => {
      const extent = this.map.getView().calculateExtent(this.map.getSize());
      const features = source.getFeaturesInExtent(extent);
      this.set('levels', findAllLevels(features));
    }, 1000);

    source.on('tileloadend', refreshLevels);
    this.map.getView().on('change:center', refreshLevels);
  }

  _changeLayerOnLevelChange() {
    this.on('change:level', () => {
      this.indoorLayer.changed();
    });
  }

  _setLayerStyle() {
    this.indoorLayer.setStyle((feature, resolution) => {
      if (feature.getProperties().level === this.get('level')) {
        return this.styleFunction && this.styleFunction(feature, resolution);
      }
    });
  }

  _resetLevelOnLevelsChange() {
    this.on('change:levels', () => {
      if (!this.get('levels').includes(this.get('level'))) {
        this.set('level', '0');
      }
    });
  }
}

/**
 * Emitted when the list of available levels has been updated
 *
 * @event IndoorEqual#change:levels
 * @type {Array}
 */

/**
 * Emitted when the current level has been updated
 *
 * @event IndoorEqual#levelchange
 * @type {string} always emitted when the level displayed has changed
 */
