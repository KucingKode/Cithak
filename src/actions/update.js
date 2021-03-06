import fs from 'fs-extra'
import chalk from 'chalk'
import inquirer from 'inquirer'

import * as pathHelper from '../helpers/path'
import * as errorHelper from '../helpers/error'
import * as fileHelper from '../helpers/file'

export async function update(options) {
  options.templateName = options.templateNames[0]

  const templatePath = pathHelper.getTargetPath(options.targetPath)
  if (!fs.existsSync(templatePath)) return

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

  // if there is a template with same name in storage, throw error
  if (!storageData[options.templateName]) {
    errorHelper.send(errorHelper.TEMPLATE_NOT_FOUND, {
      name: options.templateName,
    })
    return
  }

  console.log(
    chalk.magenta(`update ${options.templateName} with ${options.targetPath}`)
  )

  // copy template to storage
  const storageTemplatePath = storageData[options.templateName]
  const templateData = fileHelper.getTemplateData(storageTemplatePath)

  try {
    fileHelper.copyFolder(templatePath, storageTemplatePath, {
      include: templateData.include,
      exclude: templateData.exclude,
      index: options.index,
      quiet: options.quiet,
    })
  } catch (err) {
    console.error(chalk.red('ERR!'), err.message)
    process.exit(1)
  }

  console.log(
    chalk.green('SUCCESS!'),
    `Template ${options.templateName} updated!`
  )
}
