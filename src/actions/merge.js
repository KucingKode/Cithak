import fs from 'fs-extra'
import chalk from 'chalk'

import * as paths from '../constants/paths'
import * as errors from '../constants/errors'
import * as file from '../helpers/file'

export async function merge(options, i = 1) {
  if (i >= options.templateNames.length) return

  const target = options.templateNames[0]
  await mergeTemplate(target, options.templateNames[i], options)
  await merge(options, i + 1)
}

async function mergeTemplate(template1, template2, options) {
  const storageData = fs.readJSONSync(paths.DATA_JSON)

  // if there is a no template with same name in storage, throw error
  if (!storageData[template1]) {
    errors.send(errors.TEMPLATE_NOT_FOUND, { name: template1 })
    return
  }
  if (!storageData[template2]) {
    errors.send(errors.TEMPLATE_NOT_FOUND, { name: template2 })
    return
  }

  const template1Path = storageData[template1]
  const template2Path = storageData[template2]

  try {
    file.copyFolder(template2Path, template1Path, {
      safe: options.safe,
      join: !options.noJoin,
    })
  } catch (err) {
    console.log(chalk.red('ERR!'), err)
    return
  }

  console.log(
    chalk.green('SUCCESS!'),
    `Template merged! ${chalk.gray(`${template2} -> ${template1}`)}`
  )
}
