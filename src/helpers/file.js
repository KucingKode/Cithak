import fs from 'fs-extra'
import glob from 'glob'
import chalk from 'chalk'
import { join } from 'path'

import yaml from 'yaml'
import toml from '@iarna/toml'

import * as paths from '../constants/paths'

// path generator
// eslint-disable-next-line no-shadow
export const getTargetPath = (...subpaths) => join(process.cwd(), ...subpaths)
export const getStorageTemplatePath = (templateName) =>
  join(paths.STORAGE, templateName)

// data getter
export function getTemplateData(templatePath) {
  const path = join(templatePath, 'template.json')

  if (!fs.existsSync(path)) return {}
  return fs.readJSONSync(path)
}

// folder operations
export function copyFolder(src, dest, options = {}) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest)
  }

  const files = {}
  const patterns = ['**/*', ...(options.include || [])]

  patterns.forEach((pattern) => {
    const matches = glob.sync(pattern, {
      cwd: src,
      ignore: [
        'node_modules',
        'node_modules/**/*',
        'package-lock.json',
        'pnpm-lock.yaml',
        'yarn.lock',
        ...(options.exclude || []),
      ],
    })

    matches.forEach((match) => {
      files[match] = true
    })
  })

  Object.keys(files).forEach((file) => {
    const srcFile = join(src, file)
    const destFile = join(dest, file.replace(/(?:\.{2}\/?)*/, ''))
    let success = true

    if (fs.lstatSync(srcFile).isDirectory()) {
      // it's a directory
      if (!fs.existsSync(destFile)) {
        fs.mkdirSync(destFile, { recursive: true })
      } else {
        success = false
      }
    } else {
      // it's a file
      const joinable = fs.existsSync(destFile) && options.join

      if (
        joinable &&
        (file.endsWith('.json') || file.endsWith('.prettierrc'))
      ) {
        // join json
        const srcData = fs.readJSONSync(srcFile)
        const destData = fs.readJSONSync(destFile)

        fs.writeFileSync(
          destFile,
          JSON.stringify(deepMerge(srcData, destData), null, 4)
        )
      } else if (joinable && file.endsWith('.yaml')) {
        // join yaml
        const srcData = yaml.parse(fs.readFileSync(srcFile))
        const destData = yaml.parse(fs.readFileSync(destFile))

        fs.writeFileSync(destFile, yaml.stringify(deepMerge(srcData, destData)))
      } else if (joinable && file.endsWith('.toml')) {
        // join toml
        const srcData = toml.parse(fs.readFileSync(srcFile))
        const destData = toml.parse(fs.readFileSync(destFile))

        fs.writeFileSync(destFile, toml.stringify(deepMerge(srcData, destData)))
      } else if (
        joinable &&
        (file.endsWith('.env') ||
          file.endsWith('.gitignore') ||
          file.endsWith('.npmignore'))
      ) {
        // join .env
        const srcData = fs.readFileSync(srcFile)
        const destData = fs.readFileSync(destFile)

        fs.writeFileSync(destFile, `${srcData}\n${destData}`)
      } else {
        fs.copySync(srcFile, destFile, { overwrite: !options.safe })
      }
    }

    if (success) console.log(chalk.gray(`copied ${file}`))
  })
}

export function removeFolder(src) {
  const files = glob
    .sync('**/*', {
      cwd: src,
    })
    .reverse()

  files.forEach((file) => {
    const srcFile = join(src, file)

    if (fs.lstatSync(srcFile).isDirectory()) {
      fs.rmdirSync(srcFile)
    } else {
      fs.rmSync(srcFile)
    }

    console.log(chalk.gray(`removed ${file}`))
  })

  fs.rmdirSync(src)
}

function deepMerge(target, ...sources) {
  function isObject(item) {
    return item && typeof item === 'object' && !Array.isArray(item)
  }

  if (!sources.length) return target
  const source = sources.shift()

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} })
        deepMerge(target[key], source[key])
      } else {
        Object.assign(target, { [key]: source[key] })
      }
    })
  }

  return deepMerge(target, ...sources)
}
