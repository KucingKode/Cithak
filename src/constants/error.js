const { red } = require('chalk')

exports.INVALID_ACTION = new Error('Invalid action $action!')
exports.NO_TEMPLATE_JSON = new Error(
  'Template folder must contain valid template.json file!'
)
exports.NO_TEMPLATE_NAME = new Error(
  'Please provide a unique template name for this template!'
)
exports.TEMPLATE_EXIST = new Error('Template with name $name already exist!')
exports.TEMPLATE_NOT_FOUND = new Error('Template with name $name not found!')

exports.format = (message) => `${red.bold('ERR!')} ${message}`

exports.send = (err, params) => {
  let { message } = err

  Object.keys(params).forEach((key) => {
    message = message.replace(`$${key}`, params[key] || '')
  })

  console.log(this.format(message))
  return false
}
