import chalk from 'chalk'
import fs from 'fs-extra'

import * as pathHelper from '../helpers/path'
import * as errorHelper from '../helpers/error'
import * as fileHelper from '../helpers/file'

const backupDataPath = (targetPath) =>
  pathHelper.getTargetPath(targetPath, 'backup.json')

export async function backup(options) {
  const { targetPath } = options

  fileHelper.copyFolder(
    pathHelper.STORAGE,
    pathHelper.getTargetPath(targetPath)
  )

  const storageData = fs.readFileSync(pathHelper.DATA_JSON).toString()

  fs.writeFileSync(
    backupDataPath(targetPath),
    storageData.replace(
      RegExp(pathHelper.STORAGE, 'g'),
      pathHelper.getTargetPath(targetPath)
    )
  )

  console.log(chalk.green('SUCCESS!'), 'Storage cloned!')
}

export async function load(options) {
  try {
    const { targetPath } = options
    if (!fs.existsSync(backupDataPath(targetPath))) {
      errorHelper.send(errorHelper.NO_BACKUP_DATA)
      return
    }

    const backupData = fs.readJSONSync(backupDataPath(targetPath))
    const storageData = fs.readJSONSync(pathHelper.DATA_JSON)

    Object.keys(backupData).forEach((key) => {
      if (!fs.existsSync(backupData[key])) return
      if (options.safe && storageData[key]) return

      fileHelper.copyFolder(
        backupData[key],
        pathHelper.getStorageTemplatePath(key),
        {
          safe: options.safe,
          join: !options.noJoin,
        }
      )
      storageData[key] = pathHelper.getStorageTemplatePath(key)
    })

    fs.writeFileSync(pathHelper.DATA_JSON, JSON.stringify(storageData))
    console.log(chalk.green('SUCCESS!'), 'Backup loaded!')
  } catch (err) {
    errorHelper.send(err)
  }
}
