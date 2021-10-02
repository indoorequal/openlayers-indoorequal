import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import TileJSON from 'ol/source/TileJSON';
import MVT from 'ol/format/MVT';
import { fromLonLat } from 'ol/proj';
import TileGrid from 'ol/tilegrid/TileGrid';
import { Control } from 'ol/control';
import { Style, Stroke, Text, Fill, Icon } from 'ol/style';
import BaseObject from 'ol/Object';

function extentFromTileJSON(tileJSON) {
  var bounds = tileJSON.bounds;

  if (bounds) {
    var ll = fromLonLat([bounds[0], bounds[1]]);
    var tr = fromLonLat([bounds[2], bounds[3]]);
    return [ll[0], ll[1], tr[0], tr[1]];
  }
}

const defaultResolutions = function () {
  const resolutions = [];

  for (let res = 78271.51696402048; resolutions.length <= 24; res /= 2) {
    resolutions.push(res);
  }

  return resolutions;
}();

function onTileJSONLoaded(layer, tilejson) {
  const tileJSONDoc = tilejson.getTileJSON();
  const tiles = Array.isArray(tileJSONDoc.tiles) ? tileJSONDoc.tiles : [tileJSONDoc.tiles];
  const tileGrid = tilejson.getTileGrid();
  const extent = extentFromTileJSON(tileJSONDoc);
  const minZoom = tileJSONDoc.minzoom;
  const maxZoom = tileJSONDoc.maxzoom;
  const source = new VectorTileSource({
    attributions: tilejson.getAttributions(),
    format: new MVT(),
    tileGrid: new TileGrid({
      origin: tileGrid.getOrigin(0),
      extent: extent || tileGrid.getExtent(),
      minZoom: minZoom,
      resolutions: defaultResolutions.slice(0, maxZoom + 1),
      tileSize: 512
    }),
    urls: tiles
  });
  layer.setSource(source);
  layer.setVisible(true);
}

function getLayer(url, options) {
  const layer = new VectorTileLayer({
    declutter: true,
    visible: false,
    ...options
  });
  const tilejson = new TileJSON({
    url
  });
  tilejson.on('change', function () {
    const state = tilejson.getState();

    if (state === 'ready') {
      onTileJSONLoaded(layer, tilejson);
    }
  });

  if (tilejson.getState() === 'ready') {
    tilejson.changed();
  }

  return layer;
}

/**
 * A control to display the available levels
 * @param {IndoorEqual} indoorEqual the IndoorEqual instance
 * @param {object} options
 * @param {string} [options.target] Specify a target if you want the control to be rendered outside of the map's viewport.
 * @return {LevelControl} `this`
 */

class LevelControl extends Control {
  constructor(indoorEqual, options = {}) {
    const element = document.createElement('div');
    element.className = 'level-control ol-unselectable ol-control';
    super({
      element,
      target: options.target
    });
    this.indoorEqual = indoorEqual;

    this._renderNewLevels();

    this.indoorEqual.on('change:levels', this._renderNewLevels.bind(this));
    this.indoorEqual.on('change:level', this._renderNewLevels.bind(this));
  }

  _renderNewLevels() {
    this.element.innerHTML = '';
    const currentLevel = this.indoorEqual.get('level');
    this.indoorEqual.get('levels').forEach(level => {
      const button = document.createElement('button');

      if (currentLevel === level) {
        button.classList.add('level-control-active');
      }

      button.textContent = level;
      button.addEventListener('click', () => {
        this.indoorEqual.set('level', level);
      });
      this.element.appendChild(button);
    });
  }

}

function areaLayer(feature, resolution) {
  const properties = feature.getProperties();

  if (properties.class === 'level') {
    return;
  }

  let color = '#fdfcfa';

  if (properties.access && ['no', 'private'].includes(properties.access)) {
    color = '#F2F1F0';
  } else if (properties.is_poi && properties.class !== 'corridor') {
    color = '#D4EDFF';
  } else if (properties.class === 'room') {
    color = '#fefee2';
  }

  let stroke;

  if (properties.layer === 'area' && ['area', 'corridor', 'plaform'].includes(properties.class)) {
    stroke = new Stroke({
      color: '#bfbfbf',
      width: 1
    });
  }

  if (properties.layer === 'area' && properties.class === 'column') {
    color = '#bfbfbf';
  }

  if (properties.layer === 'area' && ['room', 'wall'].includes(properties.class)) {
    stroke = new Stroke({
      color: 'gray',
      width: 2
    });
  }

  return new Style({
    fill: new Fill({
      color
    }),
    stroke
  });
}

