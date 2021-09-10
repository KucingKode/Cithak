import eslint from '@rollup/plugin-eslint'

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
    'chalk', 'yaml', '@iarna/toml', 'listr', 'execa'
  ],
  plugins: [
    eslint()
  ],
  watch: {
    include: [
      'src/**'
    ],
    clearScreen: false
  }
}

export default config