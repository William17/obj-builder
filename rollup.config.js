import pkg from './package.json'
import babel from 'rollup-plugin-babel'
import {uglify} from 'rollup-plugin-uglify'

export default [
  {
    input: 'dist/esm/index.js',
    plugins: [
      babel(),
      uglify()
    ],
    output: {
      name: 'obj-builder',
      exports: 'named',
      file: pkg.browser,
      format: 'umd',
      sourcemap: true
    },
  }
]
