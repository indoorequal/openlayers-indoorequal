import Feature from 'ol/Feature';
import HeatmapLayer from 'ol/layer/Heatmap';
import MVT from 'ol/format/MVT';
import TileGrid from 'ol/tilegrid/TileGrid';
import TileJSON from 'ol/source/TileJSON';
import VectorSource from 'ol/source/Vector';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import { fromLonLat } from 'ol/proj';
import { tile } from 'ol/loadingstrategy';

const MIN_ZOOM_INDOOR = 17;
const MAX_ZOOM_HEATMAP = MIN_ZOOM_INDOOR;

function extentFromTileJSON(tileJSON) {
  const bounds = tileJSON.bounds;
  if (bounds) {
    const ll = fromLonLat([bounds[0], bounds[1]]);
    const tr = fromLonLat([bounds[2], bounds[3]]);
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

function createSourceFromTileJSON(tilejson) {
  const tileJSONDoc = tilejson.getTileJSON();
  const tiles = Array.isArray(tileJSONDoc.tiles)
        ? tileJSONDoc.tiles
        : [tileJSONDoc.tiles];
  const tileGrid = tilejson.getTileGrid();
  const extent = extentFromTileJSON(tileJSONDoc);
  const minZoom = tileJSONDoc.minzoom;
  const maxZoom = tileJSONDoc.maxzoom;
  return new VectorTileSource({
    attributions: tilejson.getAttributions(),
    format: new MVT({
      featureClass: Feature,
    }),
    tileGrid: new TileGrid({
      origin: tileGrid.getOrigin(0),
      extent: extent || tileGrid.getExtent(),
      minZoom: minZoom,
      resolutions: defaultResolutions.slice(0, maxZoom + 1),
      tileSize: 512,
    }),
    urls: tiles,
  });
}

function loadTileJSON(url) {
  return new Promise((resolve, reject) => {
    const tilejson = new TileJSON({ url });
    tilejson.on('change', function () {
      const state = tilejson.getState();
      if (state === 'ready') {
        resolve(tilejson);
      }
    });
    if (tilejson.getState() === 'ready') {
      tilejson.changed();
    }
  });
}

export async function loadSourceFromTileJSON(url) {
  const tilejson = await loadTileJSON(url);
  return createSourceFromTileJSON(tilejson);
}

export function getLayer(options) {
  return new VectorTileLayer({
    declutter: true,
    ...options,
  });
}

export function createHeatmapSource(indoorLayer) {
  const tilegrid = indoorLayer.getSource().getTileGrid();
  const vectorSource = new VectorSource({
    loader(extent, resolution, projection, success, failure) {
      const refresh = () => {
        const features = indoorLayer.getFeaturesInExtent(extent);
        vectorSource.clear(true);
        vectorSource.addFeatures(features);
        success(features);
      }
      indoorLayer.getSource().on('tileloadend', refresh);
      refresh();
    },
    loadingstrategy: tile(tilegrid)
  });
  return vectorSource;
}

export function getHeatmapLayer(options) {
  return new HeatmapLayer({
    maxZoom: MAX_ZOOM_HEATMAP,
    gradient: [
      'rgba(102, 103, 173, 0)',
      'rgba(102, 103, 173, 0.2)',
      'rgba(102, 103, 173, 0.7)'
    ],
    ...options,
  });
}
