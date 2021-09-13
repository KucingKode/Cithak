import fs from 'fs-extra'
import chalk from 'chalk'
import inquirer from 'inquirer'

import * as pathHelper from '../helpers/path'
import * as errorHelper from '../helpers/error'

export async function rename(options) {
  let config = {
    ...options,
    templateName: options.templateNames[0],
    newTemplateName: options.templateNames[1],
  }

  const storageData = fs.readJSONSync(pathHelper.DATA_JSON)

  // prompt question if no template name
  config = Object.assign(
    config,
    await inquirer.prompt([
      {
        type: 'input',
        name: 'templateName',
        when: !config.templateName,
        message: 'Please enter template name',
      },
    ])
  )

  if (!config.templateName) {
    errorHelper.send(errorHelper.NO_TEMPLATE_NAME)
    return
  }

  if (!storageData[config.templateName]) {
    errorHelper.send(errorHelper.TEMPLATE_NOT_FOUND, {
      name: config.templateName,
    })
    return
  }

  // prompt question if no new template name
  config = Object.assign(
    config,
    await inquirer.prompt([
      {
        type: 'input',
        name: 'newTemplateName',
        when: !config.newTemplateName,
        message: 'Please enter new template name',
      },
    ])
  )

  if (!config.newTemplateName) {
    errorHelper.send(errorHelper.NO_TEMPLATE_NAME)
    return
  }

  if (storageData[config.newTemplateName]) {
    errorHelper.send(errorHelper.TEMPLATE_EXIST, {
      name: config.newTemplateName,
    })
    return
  }

  const templatePath = storageData[config.templateName]
  const newTemplatePath = pathHelper.getStorageTemplatePath(
    config.newTemplateName
  )

  try {
    fs.renameSync(templatePath, newTemplatePath)
    delete storageData[config.templateName]
    storageData[config.newTemplateName] = newTemplatePath
  } catch (err) {
    console.log(chalk.red('ERR!'), err)
    return
  }

  fs.writeFileSync(pathHelper.DATA_JSON, JSON.stringify(storageData))

  console.log(chalk.green('SUCCESS!'), `Template saved!`)
}
