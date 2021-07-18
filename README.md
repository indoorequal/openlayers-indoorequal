# openlayers-indoorequal

openlayers-indoorequal is an [OpenLayers][ol] library to display indoor data from [indoor=][].

The work is currently in progress.

## Example

Get your free key at [indoorequal.com](https://indoorequal.com).

```javascript
import { getLayer } from 'openlayers-indoorequal';

cosnt key = '<you-indoorequal-api-key>';
const indoorEqualLayer = getLayer('https://tiles.indoorequal.org/?key=' + key);

const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new XYZ({
        url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      }),
    }),
    indoorEqualLayer,
  ],
});
```


## License

BSD

[indoor=]: https://indoorequal.org/

[ol]: https://openlayers.org/
