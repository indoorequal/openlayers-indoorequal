import { Fill, Stroke, Text, Icon, Style } from 'ol/style';

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

function poiLayer(feature, resolution, map, sprite) {
  const properties = feature.getProperties();
  const zoom = map.getView().getZoomForResolution(resolution);
  if (zoom < 19 && ['waste_basket', 'information', 'vending_machine'].includes(properties.class)) {
    return;
  }

  let icon;
  if (sprite) {
    const iconDef = sprite.json['indoorequal-'+ properties.subclass] || sprite.json['indoorequal-'+ properties.class];

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
      text: properties.name,
      fill: new Fill({ color: '#666' }),
      offsetY: 18,
    }),
    image: icon,
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

  const spriteJSON = await (await fetch(spriteUrl, {credentials: 'same-origin'})).json();
  const spritePNG = await loadAsImage(basePath + sizeFactor + '.png', {credentials: 'same-origin'});

  return { json: spriteJSON, png: spritePNG };
}

export default function defaultStyle(map, layer, spriteBaseUrl) {
  let sprite = null;
  if (spriteBaseUrl) {
    loadSprite(spriteBaseUrl)
      .then((spriteData) => {
        layer.changed();
        sprite = spriteData;
      });
  }

  return function(feature, resolution) {
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
      return poiLayer(feature, resolution, map, sprite);
    }
  }
};
