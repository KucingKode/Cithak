# Cithak Changelog

## 1.3.0

- remove unused dependencies
- use [dmerge.js](https://www.npmjs.com/package/dmergejs) for data merging
- rename `--no-join` to `--no-merge`
- add merger for `.tml`
- change `.rest` file merger
- optimize binary size

## 1.2.0

- add git branch select feature
- make logs more clear
- fix error catching
- use process.exit

## 1.1.1

- add deleted cithak bin file

## 1.1.0

- Add "remove" and "copy" folder error catch
- Update tips
- Add some alias command
- Change "silent" flag to "quiet"

## 1.0.1

- Change README.md
- Add homepage made with slinkity and 11ty
- Update release github action
- Add docs deploy script

## 1.0.0

- Add silent flag
- Add tips
- Add index prefer flag
- Fix setIcon script

## 1.3.3-beta

- create joinable file filter to not case sensitive
- remove `.md` file, add `readme.md, readme.markdown, *.yml`

## 1.3.2-beta

- change executable icon and fix release action

## 1.3.1-beta

- Fix executable error

## 1.3.0-beta

- Add more joinable file
- Fix update command bug
- Change template folder from `CthTemp` to `_temp`
- Improve log

## 1.2.0-beta

- Simplify error message
- Improve log

## 1.1.0-beta

- Add template `rename` feature
- Support cloning and saving template from github, gitlab, and bitbucket repository
- Remove unused dependencies

## 1.0.0-beta

- Change help info
- Add template `merge` feature
- Add template `backup` command
- Add `load` template backup command
- Change command name from `add` to `save`
- Change command name from `copy` to `clone`
- change storage folder path
- Change file modules from cjs to esm
- Configured rollup

---

## 2.0.0-alpha

- Large Refactoring
- Configured ESLint and Prettier
- Add TOML and YAML file join feature
