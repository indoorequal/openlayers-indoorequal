import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const input = 'src/index.js';

const externalOL = [
  'ol',
  'ol/Feature',
  'ol/Object',
  'ol/control',
  'ol/format/MVT',
  'ol/layer/Heatmap',
  'ol/layer/VectorTile',
  'ol/loadingstrategy',
  'ol/proj',
  'ol/source/TileJSON',
  'ol/source/Vector',
  'ol/source/VectorTile',
  'ol/style',
  'ol/tilegrid/TileGrid'
];

export default [
  {
    input,
    output: {
      name: 'IndoorEqual',
      file: pkg.browser,
      format: 'umd',
      exports: 'named',
      globals: {
        'ol/Feature': 'ol.Feature',
        'ol/Object': 'ol.Object',
        'ol/control': 'ol.control',
        'ol/format/MVT': 'ol.format.MVT',
        'ol/layer/Heatmap': 'ol.layer.Heatmap',
        'ol/layer/VectorTile': 'ol.layer.VectorTile',
        'ol/loadingstrategy': 'ol.loadingstrategy',
        'ol/proj': 'ol.proj',
        'ol/source/TileJSON': 'ol.source.TileJSON',
        'ol/source/Vector': 'ol.source.Vector',
        'ol/source/VectorTile': 'ol.source.VectorTile',
        'ol/style': 'ol.style',
        'ol/tilegrid/TileGrid': 'ol.tilegrid.TileGrid'
      }
    },
    external: externalOL,
    context: 'window',
    plugins: [
      babel({ babelHelpers: 'bundled' }),
      resolve(),
      commonjs(),
      terser(),
    ]
  },
  {
    input,
    external: [
      'debounce',
      ...externalOL,
    ],
    output: [
      { file: pkg.main, format: 'cjs', exports: 'named' },
      { file: pkg.module, format: 'es' },
    ],
    plugins: [
      babel({ babelHelpers: 'bundled' }),
    ],
  },
];
