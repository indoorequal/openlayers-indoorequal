import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import TileJSON from 'ol/source/TileJSON';
import MVT from 'ol/format/MVT';
import { fromLonLat } from 'ol/proj.js';
import TileGrid from 'ol/tilegrid/TileGrid.js';

function extentFromTileJSON(tileJSON) {
    var bounds = tileJSON.bounds;
    if (bounds) {
        var ll = fromLonLat([bounds[0], bounds[1]]);
        var tr = fromLonLat([bounds[2], bounds[3]]);
        return [ll[0], ll[1], tr[0], tr[1]];
    }
}

const defaultResolutions = (function () {
  const resolutions = [];
  for (let res = 78271.51696402048; resolutions.length <= 24; res /= 2) {
    resolutions.push(res);
  }
  return resolutions;
})();

function onTileJSONLoaded(layer, tilejson) {
  const tileJSONDoc = tilejson.getTileJSON();
  const tiles = Array.isArray(tileJSONDoc.tiles)
        ? tileJSONDoc.tiles
        : [tileJSONDoc.tiles];
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
      tileSize: 512,
    }),
    urls: tiles,
  });
  layer.setSource(source);
  layer.setVisible(true);
}

export function getLayer(url, options) {
  const layer = new VectorTileLayer({
    declutter: true,
    visible: false,
    ...options,
  });
  const tilejson = new TileJSON({ url });
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
