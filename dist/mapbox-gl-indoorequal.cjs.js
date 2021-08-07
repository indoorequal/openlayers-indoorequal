'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var VectorTileLayer = require('ol/layer/VectorTile');
var VectorTileSource = require('ol/source/VectorTile');
var TileJSON = require('ol/source/TileJSON');
var MVT = require('ol/format/MVT');
var proj_js = require('ol/proj.js');
var TileGrid = require('ol/tilegrid/TileGrid.js');
var control = require('ol/control');
var BaseObject = require('ol/Object');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var VectorTileLayer__default = /*#__PURE__*/_interopDefaultLegacy(VectorTileLayer);
var VectorTileSource__default = /*#__PURE__*/_interopDefaultLegacy(VectorTileSource);
var TileJSON__default = /*#__PURE__*/_interopDefaultLegacy(TileJSON);
var MVT__default = /*#__PURE__*/_interopDefaultLegacy(MVT);
var TileGrid__default = /*#__PURE__*/_interopDefaultLegacy(TileGrid);
var BaseObject__default = /*#__PURE__*/_interopDefaultLegacy(BaseObject);

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);

    if (enumerableOnly) {
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }

    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();

  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
        result;

    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;

      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
}

function extentFromTileJSON(tileJSON) {
  var bounds = tileJSON.bounds;

  if (bounds) {
    var ll = proj_js.fromLonLat([bounds[0], bounds[1]]);
    var tr = proj_js.fromLonLat([bounds[2], bounds[3]]);
    return [ll[0], ll[1], tr[0], tr[1]];
  }
}

var defaultResolutions = function () {
  var resolutions = [];

  for (var res = 78271.51696402048; resolutions.length <= 24; res /= 2) {
    resolutions.push(res);
  }

  return resolutions;
}();

