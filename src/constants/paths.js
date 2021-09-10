import { join } from 'path'
import { homedir } from 'os'

export const PACKAGE_JSON = join(__dirname, '../../package.json')
export const STORAGE = join(homedir(), '.cithak-templates-storage/templates')
export const DATA_JSON = join(homedir(), '.cithak-templates-storage/data.json')
