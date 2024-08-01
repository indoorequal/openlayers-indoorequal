# openlayers-indoorequal ![build](https://img.shields.io/github/actions/workflow/status/indoorequal/openlayers-indoorequal/ci.yml?branch=main) [![npm](https://img.shields.io/npm/v/openlayers-indoorequal)](https://www.npmjs.com/package/openlayers-indoorequal)

openlayers-indoorequal is an [OpenLayers][ol] library to display indoor data from [indoor=][].

It provides:

*   a default style of the indoor tiles
*   a way to customize the style
*   a level control to change the level displayed on the map
*   a programatic API to list the levels available and set the level displayed

[**See the demo**](https://indoorequal.github.io/openlayers-indoorequal/).

Discover:

*   the frontend: <https://github.com/indoorequal/indoorequal.org>
*   the backend: <https://github.com/indoorequal/indoorequal>

## OpenLayers compatibility

*   OL < 8: use version 0.0.8
*   OL 8 & 9: use version ~0.1.0
*   OL 10: use version >= 0.2.0

## Install

**With NPM**

    npm install --save openlayers-indoorequal

**In the browser**

```html
<script src="https://unpkg.com/openlayers-indoorequal@latest/dist/openlayers-indoorequal.umd.min.js"></script>
<link href="https://unpkg.com/openlayers-indoorequal@latest/openlayers-indoorequal.css" rel="stylesheet" />
```

## Example

Get your free key at [indoorequal.com](https://indoorequal.com).

```javascript
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import IndoorEqual, { LevelControl } from 'openlayers-indoorequal';
import 'openlayers-indoorequal/openlayers-indoorequal.css';

const apiKey = '<your-indoorequal-api-key>';

const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
  ],
});

const indoorEqual = new IndoorEqual(map, { apiKey });

const control = new LevelControl(indoorEqual);
map.addControl(control);
```

## Loading the default sprite

The default style make uses of a sprite that has to be loaded manually and require an absolute path. The sprite is already builded and available in the `sprite` directory.

To load the sprite, set the `spriteBaseUrl` property option on the constructor with the absolute path to the sprite and its name `/directory-to-change/indoorequal`.

**Usage with [Parcel](https://parceljs.org/)**

Install the
[parcel-plugin-static-files-copy](https://github.com/elwin013/parcel-plugin-static-files-copy)
package and add to your `package.json`:

    "staticFiles": {
      "staticPath": "node_modules/openlayers-indoorequal/sprite"
    },

Then load the sprite:

```javascript
const indoorequal = new IndoorEqual(map, { apiKey: 'myKey', spriteBaseUrl: '/indoorequal' });
```

**Usage with [webpack](https://webpack.js.org/)**

Install the
[copy-webpack-plugin](https://github.com/webpack-contrib/copy-webpack-plugin)
package and add to your webpack config:

```javascript
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'node_modules/openlayers-indoorequal/sprite' },
      ],
    }),
  ],
};
```

Then load the sprite:

```javascript
const indoorequal = new IndoorEqual(map, { apiKey: 'myKey', spriteBaseUrl: '/indoorequal' });
```

## API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

#### Table of Contents

*   [LevelControl](#levelcontrol)
    *   [Parameters](#parameters)
*   [IndoorEqual](#indoorequal)
    *   [Parameters](#parameters-1)
    *   [setStyle](#setstyle)
        *   [Parameters](#parameters-2)
    *   [setHeatmapVisible](#setheatmapvisible)
        *   [Parameters](#parameters-3)
*   [IndoorEqual#change:levels](#indoorequalchangelevels)
*   [IndoorEqual#change:level](#indoorequalchangelevel)

### LevelControl

**Extends Control**

A control to display the available levels

#### Parameters

*   `indoorEqual` **[IndoorEqual](#indoorequal)** the IndoorEqual instance
*   `options` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)**  (optional, default `{}`)

    *   `options.target` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)?** Specify a target if you want the control to be rendered outside of the map's viewport.

Returns **[LevelControl](#levelcontrol)** `this`

### IndoorEqual

**Extends BaseObject**

Load the indoor= source and layers in your map.

#### Parameters

*   `map` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** the OpenLayers instance of the map
*   `options` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)**  (optional, default `{}`)

    *   `options.defaultStyle` **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)?** False to not set the default style. Default true.
    *   `options.spriteBaseUrl` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)?** The base url of the sprite (without .json or .png). If not set, no sprite will be used in the default style.
    *   `options.url` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)?** Override the default tiles URL (<https://tiles.indoorequal.org/>).
    *   `options.apiKey` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)?** The API key if you use the default tile URL (get your free key at [indoorequal.com](https://indoorequal.com)).
    *   `options.heatmap` **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)?** Should the heatmap layer be visible at start (true : visible, false : hidden). Defaults to true/visible.

Returns **[IndoorEqual](#indoorequal)** `this`

#### setStyle

Set the style for displayed features. This function takes a feature and resolution and returns an array of styles. If set to null, the layer has no style (a null style), so only features that have their own styles will be rendered in the layer. Call setStyle() without arguments to reset to the default style. See module:ol/style for information on the default style.

##### Parameters

*   `styleFunction` **[function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)** the style function

#### setHeatmapVisible

Change the heatmap layer visibility

##### Parameters

*   `visible` **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** True to make it visible, false to hide it

### IndoorEqual#change:levels

Emitted when the list of available levels has been updated

Type: [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)

### IndoorEqual#change:level

Emitted when the current level has been updated

Type: [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)

## Develop

**Run tests**

    yarn test [--watch]

**Build a new version**

    yarn build

**Generate the documentation**

    yarn doc

## License

BSD

[indoor=]: https://indoorequal.org/

[ol]: https://openlayers.org/
