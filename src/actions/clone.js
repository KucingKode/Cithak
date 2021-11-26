import fs from 'fs-extra'
import chalk from 'chalk'
import Listr from 'listr'
import { promisify } from 'util'
import shelljs from 'shelljs'
import inquirer from 'inquirer'

import { save } from './save'
import { remove } from './remove'

import * as pathHelper from '../helpers/path'
import * as errorHelper from '../helpers/error'
import * as fileHelper from '../helpers/file'
import * as gitHelper from '../helpers/git'

export async function clone(options, i = 0) {
  if (i === options.templateNames.length) return

  const templateName = options.templateNames[i]

  console.log(chalk.magenta(templateName), '\n')

  if (gitHelper.gitRepoRegex.test(templateName)) {
    await cloneGit({ ...options, templateName })
  } else {
    await cloneTemplate({ ...options, templateName })
  }
  await clone(options, i + 1)
}

async function cloneGit(options) {
  const tempFileName = '_temp'
  await save({
    ...options,
    fromSys: true,
    templateNames: [tempFileName],
    targetPath: options.templateName,
  })
  await cloneTemplate({ ...options, templateName: tempFileName })
  await remove({ ...options, templateNames: [tempFileName] })
}

async function cloneTemplate(options) {
  const projectPath = pathHelper.getTargetPath(options.targetPath)
  const storageData = fs.readJSONSync(pathHelper.DATA_JSON)

  // if there is a no template with same name in storage, throw error
  if (!storageData[options.templateName]) {
    errorHelper.send(errorHelper.TEMPLATE_NOT_FOUND, {
      name: options.templateName,
    })
    return
  }

  // clone template
  const storageTemplatePath = pathHelper.getStorageTemplatePath(
    options.templateName
  )
  const templateData = fileHelper.getTemplateData(storageTemplatePath)

  try {
    fileHelper.copyFolder(storageTemplatePath, projectPath, {
      safe: options.safe,
      join: !options.noJoin,
      index: options.index,
      quiet: options.quiet,
    })
  } catch (err) {
    console.log(chalk.red('ERR!'), err)
    return
  }

  if (!options.noExec && templateData.tasks) {
    await executeTasks(templateData.tasks, projectPath, options)
  }

  console.log(
    chalk.green('SUCCESS!'),
    `Template ${options.templateName} cloned to ${projectPath}!`
  )
}

async function executeTasks(tasks, cwd, options) {
  // ask permissions
  let permissionsRegex
  const logs = []

  if (!options.allowsAll) {
    for (let i = 0; i < tasks.length; i += 1) {
      ;(options.changes || []).forEach((change) => {
        tasks[i] = tasks[i].replace(RegExp(`^${change[0]}`), change[1])
      })

      console.log(`${i + 1}. ${chalk.magenta(tasks[i])}`)
    }

    console.log(
      '\nPlease enter tasks id you want to execute or type all to execute all tasks'
    )
    const { permissions } = await inquirer.prompt([
      {
        type: 'input',
        name: 'permissions',
        when: !options.allowsAll,
        default: 'none',
        message: `${chalk.gray('ex: 1,2,3 or all or 1-3 or 1-2,7')}`,
      },
    ])
    if (options.allowsAll || permissions === 'all') {
      options.allowsAll = true
    } else {
      permissionsRegex = RegExp(`^[${permissions.replace(/,/g, '|')}]$`)
    }
  }

  // run tasks
  await new Listr(
    tasks.map((task, i) => ({
      title: task,
      task: () => execute(task, cwd, logs),
      enabled: () =>
        options.allowsAll || permissionsRegex.test((i + 1).toString()),
    }))
  ).run()
  console.log('\n')

  if (logs.length > 0) console.log('\n')
  Object.keys(logs).forEach((key) => {
    console.log(chalk.magenta(key))
    console.log(logs[key])
  })
  if (logs.length > 0) console.log('\n')
}

async function execute(command, cwd, logs) {
  try {
    const exec = promisify(shelljs.exec)

    shelljs.cd(cwd)
    const stdout = await exec(command, {
      quiet: true,
      async: true,
    })

    logs[command] = stdout
    Promise.resolve()
  } catch (err) {
    console.log(chalk.red('ERR!'), err.message)
    Promise.reject(new Error(`Failed to execute ${chalk.magenta(command)}`))
  }
}
