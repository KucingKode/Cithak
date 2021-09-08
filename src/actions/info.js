const fs = require('fs-extra')
const chalk = require('chalk')
const inquirer = require('inquirer')

const errors = require('../constants/error')
const pathTo = require('../constants/paths')
const { getTemplateData } = require('../helpers/file')

exports.info = async (options) => {
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

  const templatePath = storageData[options.templateName]
  if (!templatePath) {
    errors.send(errors.TEMPLATE_NOT_FOUND, {
      name: options.templateName,
    })
    return
  }

  const templateDescription = getTemplateData(templatePath).description || ''
  console.log(`${chalk.magenta(options.templateName)}\n${templateDescription}`)
}
