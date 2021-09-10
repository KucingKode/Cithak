import fs from 'fs-extra'
import chalk from 'chalk'
import inquirer from 'inquirer'

import * as paths from '../constants/paths'
import * as errors from '../constants/errors'
import * as file from '../helpers/file'

export async function update(options) {
  const templatePath = file.getTargetPath(options.targetPath)
  if (!fs.existsSync(templatePath)) return

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

  // if there is a template with same name in storage, throw error
  if (!storageData[options.templateName]) {
    errors.send(errors.TEMPLATE_NOT_FOUND, { name: options.templateName })
    return
  }

  // copy template to storage
  const storageTemplatePath = storageData[options.templateName]
  const templateData = file.getTemplateData(storageTemplatePath)

  try {
    file.copyFolder(templatePath, storageTemplatePath, {
      include: templateData.include,
      exclude: templateData.exclude,
    })
  } catch (err) {
    console.log(chalk.red('ERR!'), err)
    return
  }

  console.log(chalk.green('SUCCESS!'), `Template updated!`)
}
