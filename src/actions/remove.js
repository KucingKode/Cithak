import fs from 'fs-extra'
import chalk from 'chalk'

import * as pathHelper from '../helpers/path'
import * as errorHelper from '../helpers/error'
import * as fileHelper from '../helpers/file'

export async function remove(options, i = 0) {
  if (i === options.templateNames.length) return

  const templateName = options.templateNames[i]

  console.log(chalk.magenta(templateName))
  await removeTemplate({ ...options, templateName })
  console.log('\n')
  await remove(options, i + 1)
}

async function removeTemplate(options) {
  const storageData = fs.readJSONSync(pathHelper.DATA_JSON)
  const templatePath = storageData[options.templateName]

  // throw error if template not found
  if (!templatePath) {
    errorHelper.send(errorHelper.TEMPLATE_NOT_FOUND, {
      name: options.templateName,
    })
    return
  }

  // delete template folder from storage
  fileHelper.removeFolder(templatePath, {
    index: options.index,
    quiet: options.quiet,
  })
  delete storageData[options.templateName]

  // rewrite storage data
  fs.writeFileSync(pathHelper.DATA_JSON, JSON.stringify(storageData))

  console.log(
    chalk.green('SUCCESS!'),
    `Template ${options.templateName} removed from storage!`
  )
}
