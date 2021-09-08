const fs = require('fs-extra')
const chalk = require('chalk')
const inquirer = require('inquirer')

const pathTo = require('../constants/paths')
const errors = require('../constants/error')
const {
  getTargetPath,
  getTemplateData,
  copyFolder,
} = require('../helpers/file')

exports.update = async (options) => {
  const templatePath = getTargetPath(options.targetPath)
  if (!fs.existsSync(templatePath)) return

  const storageData = fs.readJSONSync(pathTo.DATA_JSON)

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
  const templateData = getTemplateData(storageTemplatePath)

  try {
    copyFolder(templatePath, storageTemplatePath, {
      include: templateData.include,
      exclude: templateData.exclude,
    })
  } catch (err) {
    console.log(chalk.red('ERR!'), err)
    return
  }

  console.log(chalk.green('SUCCESS!'), `Template updated!`)
}
