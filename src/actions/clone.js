import fs from 'fs-extra'
import chalk from 'chalk'
import Listr from 'listr'
import execa from 'execa'
import inquirer from 'inquirer'

import * as paths from '../constants/paths'
import * as errors from '../constants/errors'
import * as file from '../helpers/file'

export async function clone(options, i = 0) {
  if (i === options.templateNames.length) return

  const templateName = options.templateNames[i]

  console.log(chalk.magenta(templateName), '\n')
  await cloneTemplate({ ...options, templateName })
  await clone(options, i + 1)
}

async function cloneTemplate(options) {
  let config = options

  const projectPath = file.getTargetPath(config.targetPath)
  const storageData = fs.readJSONSync(paths.DATA_JSON)

  // prompt question if no template name
  config = Object.assign(
    config,
    await inquirer.prompt([
      {
        type: 'input',
        name: 'templateName',
        when: !config.templateName,
        message: 'Please enter template name',
      },
    ])
  )

  if (!config.templateName) {
    errors.send(errors.NO_TEMPLATE_NAME)
    return
  }

  // if there is a no template with same name in storage, throw error
  if (!storageData[config.templateName]) {
    errors.send(errors.TEMPLATE_NOT_FOUND, { name: config.templateName })
    return
  }

  // clone template
  const storageTemplatePath = file.getStorageTemplatePath(config.templateName)
  const templateData = file.getTemplateData(storageTemplatePath)

  try {
    file.copyFolder(storageTemplatePath, projectPath, {
      safe: config.safe,
      join: !config.noJoin,
    })
  } catch (err) {
    console.log(chalk.red('ERR!'), err)
    return
  }

  if (!config.noExec && templateData.tasks) {
    await executeTasks(templateData.tasks, projectPath, config)
  }

  console.log(chalk.green('SUCCESS!'), `Template cloned!`)
}

async function executeTasks(tasks, cwd, config) {
  // ask permissions
  let permissionsRegex
  const logs = []

  if (!config.allowsAll) {
    console.log('\n')
    for (let i = 0; i < tasks.length; i += 1) {
      ;(config.changes || []).forEach((change) => {
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
        when: !config.allowsAll,
        default: 'none',
        message: `${chalk.gray('ex: 1,2,3 or all or 1-3 or 1-2,7')}`,
      },
    ])
    if (config.allowsAll || permissions === 'all') {
      config.allowsAll = true
    } else {
      permissionsRegex = RegExp(`^[${permissions.replace(/,/g, '|')}]$`)
    }
  }

  // run tasks
  console.log('\n')
  await new Listr(
    tasks.map((task, i) => ({
      title: task,
      task: () => execute(task, cwd, logs),
      enabled: () =>
        config.allowsAll || permissionsRegex.test((i + 1).toString()),
    }))
  ).run()

  if (logs.length > 0) console.log('\n')
  Object.keys(logs).forEach((key) => {
    console.log(chalk.magenta(key))
    console.log(logs[key])
  })
  if (logs.length > 0) console.log('\n')
}

async function execute(command, cwd, logs) {
  const executable = command.split(' ')[0]
  const args = command.split(' ').slice(1)

  try {
    const { stdout } = await execa(executable, args, { cwd })
    logs[command] = stdout
    Promise.resolve()
  } catch (err) {
    console.log(chalk.red('ERR!'), err.message)
    Promise.reject(new Error(`Failed to execute ${chalk.magenta(command)}`))
  }
}
