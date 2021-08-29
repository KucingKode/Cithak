const chalk = require('chalk')
const path = require('path')
const inquirer = require('inquirer')
const glob = require('glob')
const fs = require('fs-extra')

const err = require('./errors')
const tasks = require('./tasks')
const { trim, assignPackage } = require('./helper')


async function copyFiles(include, exclude, options) {
   try {
      let filesSet = {}
      include.forEach(pattern => {
         const files = glob.sync(pattern, {
            cwd: options.src,
            ignore: exclude
         }) || []
   
         files.forEach(file => {
            filesSet[file] = true
         })
      })
   
      for(let file in filesSet) {
         const src = path.join(options.src, file)
         const dest = path.join(options.dest, file.replace('..', '.'))
   
         if(
            file == 'package.json' &&
            fs.existsSync(path.join(options.dest, 'package.json'))
         ) {
            // add dependencies to existing package.json
            // if there is existing package.json
            const localPackage = JSON.parse(fs.readFileSync(src))
            const templatePackage = JSON.parse(
               fs.readFileSync(path.join(options.dest, file))
            )

            fs.writeFileSync(
               path.join(options.dest, 'package.json'),
               assignPackage(localPackage, templatePackage)
            )

            if(options.log) {
               console.log(chalk.gray('updated package.json'))
            }
         }
         else if(!options.safe || (options.safe && !fs.existsSync(dest)) ) {
            // copy files
            if(fs.lstatSync(src).isDirectory()) {
               fs.mkdirSync(dest, { recursive: true })
            } else {
               fs.copySync(src, dest, { recursive: true })
            }
   
            if(options.log) {
               console.log(chalk.gray(`copied ${file}`))
            }
         }

      }
   } catch(err) {
      throw err
   }
}

const storagePath = path.join(__dirname, '../storage')
const storageDataPath = path.join(__dirname, './data.json')

exports.add = async (options) => {
   const templatePath = path.join(process.cwd(), options.targetPath)
   const templateJsonPath = path.join(templatePath, './template.json')
   
   if(!fs.existsSync(templateJsonPath))
      return err.throw(err.NO_TEMPLATE_JSON)
   
   const storageData = JSON.parse(fs.readFileSync(storageDataPath))
   const templateData = JSON.parse(fs.readFileSync(templateJsonPath))

   // prompt question if no template name
   options = Object.assign(options, await inquirer.prompt([
      {
         type: 'input',
         name: 'templateName',
         when: !options.templateName,
         message: 'Please enter template name'
      }
   ]))

   if(!options.templateName) {
      return err.throw(err.NO_TEMPLATE_NAME)
   }

   // if there is a template with same name in storage, throw error
   if(storageData[options.templateName]) {
      return err.throw(err.TEMPLATE_EXIST, {name: options.templateName})
   }
   
   // copy template
   try {
      copyFiles([
         '**/*', ...(templateData.include || [])
      ], [
         'node_modules',
         'package-lock.json',
         'pnpm-lock.yaml',
         'yarn-lock.yaml',
         ...(templateData.exclude || [])
      ], {
         src: path.join(templatePath),
         dest: path.join(storagePath, options.templateName),
         log: options.log
      })
   } catch(err) {
      return console.log(chalk.red('ERR!'), err.message)
   }

   // store template info
   storageData[options.templateName] = {
      path: path.join(storagePath, options.templateName),
      description: templateData.description || ''
   }
   fs.writeFileSync(storageDataPath, JSON.stringify(storageData))

   console.log(chalk.green('SUCCESS!'), `Template added!`)
   return true
}

exports.remove = async (options) => {
   const storageData = JSON.parse(fs.readFileSync(storageDataPath))

   // prompt question if no template name
   options = Object.assign(options, await inquirer.prompt([
      {
         type: 'input',
         name: 'templateName',
         when: !options.templateName,
         message: 'Please enter template name'
      }
   ]))

   if(!options.templateName) {
      return err.throw(err.NO_TEMPLATE_NAME)
   }
   
   const templateData = storageData[options.templateName]

   // throw error if template not registered
   if(!templateData) {
      return err.throw(err.TEMPLATE_NOT_REGISTERED, {name: options.templateName})
   }

   // delete template folder from storage
   try {
      fs.rmSync(templateData.path, { recursive: true, force: true })
      delete storageData[options.templateName]
   } catch(err) {
      return console.log(chalk.red('ERR!'), err.message)
   }

   // rewrite storage data
   fs.writeFileSync(storageDataPath, JSON.stringify(storageData))

   console.log(chalk.green('SUCCESS!'), `Template removed!`)
   return true
}

