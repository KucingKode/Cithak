const execa = require('execa')
const chalk = require('chalk')
const inquirer = require('inquirer')
const fs = require('fs-extra')
const Listr = require('listr')
const path = require('path')

const err = require('./errors')

exports.executeTasks = async (tasks, options, cwd) => {
   for(let i = 0; i < tasks.length; i++) {
      const task = tasks[i]

      if(task == 'git:init') {
         await new Listr([{
            title: 'Initialize git',
            task: () => git('init', {
               cwd
            })
         }]).run()
      }
      else if(task == 'npm:init') {
         await new Listr([{
            title: 'Initialize npm',
            task: () => npmInit({
               cwd
            })
         }]).run()
      }
      else if(task.startsWith('node')) {
         const filePath = task.split('|')[1].replace(' ', '')

         if(!fs.existsSync(path.join(cwd, filePath))) return
         const { run } = await inquirer.prompt([
            {
               type: 'confirm',
               name: 'run',
               message: `Do you want to execute \`${filePath}\`?`,
               default: true,
               when: !options.allowAll
            }
         ])
      
         if(run || options.allowAll) {
            await new Listr([{
               title: `Execute ${filePath}`,
               task: () => node(filePath, {
                  cwd
               })
            }]).run()
         } else {
            console.log(chalk.blue('INFO!'), `\`${filePath}\` execution cancelled because permission not allowed`)
         }
      }
      else if(task.startsWith('npm:install')) {
         const packages = (task.split('|')[1] || task.split('|')[0])
            .split(' ')
            .filter(str => str.length > 0)

         let { run } = await inquirer.prompt([
            {
               type: 'confirm',
               name: 'run',
               message: `Do you want to install ${packages.join(', ')}?`,
               default: true,
               when: !options.allowAll
            }
         ])
         let { pm } = await inquirer.prompt([
            {
               type: 'list',
               name: 'pm',
               when: run,
               when: run && !options.allowAll,
               message: `what package manager do you want to use?`,
               choices: ['npm', 'yarn', 'pnpm'],
               default: 'npm'
            }
         ])

         !run ? run = options.allowAll : ''
         !pm ? pm = 'npm' : ''
      
         if(run) {
            await new Listr([{
               title: `Install ${packages.join(', ')}`,
               task: () => npmInstall(pm, packages, {
                  cwd
               })
            }]).run()
         } else {
            console.log(
               chalk.blue('INFO!'),
               `\`${pm || 'npm'} install ${packages.join(' ')}\` execution cancelled because permission not allowed`
            )
         }
      }
      else if(task.startsWith('npm:devInstall')) {
         const packages = (task.split('|')[1] || task.split('|')[0])
            .split(' ')
            .filter(str => str.length > 0)

         let { run } = await inquirer.prompt([
            {
               type: 'confirm',
               name: 'run',
               message: `Do you want to install ${packages.join(', ')}?`,
               default: true,
               when: !options.allowAll
            }
         ])
         let { pm } = await inquirer.prompt([
            {
               type: 'list',
               name: 'pm',
               when: run && !options.allowAll,
               message: `what package manager do you want to use?`,
               choices: ['npm', 'yarn', 'pnpm'],
               default: 'npm'
            }
         ])

         !run ? run = options.allowAll : ''
         !pm ? pm = 'npm' : ''
      
         if(run) {
            await new Listr([{
               title: `Install ${packages.join(', ')} dev depenencies`,
               task: () => npmDevInstall(pm, packages, {
                  cwd
               })
            }]).run()
         } else {
            console.log(
               chalk.blue('INFO!'),
               `\`${pm || 'npm'} install -D ${packages.join(' ')}\` execution cancelled because permission not allowed`
            )
         }
      }
   }
}

async function git(args, options) {
   try {
      const {stdout} = await execa('git', [args.split(' ')], options)
      console.log(stdout)
      Promise.resolve()
   } catch(err) {
      console.log(chalk.red('ERR!'), err.message)
      Promise.reject('Failed to initialize git!')
   }
}
async function npmInit(options) {
   if(!fs.existsSync(
      path.join(options.cwd, 'package.json')
   )) {
      try {
         const {stdout} = await execa('npm', ['init'], options)
         console.log(stdout)
         Promise.resolve()
      } catch(err) {
         console.log(chalk.red('ERR!'), err.message)
         Promise.reject(`Failed to initialize npm!`)
      }
   } else {
      console.log(
         chalk.yellow('WARN!'),
         `npm initialization skipped because package.json already detected`
      )
      Promise.resolve()
   }
}

async function node(file, options) {
   try {
      const {stdout} = await execa('node', [file], options)
      console.log(stdout)
      Promise.resolve()
   } catch(err) {
      console.log(chalk.red('ERR!'), err.message)
      Promise.reject(`Failed to execute \`${file}\`!`)
   }
}

async function npmInstall(pm, packages, options) {
   try {
      console.log(pm)
      await execa(pm, ['install', ...packages], options)
      Promise.resolve()
   } catch(err) {
      console.log(chalk.red('ERR!'), err.message)
      Promise.reject(`Failed to install ${packages.join(', ')}`)
   }
}
async function npmDevInstall(pm, packages, options) {
   try {
      await execa(pm, ['install', '-D', ...packages], options)
      Promise.resolve()
   } catch(err) {
      console.log(chalk.red('ERR!'), err.message)
      Promise.reject(`Failed to install ${packages.join(', ')} for development`)
   }
}