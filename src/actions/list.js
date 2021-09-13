import fs from 'fs-extra'
import chalk from 'chalk'

import * as pathHelper from '../helpers/path'
import * as errorHelper from '../helpers/error'
import * as fileHelper from '../helpers/file'

export async function list() {
  try {
    const storageData = fs.readJSONSync(pathHelper.DATA_JSON)

    let string = ''
    Object.keys(storageData).forEach((key) => {
      const desc =
        fileHelper.getTemplateData(storageData[key]).description || '...'
      string += `- ${chalk.magenta(key)}\n${desc}\n\n`
    })

    console.log(string.replace(/\n\n$/, ''))
  } catch (err) {
    errorHelper.send(err)
  }
}