exports.copy = async (options) => {
   const storageData = JSON.parse(fs.readFileSync(storageDataPath))

   // prompt question if no template name
   options = Object.assign(options, await inquirer.prompt([
      {
         type: 'input',
         name: 'templateName',
         when: !options.templateName,
         message: 'Please enter template name'
      }
   ]))

   if(!options.templateName) {
      return err.throw(err.NO_TEMPLATE_NAME)
   }

   const templateData = storageData[options.templateName]
   const cwd = path.join(process.cwd(), options.targetPath)

   // throw error if template not found on storage data
   if(!templateData) {
      return err.throw(err.TEMPLATE_NOT_FOUND, {name: options.templateName})
   }

   // copy template folder from storage
   try {
      await copyFiles(
      ['**/*'],
      !options.fullCopy ? ['template.json'] : [],
      {
         src: templateData.path,
         dest: cwd,
         safe: options.safe,
         log: options.log
      })

   } catch(err) {
      return console.log(chalk.red('ERR!'), err.message)
   }
   
   
   
   const template = JSON.parse(
      fs.readFileSync(path.join(templateData.path, 'template.json'))
   )
   if(template.tasks.length > 0) {
      // run all template tasks

      await tasks.executeTasks(template.tasks, options, cwd)
   }

   console.log(chalk.green('SUCCESS!'), `Template copied!`)
   return true
}

exports.update = async (options) => {
   const templatePath = path.join(process.cwd(), options.targetPath)
   const templateJsonPath = path.join(templatePath, './template.json')
   
   if(!fs.existsSync(templateJsonPath))
      return err.throw(err.NO_TEMPLATE_JSON)
   
   const storageData = JSON.parse(fs.readFileSync(storageDataPath))
   const templateData = JSON.parse(fs.readFileSync(templateJsonPath))

   // prompt question if no template name
   options = Object.assign(options, await inquirer.prompt([
      {
         type: 'input',
         name: 'templateName',
         when: !options.templateName,
         message: 'Please enter template name'
      }
   ]))

   if(!options.templateName) {
      return err.throw(err.NO_TEMPLATE_NAME)
   }

   // throw error if template not found on storage data
   if(!storageData[options.templateName]) {
      return err.throw(err.TEMPLATE_NOT_FOUND, {name: options.templateName})
   }
   
   // replace template
   // copy template
   try {
      copyFiles([
         '**/*', ...(templateData.include || [])
      ], [
         'node_modules',
         'package-lock.json',
         'pnpm-lock.yaml',
         'yarn-lock.yaml',
         ...(templateData.exclude || [])
      ], {
         src: path.join(templatePath),
         dest: path.join(storagePath, options.templateName),
         log: options.log
      })
   } catch(err) {
      return console.log(chalk.red('ERR!'), err.message)
   }

   // store template info
   storageData[options.templateName].description =
      templateData.description || storageData[options.templateName].description

   fs.writeFileSync(storageDataPath, JSON.stringify(storageData))

   console.log(chalk.green('SUCCESS!'), `Template updated!`)
   return true
}

exports.help = (options, state) => {
   const info = require('./infoTexts')

   if(state == err.INVALID_ACTION)
      return err.throw(state, {action: options.action})

   info[options.action] ?
      console.log(trim(info[options.action])) :
      console.log(trim(Object.values(info).join('\n')))
   
   return true
}
exports.list = () => {
   const storageData = JSON.parse(fs.readFileSync(storageDataPath))
   
   let list = ''
   for(let key in storageData) {
      const desc = storageData[key].description
      list += `- ${chalk.yellow(key)}\n${desc}\n\n`
   }

   console.log(list.replace(/\n\n$/, ''))
   return true
}
exports.info = async (options) => {
   const storageData = JSON.parse(fs.readFileSync(storageDataPath))

   // prompt question if no template name
   options = Object.assign(options, await inquirer.prompt([
      {
         type: 'input',
         name: 'templateName',
         when: !options.templateName,
         message: 'Please enter template name'
      }
   ]))

   if(!options.templateName) {
      return err.throw(err.NO_TEMPLATE_NAME)
   }

   const templateData = storageData[options.templateName]

   // throw error if template not found on storage data
   if(!templateData) {
      return err.throw(err.TEMPLATE_NOT_FOUND, {name: options.templateName})
   }

   console.log(
      `${chalk.yellow(options.templateName)}\n${templateData.description}`
   )
   return true
}