import fs from 'fs-extra'
import chalk from 'chalk'

import * as paths from '../constants/paths'
import * as file from '../helpers/file'

export async function list() {
  const storageData = fs.readJSONSync(paths.DATA_JSON)

  let string = ''
  Object.keys(storageData).forEach((key) => {
    const desc = file.getTemplateData(storageData[key]).description || '...'
    string += `- ${chalk.magenta(key)}\n${desc}\n\n`
  })

  console.log(string.replace(/\n\n$/, ''))
}
