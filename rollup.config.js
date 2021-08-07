import babel from '@rollup/plugin-babel';
import pkg from './package.json';

const input = 'src/index.js';

export default [
  {
    input,
    external: ['ol'],
    plugins: [
      babel()
    ],
    output: [
      { file: pkg.main, format: 'cjs', exports: 'named' },
      { file: pkg.module, format: 'es' }
    ]
  }
];
