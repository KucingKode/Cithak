const fs = require('fs-extra')
const chalk = require('chalk')
const inquirer = require('inquirer')

const pathTo = require('../constants/paths')
const errors = require('../constants/error')
const {
  getTargetPath,
  getStorageTemplatePath,
  copyFolder,
  getTemplateData,
} = require('../helpers/file')

exports.add = async (options) => {
  let config = options

  const templatePath = getTargetPath(config.targetPath)
  if (!fs.existsSync(templatePath)) return

  const storageData = fs.readJSONSync(pathTo.DATA_JSON)

  // prompt question if no template name
  config = Object.assign(
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
  if (storageData[options.templateName]) {
    errors.send(errors.TEMPLATE_EXIST, { name: options.templateName })
    return
  }

  const storageTemplatePath = getStorageTemplatePath(options.templateName)
  const templateData = getTemplateData(templatePath)

  try {
    copyFolder(templatePath, storageTemplatePath, {
      include: templateData.include,
      exclude: templateData.exclude,
    })
  } catch (err) {
    console.log(chalk.red('ERR!'), err)
    return
  }

  storageData[options.templateName] = storageTemplatePath
  fs.writeFileSync(pathTo.DATA_JSON, JSON.stringify(storageData))

  console.log(chalk.green('SUCCESS!'), `Template added!`)
}
