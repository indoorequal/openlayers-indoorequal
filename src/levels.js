export default function findAllLevels(features) {
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
