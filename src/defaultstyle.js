import Style from 'ol/style/Style';
import Fill from 'ol/style/Fill.js';
import Stroke from 'ol/style/Stroke';

export default function defaultStyle(feature, resolution) {
  const properties = feature.getProperties();
  if (properties.layer === 'area' && feature.getType() === 'Polygon') {
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
      stroke = new Fill({ color: '#bfbfbf' });
    }
    if (properties.layer === 'area' && ['room', 'wall'].includes(properties.class)) {
      stroke = new Stroke({
        color: 'gray',
        width: 2
      })
    }

    return new Style({
      fill: new Fill({ color }),
      stroke,
    });
  }
};
