# Cithak

![icon](./images/icon.svg)

---

[![made-with-javascript](https://img.shields.io/badge/Made%20with-JavaScript-1f425f.svg)](https://www.javascript.com)
[![badge](https://img.shields.io/github/license/KucingKode/Cithak)](./LICENSE.md)
[![badge](https://img.shields.io/github/last-commit/KucingKode/Cithak)](https://github.com/KucingKode/Cithak)
[![badge](https://img.shields.io/github/package-json/v/KucingKode/Cithak)](https://www.npmjs.com/package/cithak)
[![badge](https://img.shields.io/npm/dw/cithak)](https://www.npmjs.com/package/cithak)

[![GitHub stars](https://img.shields.io/github/stars/KucingKode/Cithak.svg?style=social&label=Star&maxAge=2592000)](https://GitHub.com/KucingKode/Cithak/stargazers/)

Homepage: <https://KucingKode.github.io/Cithak>

## 🤔 What Is This

Cithak is a **simple, secure yet powerful template manager** CLI. Cithak was designed to be safe and transparent, so everything will be done under your permission.

## 💻 Features

- **Smart replacement**  
  Cithak will not replace files that joinable like `.json`, `.yaml`, `.toml`, and `.env`, but cithak will join data from thoose file into one new file, you can disable this feature by add `--no-join` flag.

- **Rich features**  
  Cithak has a lot of super useful feature like save template to your local computer offline use, merge templates, and many more.

- **Template tasks**  
  <u>Under your permission</u> Cithak allows template to execute npm, node, and all files on your system, but you can disable this with `--no-exec` flag.

- **Safe and transparent**  
  Cithak will <u>log every template activities</u> to console and ask for your permission, so you will know what happen behind your screen.

## 📂 Installation

- Node.js

```bash
npm install -g cithak
```

- Windows, Linux, Mac

To use Cithak on Windows, Linux, or Mac without node js, download the latest executable for your operating system from [releases](https://github.com/KucingKode/Cithak/releases)

---

## 📃 Documentation

- [Quick Start](#💡-Quick-Start)
- [Docs](#📘-Docs)
- [Contributing](./CONTRIBUTING.md)
- [Code Of Conduct](./CODE_OF_CONDUCT.md)
- [License](./LICENSE.md)

## 💡 Quick Start

- **Create a template**  
  Create a new folder for your template, you can configure your template inside `template.json`, it can contain description for your template and many more, for more information about `template.json`, [read this section](#template-json).

```json
{
  "description": "describe-your-template-here"
}
```

- **Save new template**  
  To save a template just go to your template and type `cth save [template-name]`

- **Check your template**  
  After you save your template just check your template by using `cth info [template-name]`, it should log your template name and it's description

- **Clone to your project**  
  The last thing you want to do is just clone your template to your project by typing `cth clone [template-name]`.

Congratulation, now you know how to use Cithak CLI🎉

## 📘 Docs

- [CLI](#cli)
- [Joinable Fi;es](#joinable-files)
- [Template JSON](#template-json)

### CLI

![information](./images/help.png)

for more CLI information type `cth help` in your terminal

### Joinable Files

- **YAML** \*.yml, \*.yaml
- **TOML** \*.toml
- **JSON** \*.json
- **README** | README.\[md, txt, markdown\]
- **ENV** \*.env
- **REST** \*.rest
- .prettierrc
- .gitignore
- .npmignore
- .prettierignore

### Template JSON

template.json is important for your template, it contains description and tasks of your template, template.json must have `description` that describe the template, and template.json can also have:

- **tasks**

tasks is array of string contains all commands will executed

```js
{
   "tasks": [
      "npm i package",
      "node index.js",
      "echo 'hello'"
   ]
}
```

- **include**

include is array of [glob](https://github.com/isaacs/node-glob#readme) string will include a file to the template folder if that file or folder is outside from the template folder.

```js
"include": [
   "../outside.js",
   "../outside-folder/outside2.js"
]
```

- **exclude**

exclude is array of [glob](https://github.com/isaacs/node-glob#readme) string that will ignore files that match with it's pattern

```js
"exclude": [
   "**/*-ignore.*"
]
```

**More information, [Visit our website](https://KucingKode.github.io/Cithak)**

---

## 🎂 Contibuting

If you interested in contributing to this project, please read our [CONTRIBUTING.md](./CONTRIBUTING.md).

## 📃 License

Cithak was published under [MIT License](./LICENSE.md).
