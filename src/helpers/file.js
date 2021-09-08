const fs = require('fs-extra')
const glob = require('glob')
const chalk = require('chalk')
const { join } = require('path')

const yaml = require('yaml')
const toml = require('@iarna/toml')

const pathTo = require('../constants/paths')

// path generator
exports.getTargetPath = (targetPath) => join(process.cwd(), targetPath)
exports.getStorageTemplatePath = (templateName) =>
  join(pathTo.STORAGE, templateName)

// data getter
exports.getTemplateData = (templatePath) => {
  const path = join(templatePath, 'template.json')

  if (!fs.existsSync(path)) return {}
  return fs.readJSONSync(path)
}

// folder operations
exports.copyFolder = (src, dest, options = {}) => {
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
    const destFile = join(dest, file.replace(/^(?:\.{2}\/?)*/, ''))
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
          JSON.stringify({ ...srcData, ...destData }, null, 4)
        )
      } else if (joinable && file.endsWith('.yaml')) {
        // join yaml
        const srcData = yaml.parse(fs.readFileSync(srcFile))
        const destData = yaml.parse(fs.readFileSync(destFile))

        fs.writeFileSync(destFile, yaml.stringify({ ...srcData, ...destData }))
      } else if (joinable && file.endsWith('.toml')) {
        // join toml
        const srcData = toml.parse(fs.readFileSync(srcFile))
        const destData = toml.parse(fs.readFileSync(destFile))

        fs.writeFileSync(destFile, toml.stringify({ ...srcData, ...destData }))
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

exports.removeFolder = (src) => {
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