function onTileJSONLoaded(layer, tilejson) {
  var tileJSONDoc = tilejson.getTileJSON();
  var tiles = Array.isArray(tileJSONDoc.tiles) ? tileJSONDoc.tiles : [tileJSONDoc.tiles];
  var tileGrid = tilejson.getTileGrid();
  var extent = extentFromTileJSON(tileJSONDoc);
  var minZoom = tileJSONDoc.minzoom;
  var maxZoom = tileJSONDoc.maxzoom;
  var source = new VectorTileSource__default['default']({
    attributions: tilejson.getAttributions(),
    format: new MVT__default['default'](),
    tileGrid: new TileGrid__default['default']({
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
  var layer = new VectorTileLayer__default['default'](_objectSpread2({
    declutter: true,
    visible: false
  }, options));
  var tilejson = new TileJSON__default['default']({
    url: url
  });
  tilejson.on('change', function () {
    var state = tilejson.getState();

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
 * @param {url} [options.target] Specify a target if you want the control to be rendered outside of the map's viewport.
 * @return {LevelControl} `this`
 */

var LevelControl = /*#__PURE__*/function (_Control) {
  _inherits(LevelControl, _Control);

  var _super = _createSuper(LevelControl);

  function LevelControl(indoorEqual) {
    var _this;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, LevelControl);

    var element = document.createElement('div');
    element.className = 'level-control ol-unselectable ol-control';
    _this = _super.call(this, {
      element: element,
      target: options.target
    });
    _this.indoorEqual = indoorEqual;

    _this._renderNewLevels();

    _this.indoorEqual.on('change:levels', _this._renderNewLevels.bind(_assertThisInitialized(_this)));

    _this.indoorEqual.on('change:level', _this._renderNewLevels.bind(_assertThisInitialized(_this)));

    return _this;
  }

  _createClass(LevelControl, [{
    key: "_renderNewLevels",
    value: function _renderNewLevels() {
      var _this2 = this;

      this.element.innerHTML = '';
      var currentLevel = this.indoorEqual.get('level');
      this.indoorEqual.get('levels').forEach(function (level) {
        var button = document.createElement('button');

        if (currentLevel === level) {
          button.classList.add('level-control-active');
        }

        button.textContent = level;
        button.addEventListener('click', function () {
          _this2.indoorEqual.set('level', level);
        });

        _this2.element.appendChild(button);
      });
    }
  }]);

  return LevelControl;
}(control.Control);

function findAllLevels(features) {
  var levels = [];

  for (var i = 0; i < features.length; i++) {
    var feature = features[i];
    var properties = feature.getProperties();

    if (properties.layer !== 'area' || properties["class"] === 'level') {
      continue;
    }

    var level = properties.level;

    if (!levels.includes(level)) {
      levels.push(level);
    }
  }

  return levels.sort(function (a, b) {
    return a - b;
  }).reverse();
}

/**
 * Load the indoor= source and layers in your map.
 * @param {object} map the OpenLayers instance of the map
 * @param {object} options
 * @param {url} [options.url] Override the default tiles URL (https://tiles.indoorequal.org/).
 * @param {string} [options.apiKey] The API key if you use the default tile URL (get your free key at [indoorequal.com](https://indoorequal.com)).
 * @fires change:levels
 * @fires change:level
 * @return {IndoorEqual} `this`
 */

var IndoorEqual = /*#__PURE__*/function (_BaseObject) {
  _inherits(IndoorEqual, _BaseObject);

  var _super = _createSuper(IndoorEqual);

  function IndoorEqual(map) {
    var _this;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, IndoorEqual);

    var defaultOpts = {
      url: 'https://tiles.indoorequal.org/'
    };

    var opts = _objectSpread2(_objectSpread2({}, defaultOpts), options);

    if (opts.url === defaultOpts.url && !opts.apiKey) {
      throw 'You must register your apiKey at https://indoorequal.com before and set it as apiKey param.';
    }

    _this = _super.call(this, {
      levels: [],
      level: '0'
    });
    _this.map = map;
    _this.url = opts.url;
    _this.apiKey = opts.apiKey;
    _this.styleFunction = null;

    _this._addLayer();

    _this._changeLayerOnLevelChange();

    _this._setLayerStyle();

    return _this;
  }
  /**
   * Set the style for displayed features. This function takes a feature and resolution and returns an array of styles. If set to null, the layer has no style (a null style), so only features that have their own styles will be rendered in the layer. Call setStyle() without arguments to reset to the default style. See module:ol/style for information on the default style.
   * @param {function} styleFunction the style function
   */


  _createClass(IndoorEqual, [{
    key: "setStyle",
    value: function setStyle(styleFunction) {
      this.styleFunction = styleFunction;
    }
  }, {
    key: "_addLayer",
    value: function _addLayer() {
      var urlParams = this.apiKey ? "?key=".concat(this.apiKey) : '';
      this.layer = getLayer("".concat(this.url).concat(urlParams));
      this.map.addLayer(this.layer);

      this._listenForLevels();
    }
  }, {
    key: "_listenForLevels",
    value: function _listenForLevels() {
      var _this2 = this;

      this.layer.on('change:source', function () {
        var source = _this2.layer.getSource();

        source.on('tileloadend', function () {
          var extent = _this2.map.getView().calculateExtent(_this2.map.getSize());

          var features = source.getFeaturesInExtent(extent);

          _this2.set('levels', findAllLevels(features));
        });
      });
    }
  }, {
    key: "_changeLayerOnLevelChange",
    value: function _changeLayerOnLevelChange() {
      var _this3 = this;

      this.on('change:level', function () {
        _this3.layer.changed();
      });
    }
  }, {
    key: "_setLayerStyle",
    value: function _setLayerStyle() {
      var _this4 = this;

      this.layer.setStyle(function (feature, resolution) {
        if (feature.getProperties().level === _this4.get('level')) {
          return _this4.styleFunction && _this4.styleFunction(feature, resolution);
        }
      });
    }
  }]);

  return IndoorEqual;
}(BaseObject__default['default']);

exports.LevelControl = LevelControl;
exports['default'] = IndoorEqual;
exports.getLayer = getLayer;
