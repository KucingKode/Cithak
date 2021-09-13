import { join } from 'path'
import { homedir } from 'os'

export const PACKAGE_JSON = join(__dirname, '../../package.json')
export const STORAGE = join(homedir(), '.cithak-templates-storage/templates')
export const DATA_JSON = join(homedir(), '.cithak-templates-storage/data.json')
export const state = {
  cwd: process.cwd(),
}

// path generator
export const getTargetPath = (...subpaths) => join(state.cwd, ...subpaths)
export const getStorageTemplatePath = (templateName) =>
  join(STORAGE, templateName)
