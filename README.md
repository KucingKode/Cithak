# Cithak

![icon](./icon.svg)

## 🤔 What Is This

Cithak is a **simple and easy to use template manager** CLI. Cithak was designed to be safe and transparent, so everything will be done with your permission.

## 📂 Installation

To install Cithak CLI, just type this line to your terminal

```bash
npm install -g cithak
```

## 💻 Features

- **Smart replacement**  
Cithak will not replace your `package.json` file, but it will combine both `package.json` dependencies and update `package.json`.

- **Save for offline**  
Cithak store templates on your local computer, so you can use your templates even without internet connection. Just type `cth add [template-name] [template/path/from/cwd]` to make template ready to use.

- **Template tasks**  
With your permission Cithak allows template to initialize git, initialize npm, install dependencies, and run javascript file with node.

- **Safe and transparent**  
Cithak will log every activity to console and ask permission, so know what happen behind your screen.

___

## 📖 Quick start

- **Create a template**  
Create a new folder for your template, your template must have `template.json` that has description section, for more information about `template.json`, [read this section](#template-json).

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

tasks is array of string represent task to do

```json
{
   "tasks": [
      "__comment: initialize git",
      "git:init",

      "__comment: initialize npm",
      "npm:init",

      "__comment: execute setup.js file",
      "node | setup.js",

      "__comment: npm install",
      "npm:install",

      "__comment: npm install dotenv",
      "npm:install | dotenv",
      
      "__comment: npm install -D nodemon",
      "npm:devInstall | nodemon" 
   ]
}
```

- **include**

include is array of [glob](https://github.com/isaacs/node-glob#readme) string will include a file to the template folder if that file or folder is outside from the template folder.

```json
"include": [
   "../outside.js",
   "../outside-folder/outside2.js"
]
```

- **exclude**

exclude is array of [glob](https://github.com/isaacs/node-glob#readme) string that will ignore files that match with it's pattern

```json
"exclude": [
   "**/*-ignore.*"
]
```

___

## 🎂 Contibuting

Coming soon...

## 📃 License

Cithak use MIT License.
