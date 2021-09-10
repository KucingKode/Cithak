import fs from 'fs-extra'
import chalk from 'chalk'
import inquirer from 'inquirer'

import * as paths from '../constants/paths'
import * as errors from '../constants/errors'
import * as file from '../helpers/file'

export async function remove(options, i = 0) {
  if (i === options.templateNames.length) return

  const templateName = options.templateNames[i]

  console.log(chalk.magenta(templateName))
  await removeTemplate({ ...options, templateName })
  console.log('\n')
  await remove(options, i + 1)
}

async function removeTemplate(options) {
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

  // throw error if template not found
  if (!templatePath) {
    errors.send(errors.TEMPLATE_NOT_FOUND, {
      name: options.templateName,
    })
    return
  }

  // delete template folder from storage
  try {
    file.removeFolder(templatePath)
    delete storageData[options.templateName]
  } catch (err) {
    console.log(chalk.red('ERR!'), err.message)
    return
  }

  // rewrite storage data
  fs.writeFileSync(paths.DATA_JSON, JSON.stringify(storageData))

  console.log(chalk.green('SUCCESS!'), `Template removed!`)
}
