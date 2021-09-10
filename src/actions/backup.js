import chalk from 'chalk'
import fs from 'fs-extra'

import * as paths from '../constants/paths'
import * as errors from '../constants/errors'
import * as file from '../helpers/file'

const backupDataPath = (targetPath) =>
  file.getTargetPath(targetPath, 'backup.json')

export async function backup(options) {
  const { targetPath } = options

  file.copyFolder(paths.STORAGE, file.getTargetPath(targetPath))

  const storageData = fs.readFileSync(paths.DATA_JSON).toString()

  fs.writeFileSync(
    backupDataPath(targetPath),
    storageData.replace(
      RegExp(paths.STORAGE, 'g'),
      file.getTargetPath(targetPath)
    )
  )

  console.log(chalk.green('SUCCESS!'), 'Storage cloned!')
}

export async function load(options) {
  const { targetPath } = options
  if (!fs.existsSync(backupDataPath(targetPath))) {
    errors.send(errors.NO_BACKUP_DATA)
    return
  }

  const backupData = fs.readJSONSync(backupDataPath(targetPath))
  const storageData = fs.readJSONSync(paths.DATA_JSON)

  Object.keys(backupData).forEach((key) => {
    if (!fs.existsSync(backupData[key])) return
    if (options.safe && storageData[key]) return

    file.copyFolder(backupData[key], file.getStorageTemplatePath(key), {
      safe: options.safe,
      join: !options.noJoin,
    })
    storageData[key] = file.getStorageTemplatePath(key)
  })

  fs.writeFileSync(paths.DATA_JSON, JSON.stringify(storageData))
  console.log(chalk.green('SUCCESS!'), 'Backup loaded!')
}
