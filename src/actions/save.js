import fs from 'fs-extra'
import { join } from 'path'
import chalk from 'chalk'
import shelljs from 'shelljs'
import inquirer from 'inquirer'

import * as pathHelper from '../helpers/path'
import * as errorHelper from '../helpers/error'
import * as fileHelper from '../helpers/file'
import * as gitHelper from '../helpers/git'

export async function save(options) {
  options = { ...options, templateName: options.templateNames[0] }

  const templatePath = pathHelper.getTargetPath(options.targetPath)
  const storageData = fs.readJSONSync(pathHelper.DATA_JSON)

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
    errorHelper.send(errorHelper.NO_TEMPLATE_NAME)
    return
  }

  if (
    gitHelper.gitRepoRegex.test(options.templateName) ||
    (options.templateName === '_temp' && !options.fromSys)
  ) {
    errorHelper.send(errorHelper.INVALID_TEMPLATE_NAME)
    return
  }

  // if there is a template with same name in storage, throw error
  if (storageData[options.templateName]) {
    errorHelper.send(errorHelper.TEMPLATE_EXIST, { name: options.templateName })
    return
  }

  const storageTemplatePath = pathHelper.getStorageTemplatePath(
    options.templateName
  )

  // if template path is git repo
  if (gitHelper.gitRepoRegex.test(options.targetPath)) {
    try {
      const { domain, username, repo } = gitHelper.extract(options.targetPath)

      if (!shelljs.which('git')) {
        errorHelper.send(errorHelper.GIT_NOT_FOUND)
        return
      }

      fs.mkdirSync(storageTemplatePath, { recursive: true })

      shelljs.cd(storageTemplatePath)
      shelljs.exec(`git clone ${domain}/${username}/${repo}.git .`)

      fs.rmSync(join(storageTemplatePath, '.git'), { recursive: true })
    } catch (err) {
      console.log(chalk.red('ERR!'), err.message)
      throw err
    }
  } else {
    const templateData = fileHelper.getTemplateData(templatePath)

    try {
      fileHelper.copyFolder(templatePath, storageTemplatePath, {
        include: templateData.include,
        exclude: templateData.exclude,
      })
    } catch (err) {
      console.log(chalk.red('ERR!'), err)
      return
    }
  }

  storageData[options.templateName] = storageTemplatePath
  fs.writeFileSync(pathHelper.DATA_JSON, JSON.stringify(storageData))

  console.log(
    chalk.green('SUCCESS!'),
    `Template ${options.templateName} saved to storage!`
  )
}
