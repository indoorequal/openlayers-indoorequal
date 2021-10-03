import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const input = 'src/index.js';

export default [
  {
    input,
    output: {
      name: 'IndoorEqual',
      file: pkg.browser,
      format: 'umd',
      exports: 'named',
    },
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
      'ol',
      'ol/layer/VectorTile',
      'ol/source/VectorTile',
      'ol/control',
      'ol/Object',
      'ol/source/TileJSON',
      'ol/format/MVT',
      'ol/proj',
      'ol/tilegrid/TileGrid',
      'ol/style',
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
