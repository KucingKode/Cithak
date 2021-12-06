import eslint from '@rollup/plugin-eslint'
import json from '@rollup/plugin-json'
import { terser } from 'rollup-plugin-terser'

import pkg from './package.json'

const production = process.env.NODE_ENV === 'production'
const builtins = ['os', 'util', 'path']

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
  input: 'src/index.js',
  output: {
    file: 'build/file/cithak.js',
    format: 'cjs'
  },
  external: [...builtins, ...Object.keys({...pkg.dependencies, ...pkg.devDependencies})],
  plugins: [
    eslint(),
    json(),
    production && terser()
  ],
  watch: {
    include: [
      'src/**'
    ],
    clearScreen: false
  }
}

export default config