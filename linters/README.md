# Understanding the Modern Web Stack: Babel

## Version Info & Repository

You can find the official repository for the _Understanding the Modern Web Stack_ tutorial series [here](https://github.com/alexeagleson/the-modern-web-stack).

This includes the final versions of the code examples from each tutorial to help make sure you haven't missed anything. You can also submit pull requests for any errors or corrections you may find (and I will update the blog posts accordingly).

## What is a linter?

A code [linter](<https://en.wikipedia.org/wiki/Lint_(software)>) is a tool to help minimize bad coding practices, and also help to standardize code syntax between team members working on a single project.

Since we are focused on the web, we'll be discussing linters in the context of Javascript. JS is a language well known to have a lot of quirks that often trip up people new to the language, even experienced developers coming from other languages.

![Javascript](https://www.freecodecamp.org/news/content/images/2019/07/best-js-meme-to-date-2.png)

In the above for example, using the `==` operator in JS instead of `===` allows types to be coerced into their [truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy) and [falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy) equivalents. Oftentimes this is not what the user intended when comparing a string and a number value, and can be a common source of errors.

A linter will allow you to apply a rule that either _warns_ or _prohibits_ the usage of the `==` operator, guiding every developer on your team to be explicit with their comparisons.

This will help introduce better _consistency_ across your codebase, which is one of the most valuable attributes of a software project at scale. It allows any developer to navigate different parts of the codebase and more quickly read and understand what the code is designed to do.

This is just one example of any number of potentially unlimited rules you can enable for a linter. You can even write rules yourself if you want.

In this tutorial we are going to demonstrate how to install and configure the most popular Javascript linter: ESlint.

## What is ESLint?

[ESLint](https://eslint.org/) is a highly configurable Javascript linter with a rich ecosystem of available rules. It can be added to any JS project and set to be as "light and suggestive" or as "strict and opinionated" as you and your team desire.

It can be added to your [continuous integration (CI)](https://en.wikipedia.org/wiki/Continuous_integration) pipeline to prohibit any code being merged into your main branch unless it adheres to a set of rules that are validated automatically. This dramatically reduces the amount of manual review required from other developers.

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

Create a file in your root directory called `script.js` with the following code:

`script.js`

```js
const person = {
  name: "Jen",
  name: "Steve",
};

let some_text = undefined;

function printHelloWorld() {
  console.log("hello world!");
}

printHelloWorld();
```

The above code is perfectly valid Javascript. You can verify by running:

```bash
node script.js
```

And you will get the output `hello world!`

However despite being _valid_ there are a number of problems that might prevent code like this from passing a review at your company.

- `person` is assigned two names, one overwrites the other.
- Semicolons are inconsistent. Some lines have them, others don't.
- Quotations are inconsistent. Some code uses single, others double.
- `some_text` is written in _snake_case_ instead of _camelCase_ (again, consistency)
- `person` and `some_text` are never actually used. Why did we declare them?

We could send this code back to the developer with this written list saying "please fix", but of course as you have already guessed, something as basic as this can easily be identified with a [static analysis](https://en.wikipedia.org/wiki/Static_program_analysis) tool like ESLint.

## Installing ESLint

Now let's `eslint` to our project with the following command:

```bash
npm install eslint --save-dev
```

At this point you have the _option_ of running the command `npx eslint --init` which will take you through a little questionnaire in your terminal about what kind of project you are making and what tools you are using.

For everyday use this is a great way to get started, however since our goal is to understand each piece of the configuration as we implement it, we are going to create our configuration file from scratch. Create a `.eslintrc.json` file in your root directory:

`.eslintrc.json`

```json
{
  "env": {
    "browser": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": 2021
  },
  "rules": {
    "quotes": ["error", "double"],
    "semi": ["error", "always"]
  }
}
```

_(Be sure to notice that our config filename begins with a `.` to indicate it is a hidden file)_

We can look at what each one of these fields in the config does:

- `env` - Specifies the environment we are planning to run our code in. When we say `browser` ESLint will not throw an error if we try to use a DOM method like `document.querySelector()`. Another common `env` value is `node`.

- `extends` - This option allows us to inherit from existing lists of rules. ESLint provides a list of [default recommended rules](https://eslint.org/docs/rules/). If there are any you disagree with, they can be disabled manually in the `rules` field on the config.

- `parserOptions` - Tells ESLint which [ECMA version](https://en.wikipedia.org/wiki/ECMAScript) of Javascript you are targeting. For example if you use a value fo `2015` it will throw an error if you try to use syntax like `const` or `let` instead of `var`. Setting it to `2016` would allow you to use them.

- `rules` - This is where you manually configure any rules you would like to apply in your project, and whether you want to show a warning or throw an error. Tools can be set to listen for ESLint errors and cancel if they are encountered.

We have decided to use the default `eslint:recommended` set of rules, but we would like to enforce that semicolons must always be used at the end of lines, and they all developers on the team use double quotes instead of single.

## Running ESLint

With this configuration in place, let's run ESLint on our `script.js` file with the following command:

```bash
npx eslint script.js
```

![ESLint Errors](https://i.imgur.com/WG5tDGA.png)

You can see that this tool has provided us with the information needed to correct the errors in our code.

Not only does ESLint inform us of the issues, it even knows how to fix some of the more basic syntax issues like quotes and semicolons. Run the command:

```bash
npx eslint script.js --fix
```

![ESLint Fixed Errors](https://i.imgur.com/ASfxTcr.png)

The problems with obvious solutions have been fixed. Check out `script.js` and see for yourself the file has been edited.

The other values don't have obvious solutions. Deciding whether or not to use `person` is more of a program logic decision than a syntax error. Similar, ESLint can't be sure which of the two names is correct.

So we decide to refactor our code so it looks like this:

`script.js`

```js
let some_text = "hello world!";

function printHelloWorld() {
  console.log(some_text);
}

printHelloWorld();
```

When we run `npx eslint script.js` again we see no output.

No output is good! It means there are no errors.

Except `some_text` is still using _snakeCase_ instead of _camelCase_. As it turns out casing in variable names is a [rule that exists](https://eslint.org/docs/rules/) called [camelcase](https://eslint.org/docs/rules/camelcase), it's just not enabled by default.

Let's turn it on in our config file:

`.eslintrc.json`

```json
{
  ...
  "rules": {
    "quotes": ["error", "double"],
    "semi": ["error", "always"],
    "camelcase": "warn"
  }
}
```

We decide that enforcing _camelCase_ isn't as important as making sure to use all the variables we declare, so we set it to `warn` instead of `error`.  When we run `npx eslint script.js` again we'll see:

![ESLint Warning](https://i.imgur.com/fdkUGAF.png)

Which is exactly what we were expecting.  Other devs on our team now know that anything other than _camelCase_ is discouraged, but it will not necessarily prevent their commit from being integrated into the main branch.

## Extending Configurations (Airbnb)

You can easily inherit from third party ESLint configurations that you've installed into your project.

One of the most famous examples is [eslint-config-airbnb](https://www.npmjs.com/package/eslint-config-airbnb) based on the set of linting rules used by Airbnb software developers.

To apply the same sets of rules they use, first install the plugin:

```bash
npm install eslint-config-airbnb --save-dev
```

Now add the plugin to the list of configurations we are extending in our config file:

`.eslintrc.json`
```json
{
  ...
  "extends": ["eslint:recommended", "airbnb"],
  ...
}
```

Now when we run `npx eslint script.js` we will discover that our program that previous met our own standards, no longer meets the higher standards of Airbnb:

![ESLint Airbnb Plugin Errors](https://i.imgur.com/KKx5Ruo.png)

You can continue to add plugins, chain them in the order you like, enable/disable rules and generally configure ESLint to work however best suits your team's project.


## Plugins (React)

Plugins allow to you add new rules that go beyond just the basic Javascript syntax so that you can also include rules that help write alternative syntax in the JS environment.  Two popular examples of that would be [React (JSX)](https://reactjs.org/docs/introducing-jsx.html) and [Typescript](https://www.typescriptlang.org/).

In this example we'll choose JSX, but the Typescript plugin setup works essentially the same way.

Create a new file called `react-example.jsx` in your root with the following content:

`react-example.jsx`
```js
const CoolComponent = () => <p>COOL</p>
```

Now install React, as well as the ESLint React plugin.  Although we are not going to run the code, having React installed will let ESLint automatically detect which version we are using and apply rules in that context.

```bash
npm install react
npm install eslint-plugin-react --save-dev
```

Then update your config like so to include the new `plugins` value and `plugin:react/recommended`:

`.eslintrc.json`
```json
{
  "root": true,
  "env": {
    "browser": true
  },
  "plugins": ["react"],
  "extends": ["eslint:recommended", "airbnb", "plugin:react/recommended"],
  "parserOptions": {
    "ecmaVersion": 2021
  },
  "rules": {
    "quotes": ["error", "double"],
    "semi": ["error", "always"],
    "camelcase": "warn"
  }
}
```

This time we will run ESLint with some additional flags to check all files in the root directory:

```bash
npx eslint ./ --ext .js --ext .jsx
```

The `./` says to lint files starting in the current directory.  By default it will process `.js` files but by using the `--ext` flag we can tell it to process both `.js` and `.jsx` files.  This will now give the output:

![ESLint React](https://i.imgur.com/6UdMQ1H.png)

## Editor Integration (VS Code)

ESLint can be integrated into your workflow to enable you to see errors as you type them, so you don't need to wait for the build process to discover them.  This is supported by a number of different IDEs, for this tutorial we will demonstrate how to add it to your VS Code environment.

First we will install the [ESLint extension for VS Code](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) and enable it.

Next we need to open VS Code's `settings.json` file.  You can find it in the `File > Preferences > Settings` menu (or `Code > Preferences > Settings` on mac) there is a link within the settings menu to access `settings.json` directly.

You can also access it through the Command Palette with `Ctrl + Shift + P` and typing `settings.json`:

```json
{
  "eslint.validate": ["javascript"]
}
```

Doing so will enable ESLint validation on all your Javascript files, including JSX.

_(Note you may have to close and re-open VS Code before it begins to properly lint your files)_

Now we can see the errors in our code as we write them.  The extension will automatically use the rules in your `.eslintrc.json` file:

![ESLint Extension](https://i.imgur.com/CQMyh6u.png)


## Wrapping Up

You should now have a good understanding about what linters are, and how ESLint specifically helps you and your team write better more consistent Javascript code.

Linters play an important role in the modern web stack.  Though some may disagree, the days or arguing between tabs and spaces, or use of semicolons are behind us.  Come to a decision for the project, not the individual, and let the tools manage it for you.  

That lets you put your attention on what the code does where it belongs, rather than the syntax itself.

Please check out the other entries in this series!  Feel free to leave a comment or question and share with others if you find any of them helpful:

- [Running a Local Web Server](https://dev.to/alexeagleson/understanding-the-modern-web-stack-running-a-local-web-server-4d8g)

- [Linters (ESLint)]()

- [Babel](https://dev.to/alexeagleson/building-a-modern-web-stack-babel-3hfp)

- [React & JSX](https://dev.to/alexeagleson/understanding-the-modern-web-stack-react-with-and-without-jsx-31c7)

- Webpack

    - [The Basics](https://dev.to/alexeagleson/understanding-the-modern-web-stack-webpack-part-1-2mn1)

    - [Loaders, Optimizations & Bundle Analysis](https://dev.to/alexeagleson/understanding-the-modern-web-stack-webpack-part-2-49bj)

    - [DevServer, React & Typescript](https://dev.to/alexeagleson/understanding-the-modern-web-stack-webpack-devserver-react-typescript-4b9b)

---

For more tutorials and developer guides, follow me <a href="https://twitter.com/eagleson_alex?ref_src=twsrc%5Etfw" class="twitter-follow-button" data-show-count="false">@eagleson_alex</a><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> on Twitter

Thanks for reading, and stay tuned!