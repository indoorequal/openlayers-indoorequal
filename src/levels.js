export default function findAllLevels(features) {
  const levels = [];
  for (let i = 0; i < features.length; i++) {
    const feature = features[i];
    if (feature.getProperties().class === 'level') {
      continue;
    }
    const level = feature.getProperties().level;
    if (!levels.includes(level)) {
      levels.push(level);
    }
  }
  return levels.sort((a, b) => a - b).reverse();
}
