import eslint from '@rollup/plugin-eslint'
import json from '@rollup/plugin-json'
import { terser } from 'rollup-plugin-terser'

const production = process.env.NODE_ENV === 'production'

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
  input: 'src/index.js',
  output: {
    file: 'build/file/cithak.js',
    format: 'cjs'
  },
  external: [
    'fs-extra', 'glob', 'arg', 'inquirer', 'path', 'os',
    'chalk', 'yaml', '@iarna/toml', 'listr', 'execa', 'util',
    'shelljs'
  ],
  plugins: [
    json(),
    eslint(),
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