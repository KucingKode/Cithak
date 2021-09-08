const fs = require('fs-extra')
const chalk = require('chalk')
const Listr = require('listr')
const execa = require('execa')
const inquirer = require('inquirer')

const pathTo = require('../constants/paths')
const errors = require('../constants/error')
const {
  getTargetPath,
  getStorageTemplatePath,
  copyFolder,
  getTemplateData,
} = require('../helpers/file')

exports.copy = async (options) => {
  let config = options

  const projectPath = getTargetPath(config.targetPath)
  const storageData = fs.readJSONSync(pathTo.DATA_JSON)

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

  // copy template
  const storageTemplatePath = getStorageTemplatePath(config.templateName)
  const templateData = getTemplateData(storageTemplatePath)

  try {
    copyFolder(storageTemplatePath, projectPath, {
      safe: config.safe,
      join: !config.noJoin,
    })
  } catch (err) {
    console.log(chalk.red('ERR!'), err)
    return
  }

  // run template tasks
  if (!config.noExec && templateData.tasks) {
    const { tasks } = templateData

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
    console.log('\n')

    let permissionsRegex
    const logs = []

    if (permissions === 'all') {
      config.allowsAll = true
    } else {
      permissionsRegex = RegExp(`^[${permissions.replace(/,/g, '|')}]$`)
    }

    await new Listr(
      tasks.map((task, i) => ({
        title: task,
        task: () => execute(task, projectPath, logs),
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

  console.log(chalk.green('SUCCESS!'), `Template added!`)
}

async function execute(command, cwd, logs) {
  const file = command.split(' ')[0]
  const args = command.split(' ').slice(1)

  try {
    const { stdout } = await execa(file, args, { cwd })
    logs[command] = stdout
    Promise.resolve()
  } catch (err) {
    console.log(chalk.red('ERR!'), err.message)
    Promise.reject(new Error(`Failed to execute ${chalk.magenta(command)}`))
  }
}
