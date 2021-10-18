# Understanding the Modern Web Stack: Prettier

You can find the official repository for the _Understanding the Modern Web Stack_ tutorial series [here](https://github.com/alexeagleson/the-modern-web-stack).

This includes the final versions of the code examples from each tutorial to help make sure you haven't missed anything. You can also submit pull requests for any errors or corrections you may find (and I will update the blog posts accordingly).

## Table of Contents

1. [What is Prettier?](#what-is-prettier)
1. [Prerequisites](#prerequisites)
1. [Initializing the Project](#initializing-the-project)
1. [Installing Prettier](#installing-prettier)
1. [Running Prettier](#running-prettier)
1. [Integration with ESLint](#integration-with-eslint)
1. [Editor Integration (VS Code)](#editor-integration-vs-code)
1. [Automation and Hooks](#automation-and-hooks)
1. [Wrapping Up](#wrapping-up)

## What is Prettier?

[Prettier](https://prettier.io/) in their own words is an _opinionated_ code formatter for Javascript.  What this means is that although it is configurable to some degree, the majority of the decisions it makes about how your code should be formatted are automatic and built into the tool itself.

Though this may sound like a downside, we should consider the benefits of this.  

Being _consistent_ with coding style is significantly more important than the style you actually adopt.  Leveraging the existing work done by professional developers of the past allows you to focus your attention on the code itself, which is where your attention really belongs.  

Code formatters differ from linters in that they are exclusively concerned with the syntax and appearance of the code on your screen, rather than the quality of the code itself.

Another key difference is that linters are foremost concerned with identifying errors and communicating them, not fixing them for you (some exceptions for simple issues).  

A formatter's primary function is handling those fixes and updating your code automatically so you don't have to.  

Of course one of the best ways to learn how a formatter works is to use it!

## Prerequisites

You will need to have [Node.js](https://nodejs.org/en/download/) installed on your machine and available from your terminal. Installing Node will automatically install [npm](<https://en.wikipedia.org/wiki/Npm_(software)>) as well, which is what you will use to install Babel.

Open up your terminal of choice. If you see version numbers when running the two commands below (your numbers will likely be different than this example) then you are ready to go:

```bash
node --version
> v15.5.0

npm --version
> 7.16.0
```

## Initializing the Project

Let's start by initializing a new `npm` project. Run the following command to generate one:

```bash
npm init -y
```

The `-y` flag will automatically select default values for everything, which is appropriate in our example.

## Installing Prettier

Run the following command in your project's root directory:

```bash
npm install prettier --save-dev
```

Next create a file called `script.js` with the following code (including the obvious formatting issues):

`script.js`
```js
console.log(
"hello world"
)

if (true) { console.log('this always runs'); }

const exampleArray = [1,2,3,4,
     5,6,7,8
     ,9, 10]
```

Before we run Prettier, we can configure it by creating a `.prettierrc.json` file.  This is optional, and if you don't create one Prettier will simply use its own opinionated defaults.  

For the sake of learning we will create the file in the root of our project with some of the [options described here](https://prettier.io/docs/en/options.html)

`.prettierrc.json`
```json
{
  "trailingComma": "es5",
  "tabWidth": 2,
  "semi": true,
  "singleQuote": true
}
```

The `es5` value of `trailingComma` ensures that it will be included on code where it was valid as of ES5 (arrays and objects).  Modern Javascript supports it in more places (function arguments for example), so if you are targeting modern browsers you can use a value of `all`.  Third option is `none`.

The latter three config options should be self-explanatory.

## Running Prettier

Run the following command:

```bash
npx prettier --write script.js
```

Your `script.js` file will be updated automatically with Prettier's formatting options applied.

`script.js`
```js
console.log('hello world');

if (true) {
  console.log('this always runs');
}

const exampleArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
```

## Ignoring Code

You may have some files in your project that you don't want to waste resources on auto-formatting.  To handle these simply create a `.prettierignore` file with the name (or pattern) of files you wish to ignore:

`.prettierignore`
```
build
*.css
```

The above will ignore anything in the `build` directory and all CSS files in the project.  

Also you may have code within files that you intentionally have formatted in a certain way that you don't want Prettier to overwrite.  You can use a simple comment to keep Prettier for acting on that code like so:

```js
// prettier-ignore
const exampleArray = [
  1,2,3,4,5
]
```

This works with any type of file that Prettier acts on, just use the appropriate type of comment.  For HTML as example it would be `<!-- prettier-ignore -->`.  Find the full list [here](https://prettier.io/docs/en/ignore.html).

## Integration with ESLint

_(If you are unfamiliar with linters and ESLint, check out [Understanding the Modern Web Stack: ESLint](https://dev.to/alexeagleson/understanding-the-modern-web-stack-linters-eslint-59pm))_

If you are using ESLint you may have set up some linter rules that are based on formatting, or you might be extending existing configurations based on formatting.  

For these formatting issues it's better to leave them to Prettier, since it will fix them automatically, you don't have to worry about your linter reporting errors or showing red lines for issues that are going to disappear anyway.

To automatically disable all ESLint rules that conflict with prettier you can use [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier) as follows:

`.eslintrc.json`
```json
{
  "extends": [
    ...
    "prettier"
  ]
}
```

Where the `...` are the other configurations you are extending, and `prettier` coming last will overwrite.

## Editor Integration (VS Code)

Like many modern development tools, you can integrate Prettier into your IDE and have it run automatically in certain conditions.  The most popular of which is _on save_.

Our example will show how to add Prettier to VS Code.  Begin by installing the [Prettier VS Code extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode).

Next we need to open VS Code's `settings.json` file.  You can find it in the `File > Preferences > Settings` menu (or `Code > Preferences > Settings` on mac) there is a link within the settings menu to access `settings.json` directly.

You can also access it through the Command Palette with `Ctrl + Shift + P` and typing `settings.json`:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[javascript]": {
    "editor.formatOnSave": true
  }
}
```

The above config will set Prettier to automatically format all files it knows how to format `(Windows Shift + Alt + F, Mac Shift + Option + F, Linux Ctrl + Shift + I)`.  For Javascript files it will format them automatically when you save.  For more fine grained customization options check the extension's [documentation](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode).

The Prettier extension will automatically use the version of `prettier` you have installed in your NPM project in your workspace folder.  It will also use any `.prettierrc.json` and `.prettierignore` files it finds as the default config.

## Automation and Hooks

You can implement Prettier into your CI workflow so that each member of your team has Prettier run automatically before code is committed.  This is a great way to reduce the number of reporting changes with commands like `git diff` with merges and pull requests, since all code committed by all team members will match the same pattern.

There are a number fo ways to implement this, and the best option depends on your workflow.  The specific details are beyond the scope of this tutorial but you can find all the details [here](https://prettier.io/docs/en/precommit.html).

## Wrapping Up

You should now have a good understanding about what code formatters are, and how Prettier helps to handle code formatting for you so that you can focus on the code itself.   

Please check out the other entries in this series!  Feel free to leave a comment or question and share with others if you find any of them helpful:

- [Running a Local Web Server](https://dev.to/alexeagleson/understanding-the-modern-web-stack-running-a-local-web-server-4d8g)

- [ESLint](https://dev.to/alexeagleson/understanding-the-modern-web-stack-linters-eslint-59pm)

- [Prettier]()

- [Babel](https://dev.to/alexeagleson/building-a-modern-web-stack-babel-3hfp)

- [React & JSX](https://dev.to/alexeagleson/understanding-the-modern-web-stack-react-with-and-without-jsx-31c7)

- Webpack

    - [The Basics](https://dev.to/alexeagleson/understanding-the-modern-web-stack-webpack-part-1-2mn1)

    - [Loaders, Optimizations & Bundle Analysis](https://dev.to/alexeagleson/understanding-the-modern-web-stack-webpack-part-2-49bj)

    - [DevServer, React & Typescript](https://dev.to/alexeagleson/understanding-the-modern-web-stack-webpack-devserver-react-typescript-4b9b)

---

For more tutorials like this, follow me <a href="https://twitter.com/eagleson_alex?ref_src=twsrc%5Etfw" class="twitter-follow-button" data-show-count="false">@eagleson_alex</a><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> on Twitter

Thanks for reading, and stay tuned!