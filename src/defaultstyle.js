import Style from 'ol/style/Style';
import Fill from 'ol/style/Fill.js';
import Stroke from 'ol/style/Stroke';
import Text from 'ol/style/Text';

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
      text: feature.getProperties().name,
      fill: new Fill({ color: '#666' }),
    }),
  });
}

function poiLayer(feature, resolution) {
  return new Style({
    text: new Text({
      text: feature.getProperties().name,
      fill: new Fill({ color: '#666' })
    }),
  });
}

export default function defaultStyle(feature, resolution) {
  const properties = feature.getProperties();
  if (properties.layer === 'area') {
    return areaLayer(feature, resolution);
  }
  if (properties.layer === 'transportation') {
    return transportationLayer(feature, resolution);
  }
  if (properties.layer === 'area_name') {
    return areanameLayer(feature, resolution);
  }
  if (properties.layer === 'poi' && feature.getType() === 'Point') {
    return poiLayer(feature, resolution);
  }
};
