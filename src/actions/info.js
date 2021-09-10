import fs from 'fs-extra'
import chalk from 'chalk'
import inquirer from 'inquirer'

import * as errors from '../constants/errors'
import * as paths from '../constants/paths'
import * as file from '../helpers/file'

export async function info(options) {
  options.templateNames.forEach((templateName) => {
    logInfo({ ...options, templateName })
  })
}

async function logInfo(options) {
  const storageData = fs.readJSONSync(paths.DATA_JSON)

  // prompt question if no template name
  options = Object.assign(
    options,
    await inquirer.prompt([
      {
        type: 'input',
        name: 'templateName',
        when: !options.templateName,
        message: 'Please enter template name',
      },
    ])
  )

  if (!options.templateName) {
    errors.send(errors.NO_TEMPLATE_NAME)
    return
  }

  const templatePath = storageData[options.templateName]
  if (!templatePath) {
    errors.send(errors.TEMPLATE_NOT_FOUND, {
      name: options.templateName,
    })
    return
  }

  const templateDescription =
    file.getTemplateData(templatePath).description || ''

  console.log(
    `${chalk.magenta(options.templateName)}\n${templateDescription}\n`
  )
}
