import fs from 'fs-extra'
import chalk from 'chalk'

import * as errorHelper from '../helpers/error'
import * as pathHelper from '../helpers/path'
import * as fileHelper from '../helpers/file'

export async function info(options) {
  options.templateNames.forEach((templateName) => {
    logInfo({ ...options, templateName })
  })
}

async function logInfo(options) {
  try {
    const storageData = fs.readJSONSync(pathHelper.DATA_JSON)

    const templatePath = storageData[options.templateName]
    if (!templatePath) {
      errorHelper.send(errorHelper.TEMPLATE_NOT_FOUND, {
        name: options.templateName,
      })
      return
    }

    const templateDescription =
      fileHelper.getTemplateData(templatePath).description || ''

    console.log(
      `${chalk.magenta(options.templateName)}\n${templateDescription}\n`
    )
  } catch (err) {
    errorHelper.send(err)
  }
}
