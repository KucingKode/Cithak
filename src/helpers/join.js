import YAML from 'yaml'
import TOML from '@iarna/toml'

export const joinables = [
  createJoinable('.json', joinJson),
  createJoinable('.prettierrc', joinJson),
  createJoinable('.yaml', joinYaml),
  createJoinable('.toml', joinToml),
  createJoinable('.env', joinText),
  createJoinable('.gitignore', joinText),
  createJoinable('.prettierignore', joinText),
  createJoinable('.npmignore', joinText),
  createJoinable('.log', joinText),
  createJoinable('.md', joinTextNeat),
  createJoinable('.txt', joinTextNeat),
  createJoinable('.rest', joinTextNeat),
]

function joinJson(str1, str2) {
  const data1 = JSON.parse(str1)
  const data2 = JSON.parse(str2)

  return JSON.stringify(deepMerge(data1, data2), null, 4)
}
function joinYaml(str1, str2) {
  const data1 = YAML.parse(str1)
  const data2 = YAML.parse(str2)

  return YAML.stringify(deepMerge(data1, data2))
}
function joinToml(str1, str2) {
  const data1 = TOML.parse(str1)
  const data2 = TOML.parse(str2)

  return TOML.stringify(deepMerge(data1, data2))
}
function joinText(str1, str2) {
  return `${str1}\n${str2}`
}
function joinTextNeat(str1, str2) {
  return `${str1}\n\n${str2}`
}

// helpers
function deepMerge(target, ...sources) {
  // deep merge two object

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

function createJoinable(extension, joiner) {
  return { extension, joiner }
}
