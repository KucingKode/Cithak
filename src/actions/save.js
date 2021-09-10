import fs from 'fs-extra'
import chalk from 'chalk'
import inquirer from 'inquirer'

import * as paths from '../constants/paths'
import * as errors from '../constants/errors'
import * as file from '../helpers/file'

export async function save(options) {
  let config = { ...options, templateName: options.templateNames[0] }

  const templatePath = file.getTargetPath(config.targetPath)
  if (!fs.existsSync(templatePath)) return

  const storageData = fs.readJSONSync(paths.DATA_JSON)

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
    errors.send(errors.NO_TEMPLATE_NAME)
    return
  }

  // if there is a template with same name in storage, throw error
  if (storageData[config.templateName]) {
    errors.send(errors.TEMPLATE_EXIST, { name: config.templateName })
    return
  }

  const storageTemplatePath = file.getStorageTemplatePath(config.templateName)
  const templateData = file.getTemplateData(templatePath)

  try {
    file.copyFolder(templatePath, storageTemplatePath, {
      include: templateData.include,
      exclude: templateData.exclude,
    })
  } catch (err) {
    console.log(chalk.red('ERR!'), err)
    return
  }

  storageData[config.templateName] = storageTemplatePath
  fs.writeFileSync(paths.DATA_JSON, JSON.stringify(storageData))

  console.log(chalk.green('SUCCESS!'), `Template saved!`)
}
