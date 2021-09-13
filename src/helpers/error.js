import chalk from 'chalk'

export const INVALID_ACTION = new Error('Invalid action $action!')
export const NO_TEMPLATE_JSON = new Error(
  'Template folder must contain valid template.json file!'
)
export const NO_TEMPLATE_NAME = new Error(
  'Please provide a unique template name for this template!'
)
export const NO_BACKUP_DATA = new Error(
  'Backup folder must contain backup.json file!'
)
export const TEMPLATE_EXIST = new Error(
  'Template with name $name already exist!'
)
export const TEMPLATE_NOT_FOUND = new Error(
  'Template with name $name not found!'
)
export const GIT_NOT_FOUND = new Error('This action need to executed git!')
export const INVALID_TEMPLATE_NAME = new Error(
  'A template name cannot started with "github@" "gitlab@" or "bitbucket@"'
)

export const format = (message) => `${chalk.red.bold('ERR!')} ${message}`

export const send = (err, params) => {
  let { message } = err

  Object.keys(params).forEach((key) => {
    message = message.replace(`$${key}`, params[key] || '')
  })

  console.log(format(message))
  throw err
}
