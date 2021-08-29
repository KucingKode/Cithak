const chalk = require('chalk')

exports.INVALID_ACTION = {
   code: 'INVALID_ACTION',
   message: `Invalid action $action!`
}
exports.NO_TEMPLATE_JSON = {
   code: 'NO_TEMPLATE_JSON',
   message: 'Template folder must contain valid template.json file!'
}
exports.NO_TEMPLATE_NAME = {
   code: 'NO_TEMPLATE_NAME',
   message: 'Please provide a unique template name for this template!'
}
exports.TEMPLATE_EXIST = {
   code: 'TEMPLATE_EXIST',
   message: 'Template with name $name already exist!'
}
exports.TEMPLATE_NOT_FOUND = {
   code: 'TEMPLATE_NOT_FOUND',
   message: 'Template with name $name not found!'
}

exports.throw = (err, params) => {
   let message = err.message
   for(let key in params) {
      message = message.replace(`\$${key}`, params[key] || '')
   }

   console.log(chalk.bold.red('ERR!'), message)
   console.log(`${chalk.blueBright('INFO!')} type ${chalk.yellowBright('cithak -h')} for help`)
   return false
}