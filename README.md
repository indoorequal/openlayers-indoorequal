# openlayers-indoorequal

openlayers-indoorequal is an [OpenLayers][ol] library to display indoor data from [indoor=][].

The work is currently in progress.

## Example

Get your free key at [indoorequal.com](https://indoorequal.com).

```javascript
import { getLayer } from 'openlayers-indoorequal';
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';

const key = '<your-indoorequal-api-key>';
const indoorEqualLayer = getLayer('https://tiles.indoorequal.org/?key=' + key);

const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
    indoorEqualLayer,
  ],
});
```


## License

BSD

[indoor=]: https://indoorequal.org/

[ol]: https://openlayers.org/
