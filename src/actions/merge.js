import fs from 'fs-extra'
import chalk from 'chalk'

import * as pathHelper from '../helpers/path'
import * as errorHelper from '../helpers/error'
import * as fileHelper from '../helpers/file'

export async function merge(options, i = 1) {
  if (i >= options.templateNames.length) return

  const target = options.templateNames[0]
  await mergeTemplate(target, options.templateNames[i], options)
  await merge(options, i + 1)
}

async function mergeTemplate(template1, template2, options) {
  const storageData = fs.readJSONSync(pathHelper.DATA_JSON)

  // if there is a no template with same name in storage, throw error
  if (!storageData[template1]) {
    errorHelper.send(errorHelper.TEMPLATE_NOT_FOUND, { name: template1 })
    return
  }
  if (!storageData[template2]) {
    errorHelper.send(errorHelper.TEMPLATE_NOT_FOUND, { name: template2 })
    return
  }

  const template1Path = storageData[template1]
  const template2Path = storageData[template2]

  fileHelper.copyFolder(template2Path, template1Path, {
    safe: options.safe,
    join: !options.noJoin,
    index: options.index,
    silent: options.silent,
  })

  console.log(
    chalk.green('SUCCESS!'),
    `Template merged! ${chalk.gray(`${template2} -> ${template1}`)}`
  )
}
