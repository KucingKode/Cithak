const arg = require('arg')
const chalk = require('chalk')
const fs = require('fs-extra')
const path = require('path')
const actions = require('./actions')
const err = require('./errors')

function parseArgs(rawArgs) {
   try {
      const args = arg(
         {
            '--yes': Boolean,
            '--log': Boolean,
            '--safe': Boolean,
            '--help': Boolean,
            '--full': Boolean,
            '-y': '--yes',
            '-l': '--log',
            '-f': '--full',
            '-s': '--safe',
            '-h': '--help'
         },
         {
            argv: rawArgs.slice(2)
         }
      )
      
      return {
         action: !args._[0] ? 'help' : args._[0],
         needHelp: args['--help'],
         allowAll: args['--yes'],
         log: args['--log'],
         fullCopy: args['--full'],
         safe: args['--safe'],
         templateName: args._[1],
         targetPath: args._[2] || '.',
      }

   } catch(err) {
      console.log(chalk.red('ERR!'), err.message)
      return { err: true }
   }
}

exports.cli = (args) => {
   if(!fs.existsSync(path.join(__dirname, 'data.json'))) {
      // create data.json if no data.json
      fs.writeFileSync(path.join(__dirname, 'data.json'), '{}')
   }

   let options = parseArgs(args)
   if(options.err) return
   
   
   if(options.action == 'help' || options.needHelp) {
      actions.help(options)
      return true
   }

   return actions[options.action] ?
      actions[options.action](options) : actions.help(options, err.INVALID_ACTION)
}