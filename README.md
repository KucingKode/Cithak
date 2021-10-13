# Cithak

![icon](./images/icon.svg)

---

[![badge](https://img.shields.io/github/license/KucingKode/Cithak)](./LICENSE.md)
[![badge](https://img.shields.io/github/last-commit/KucingKode/Cithak)](https://github.com/KucingKode/Cithak)
[![badge](https://img.shields.io/github/package-json/v/KucingKode/Cithak)](https://www.npmjs.com/package/cithak)
[![badge](https://img.shields.io/npm/dw/cithak)](https://www.npmjs.com/package/cithak)

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

## ❗ Migrating from alpha

If you want to **update Cithak from alpha to beta version**, please copy all of your template first, or you will lost all of your saved template.

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

- [CLI](#CLI)
- [Template JSON](#Template-JSON)

### CLI

![information](./images/help.png)

**for more CLI information type `cth help` in your terminal**

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

---

## 🎂 Contibuting

If you interested in contributing to this project, please read our [CONTRIBUTING.md](./CONTRIBUTING.md).

## 📃 License

Cithak was published under [MIT License](./LICENSE.md).
