const fs = require('fs-extra')
const chalk = require('chalk')
const inquirer = require('inquirer')

const pathTo = require('../constants/paths')
const errors = require('../constants/error')
const { removeFolder } = require('../helpers/file')

exports.remove = async (options) => {
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

  // throw error if template not found
  if (!templatePath) {
    errors.send(errors.TEMPLATE_NOT_FOUND, {
      name: options.templateName,
    })
    return
  }

  // delete template folder from storage
  try {
    removeFolder(templatePath)
    delete storageData[options.templateName]
  } catch (err) {
    console.log(chalk.red('ERR!'), err.message)
    return
  }

  // rewrite storage data
  fs.writeFileSync(pathTo.DATA_JSON, JSON.stringify(storageData))

  console.log(chalk.green('SUCCESS!'), `Template removed!`)
}
