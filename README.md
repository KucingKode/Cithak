# Cithak

![icon](./icon.svg)

## 🤔 What Is This

Cithak is a **simple and easy to use template manager** CLI. Cithak was designed to be safe and transparent, so everything will be done with your permission.

## 📂 Installation

To install Cithak CLI, your node.js version must higher or equal 10.0.0, then just type this line to your terminal

```bash
npm install -g cithak
```

## 💻 Features

- **Smart replacement**  
  Cithak will not replace files that joinable like `.json`, `.yaml`, `.toml`, and `.env`, but cithak will join data from thoose file into one new file, you can disable this feature by add `--no-join` flag.

- **Save for offline**  
  Cithak store templates on your local computer, so you can use your templates even without internet connection. Just type `cth add [template-name] [template/path/from/cwd]` to make template ready to use.

- **Template tasks**  
  With your permission Cithak allows template to execute npm, node, and all files on your system, but you can disable this with `--no-exec` flag.

- **Safe and transparent**  
  Cithak will log every activity to console and ask permission, so know what happen behind your screen.

---

## 📖 Quick start

- **Create a template**  
  Create a new folder for your template, you can configure your template inside `template.json`, it can contain description for your template and many more, for more information about `template.json`, [read this section](#template-json).

```json
{
  "description": "describe-your-template-here"
}
```

- **Add new template**  
  To add a template just go to your template and type `cth add [template-name]`

- **Check your template**  
  After you add your template just check your template by using `cth info [template-name]`, it should log your template name and it's description

- **Copy to your project**  
  The last thing you want to do is just copy your template to your project by typing `cth copy [template-name]`.

Congratulation, now you know how to use Cithak CLI🎉

## 📘 Docs

### > CLI

for cli information type `cth --help` in your terminal

### > **Template JSON**

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

Coming soon...

## 📃 License

Cithak use MIT License.
