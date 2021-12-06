import * as dmerge from 'dmergejs'

const mergeJson = (...str) => dmerge.mergeJson(...str).string()
const mergeYaml = (...str) => dmerge.mergeYaml(...str).string()
const mergeToml = (...str) => dmerge.mergeToml(...str).string()
const mergeEnv = (...str) => dmerge.mergeEnv(...str).string()
const mergeList = (...str) => dmerge.mergeList(...str).string()

function mergeText(divider) {
  return (str1, str2) =>
    `${str1.replace(/\n$/, '')}\n\n${divider}\n\n${str2.replace(/\n$/, '')}`
}

export const mergeables = [
  ['.json', mergeJson],
  ['.prettierrc', mergeJson],
  ['.yaml', mergeYaml],
  ['.yml', mergeYaml],
  ['.toml', mergeToml],
  ['.tml', mergeToml],
  ['.env', mergeEnv],
  ['.gitignore', mergeList],
  ['.prettierignore', mergeList],
  ['.npmignore', mergeList],
  ['readme.md', mergeText('---')],
  ['readme.markdown', mergeText('---')],
  ['readme.txt', mergeText('---')],
  ['readme', mergeText('---')],
  ['.rest', mergeText('###')],
]