function transportationLayer(feature, resolution) {
  return new Style({
    stroke: new Stroke({
      color: 'gray',
      width: 2,
      lineDash: [4, 7]
    })
  });
}

function areanameLayer(feature, resolution) {
  return new Style({
    text: new Text({
      font: '13px Noto Sans Regular, sans-serif',
      text: feature.getProperties().name,
      fill: new Fill({
        color: '#666'
      }),
      stroke: new Stroke({
        color: 'white',
        width: 1
      })
    })
  });
}

function poiLayer(feature, resolution, map, sprite) {
  const properties = feature.getProperties();
  const zoom = map.getView().getZoomForResolution(resolution);

  if (zoom < 19 && ['waste_basket', 'information', 'vending_machine'].includes(properties.class)) {
    return;
  }

  let icon;

  if (sprite) {
    const iconDef = sprite.json['indoorequal-' + properties.subclass] || sprite.json['indoorequal-' + properties.class];

    if (iconDef) {
      icon = new Icon({
        img: sprite.png,
        size: [iconDef.width, iconDef.height],
        offset: [iconDef.x, iconDef.y],
        imgSize: [sprite.png.width, sprite.png.height]
      });
    }
  }

  return new Style({
    text: new Text({
      font: '11px Noto Sans Regular, sans-serif',
      text: properties.name,
      fill: new Fill({
        color: '#666'
      }),
      offsetY: 18,
      stroke: new Stroke({
        color: 'white',
        width: 1
      })
    }),
    image: icon
  });
}

function loadAsImage(spriteImageUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = function () {
      img.onload = null;
      resolve(img);
    };

    img.onerror = reject;
    img.src = spriteImageUrl;
  });
}

async function loadSprite(basePath) {
  const spriteScale = window.devicePixelRatio >= 1.5 ? 0.5 : 1;
  const sizeFactor = spriteScale == 0.5 ? '@2x' : '';
  let spriteUrl = basePath + sizeFactor + '.json';
  const spriteJSON = await (await fetch(spriteUrl, {
    credentials: 'same-origin'
  })).json();
  const spritePNG = await loadAsImage(basePath + sizeFactor + '.png');
  return {
    json: spriteJSON,
    png: spritePNG
  };
}

function defaultStyle(map, layer, spriteBaseUrl) {
  let sprite = null;

  if (spriteBaseUrl) {
    loadSprite(spriteBaseUrl).then(spriteData => {
      layer.changed();
      sprite = spriteData;
    });
  }

  return function (feature, resolution) {
    const properties = feature.getProperties();

    if (properties.layer === 'area') {
      return areaLayer(feature);
    }

    if (properties.layer === 'transportation') {
      return transportationLayer();
    }

    if (properties.layer === 'area_name') {
      return areanameLayer(feature);
    }

    if (properties.layer === 'poi' && feature.getType() === 'Point') {
      return poiLayer(feature, resolution, map, sprite);
    }
  };
}

function findAllLevels(features) {
  const levels = [];

  for (let i = 0; i < features.length; i++) {
    const feature = features[i];
    const properties = feature.getProperties();

    if (properties.layer !== 'area' || properties.class === 'level') {
      continue;
    }

    const level = properties.level;

    if (!levels.includes(level)) {
      levels.push(level);
    }
  }

  return levels.sort((a, b) => a - b).reverse();
}

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

class IndoorEqual extends BaseObject {
  constructor(map, options = {}) {
    const defaultOpts = {
      url: 'https://tiles.indoorequal.org/',
      defaultStyle: true,
      spriteBaseUrl: null
    };
    const opts = { ...defaultOpts,
      ...options
    };

    if (opts.url === defaultOpts.url && !opts.apiKey) {
      throw 'You must register your apiKey at https://indoorequal.com before and set it as apiKey param.';
    }

    super({
      levels: [],
      level: '0'
    });
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
      source.on('tileloadend', () => {
        const extent = this.map.getView().calculateExtent(this.map.getSize());
        const features = source.getFeaturesInExtent(extent);
        this.set('levels', findAllLevels(features));
      });
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

export { LevelControl, IndoorEqual as default, defaultStyle, getLayer };
