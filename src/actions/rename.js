import fs from 'fs-extra'
import chalk from 'chalk'
import inquirer from 'inquirer'

import * as pathHelper from '../helpers/path'
import * as errorHelper from '../helpers/error'

export async function rename(options) {
  options = {
    ...options,
    templateName: options.templateNames[0],
    newTemplateName: options.templateNames[1],
  }

  const storageData = fs.readJSONSync(pathHelper.DATA_JSON)

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
    errorHelper.send(errorHelper.NO_TEMPLATE_NAME)
    return
  }

  if (!storageData[options.templateName]) {
    errorHelper.send(errorHelper.TEMPLATE_NOT_FOUND, {
      name: options.templateName,
    })
    return
  }

  // prompt question if no new template name
  options = Object.assign(
    options,
    await inquirer.prompt([
      {
        type: 'input',
        name: 'newTemplateName',
        when: !options.newTemplateName,
        message: 'Please enter new template name',
      },
    ])
  )

  if (!options.newTemplateName) {
    errorHelper.send(errorHelper.NO_TEMPLATE_NAME)
    return
  }

  if (storageData[options.newTemplateName]) {
    errorHelper.send(errorHelper.TEMPLATE_EXIST, {
      name: options.newTemplateName,
    })
    return
  }

  console.log(
    chalk.magenta(
      `rename ${options.templateName} to ${options.newTemplateName}`
    )
  )

  const templatePath = storageData[options.templateName]
  const newTemplatePath = pathHelper.getStorageTemplatePath(
    options.newTemplateName
  )

  try {
    fs.renameSync(templatePath, newTemplatePath)
    delete storageData[options.templateName]
    storageData[options.newTemplateName] = newTemplatePath
  } catch (err) {
    console.log(chalk.red('ERR!'), err.message)
    process.exit(1)
  }

  fs.writeFileSync(pathHelper.DATA_JSON, JSON.stringify(storageData))

  console.log(
    chalk.green('SUCCESS!'),
    `Template ${options.templateName} renamed to ${options.newTemplateName}!`
  )
}
