import arg from 'arg'
import fs from 'fs-extra'
import { version as VERSION } from '../package.json'

import * as pathHelper from './helpers/path'
import * as errorHelper from './helpers/error'
import { sendTips } from './helpers/tips'

// actions
import { help as helpAction } from './actions/help'
import { list as listAction } from './actions/list'
import { info as infoAction } from './actions/info'

import { save as saveAction } from './actions/save'
import { clone as cloneAction } from './actions/clone'
import { remove as removeAction } from './actions/remove'
import { update as updateAction } from './actions/update'
import { merge as mergeAction } from './actions/merge'
import { rename as renameAction } from './actions/rename'

import * as backupAction from './actions/backup'

const actions = {
  // helper action
  help: helpAction,
  list: listAction,
  info: infoAction,

  // main action
  save: saveAction,
  clone: cloneAction,
  remove: removeAction,
  update: updateAction,
  merge: mergeAction,
  rename: renameAction,

  // alias action
  cl: cloneAction,
  rm: removeAction,
  rn: renameAction,

  // backup action
  backup: backupAction.backup,
  load: backupAction.load,
}

function parseArgs(rawArgs) {
  try {
    const args = arg(
      {
        '--yes': Boolean,
        '--safe': Boolean,
        '--help': Boolean,
        '--version': Boolean,
        '--change': String,
        '--no-merge': Boolean,
        '--no-exec': Boolean,
        '--path': String,
        '--index': Boolean,
        '--quiet': Boolean,
        '-y': '--yes',
        '-s': '--safe',
        '-h': '--help',
        '-v': '--version',
        '-c': '--change',
        '-p': '--path',
        '--nm': '--no-merge',
        '--ne': '--no-exec',
        '-i': '--index',
        '-q': '--quiet',
      },
      {
        argv: rawArgs.slice(2),
      }
    )

    return {
      action: !args._[0] ? 'help' : args._[0],
      targetPath: args['--path'] || '.',
      templateNames: args._.slice(1, args._.length),

      needVersion: args['--version'],
      needHelp: args['--help'],
      allowsAll: args['--yes'],
      safe: args['--safe'],
      noMerge: args['--no-merge'],
      noExec: args['--no-exec'],
      index: args['--index'],
      quiet: args['--quiet'],

      changes: parseChanges(args['--change']),
    }
  } catch ({ message }) {
    console.log(errorHelper.format(message))
    return { err: true }
  }
}

function parseChanges(str) {
  return str && str.split
    ? str
        .split(' ')
        .filter((val) => val !== '')
        .map((change) => change.split('|'))
    : []
}

exports.cli = async (args) => {
  if (!fs.existsSync(pathHelper.STORAGE)) {
    fs.mkdirSync(pathHelper.STORAGE, { recursive: true })
    fs.writeFileSync(pathHelper.DATA_JSON, '{}')
  }

  pathHelper.state.cwd = process.cwd()

  const options = parseArgs(args)
  if (options.err) return

  if (options.needVersion) {
    await console.log(`v${VERSION}`)
  } else if (options.action === 'help' || options.needHelp) {
    await actions.help(options)
  } else if (actions[options.action]) {
    await actions[options.action](options)
  } else {
    await actions.help(options, errorHelper.INVALID_ACTION)
  }

  sendTips()
}
