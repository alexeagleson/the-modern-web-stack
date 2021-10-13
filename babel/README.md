# Understanding the Modern Web Stack: Babel

## Version Info & Repository

_(This tutorial is written using [Babel v7](https://babeljs.io/blog/2018/08/27/7.0.0) however the general concepts will apply to any version)_

You can find the official repository for the _Understanding the Modern Web Stack_ tutorial series [here](https://github.com/alexeagleson/the-modern-web-stack).  

This includes the final versions of the code examples from each tutorial to help make sure you haven't missed anything.  You can also submit pull requests for any errors or corrections you may find (and I will update the blog posts accordingly).

## Table of Contents

1. [What is Babel](#what-is-babel)
1. [Prerequisites](#prerequisites)
1. [Initializing the Project](#initializing-the-project)
1. [Installing Babel](#installing-babel)
1. [Transforming Your Code](#transforming-your-code)
1. [Polyfills](#polyfills)
1. [Wrapping Up](#wrapping-up)

## What is Babel?

Babel is a tool that lets you write your Javascript code using all the latest syntax and features, and run it in browsers that may not support those features. Babel is a [transpiler](https://en.wikipedia.org/wiki/Source-to-source_compiler) that will translate your modern JS code into an older version of Javscript that more browsers are able to understand.

Babel is often built into the tools that we use every day to built modern web applications (like [create-react-app](https://github.com/facebook/create-react-app) for example) so many developers don't have a full understanding of what the tool actually does. This tutorial is designed to set up a Babel configuration piece by piece and is part of a larger tutorial series in setting up your own custom development environment.

## Prerequisites

You will need to have [Node.js](https://nodejs.org/en/download/) installed on your machine and available from your terminal. Installing Node will automatically install [npm](<https://en.wikipedia.org/wiki/Npm_(software)>) as well, which is what you will use to install Babel.

Open up your terminal of choice.  If you see version numbers when running the two commands below (your numbers will likely be different than this example) then you are ready to go:

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

Next let's create a very basic Javascript file using some modern syntax. Create a file called `script.js` with the following code:

`script.js`

```js
const x = 5;
let y;

const sampleFunction = () => "this is a return value";

class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
}

const hasThree = [1, 2, 3].includes(3);
console.log(hasThree);

y ||= "a new value";
console.log(y);
```

In the above example `const`, `let`, the `arrow function`, `includes` array method and `class` are all features of [ES6](https://www.w3schools.com/js/js_es6.asp) that won't run properly in older browsers such as `Internet Explorer 11` (which unfortunately some organizations still use extensively even in 2021).

You may also catch the brand new (as of 2021) [logical OR assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_OR_assignment). This will not run in versions of Firefox before 79 and versions of Chrome before 85, and it won't run in IE11 at all.

So what can we do to run this code on older browsers without having to rewrite it ourselves?

## Installing Babel

There are three basic packages we need to accomplish our goal, all of them are part of the Babel ecosystem, but each has a different function. Start by running the following command:

```bash
npm install @babel/core @babel/cli @babel/preset-env --save-dev
```

Let's take a look at what each one is doing:

- `@babel/core` - This is the main engine that knows how to transform code based on a set of instructions it is given
- `@babel/cli` - This is the actual program we are going to run to trigger the core engine and output a transformed Javascript file
- `@babel/preset-env` - This is a preset that tells the core engine what kind of transformations to make. It looks at your environment (in our case it will be our `package.json` file) to determine what kind of changes need to be made depending on the browsers you wish to support.

We need to add a couple values to our `package.json` file:

- `browserslist` - This tells Babel which browsers we are aiming to target. The older / less supported they are, the more work and more transformations Babel will have to make in order for your application to work in these browsers. The syntax is a simple array of strings. You can [learn about here](https://github.com/browserslist/browserslist).
- `babel` - This is where we defined all the presets that we will use, as well as any configuration options related to those presets. We will start with the simplest one, `@babel/preset-env`

So our `package.json` file should look like this:

`package.json`

```json
{
  "devDependencies": {
    "@babel/cli": "^7.15.7",
    "@babel/core": "^7.15.5",
    "@babel/preset-env": "^7.15.6"
  },
  "browserslist": ["last 2 Chrome versions"],
  "babel": {
    "presets": [["@babel/preset-env"]]
  }
}
```

The `devDependencies` should already be there from your `npm install`. The other two properties described above you will need to add yourself.

## Transforming Your Code

At its most basic configuration `babel` will transform your modern syntax into the much wider supported [ES5](https://www.w3schools.com/js/js_es5.asp).

Let's begin with a simple example. Run the following command in your project root directory containing your `package.json` file and your `script.js` file:

```bash
npx babel script.js --out-file script-transformed.js
```

Presuming you have followed all the instructions so far you should see a new file created called `script-transformed.js` that looks like this:

`script-transformed.js`

```js
"use strict";

const x = 5;
let y;

const sampleFunction = () => "this is a return value";

class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
}

const hasThree = [1, 2, 3].includes(3);
console.log(hasThree);
y ||= "a new value";
console.log(y);
```

Not much different right? Aside from adding [strict mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode) nothing has actually changed.

The reason for this is because of how we have configured our environment in `package.json`, which is where `@babel/preset-env` looks in order to decide what it should do.

`package.json`

```json
...
"browserslist": [
  "last 2 Chrome versions"
],
...
```

Since we are only targeting the most recent 2 versions of Chrome, Babel knows that we have no problem including all the modern JS syntax that we want, it will work fine in those modern browsers.

But let's say that we are required to support `Internet Explorer 11`. We don't want to have to change the way we write our code just to accommodate that browser, but fortunately that's where Babel saves the day. Update your `package.json` to add IE11 to your `browserslist` array:

```json
...
"browserslist": [
  "last 2 Chrome versions",
  "IE 11"
],
...
```

Now run this command again:

```bash
npx babel script.js --out-file script-transformed.js
```

Take a look at the output this time:

`script-transformed.js`

```js
"use strict";

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var x = 5;
var y;

var sampleFunction = function sampleFunction() {
  return "this is a return value";
};

var Person = function Person(name, age) {
  _classCallCheck(this, Person);

  this.name = name;
  this.age = age;
};

var hasThree = [1, 2, 3].includes(3);
console.log(hasThree);
y || (y = "a new value");
console.log(y);
```

This looks a lot different from our original file! Notice that almost all the `ES6` terms we discussed above are gone, `const` is replaced with `var`, our arrow function is replaced with `function` syntax, and our `class` has been transformed into a basic Javascript [object](https://javascript.info/object). We can now take this `script-transformed.js` file, serve it up to `Internet Explorer 11` and it would run just fine... almost!

We still have one small problem: The `includes` method was not transformed. Why is that? To understand the reason, we first need to understand `polyfills`.

## Polyfills

To understand why we need `polyfills` we have to understand the difference between what is new `syntax` and what is new `functionality`. The `includes` method is new `functionality`. It has its own logic behind it, and simply changing the syntax of how the code is written won't explain to older browsers how the logic of the `includes` method is supposed to function.

For new features that introduce new functionality we need something called a [polyfill](https://developer.mozilla.org/en-US/docs/Glossary/Polyfill). Polyfills are simply just the source code for a method like `includes` that you bundle along with your application to essentially teach older browsers how it works.

You do not need to write polyfills yourself, polyfills for just about every feature of JS already exist and are easy to include. In future tutorials we will get into bundling and only including the specific ones that we need, but until then we can simply include a library called [core-js](https://www.npmjs.com/package/core-js) and instantly give our app access to all modern JS features even on older browsers.

To test it out let's load the entirety of the `core-js` library into our app. Since we are still not yet using a bundler, we will simply load the already bundled and `minified` version from the web into our app. If you don't already have an `index.html` template, create this file in your project root directory:

`index.html`

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <script src="script-transformed.js"></script>
  </head>
  <body></body>
</html>
```

_(If you aren't sure how to serve this file run and view the output [check out this tutorial](https://dev.to/alexeagleson/understanding-the-modern-web-stack-running-a-local-web-server-4d8g) first)_

We'll begin by trying to load the file in IE11. If your machine doesn't have Internet Explorer 11, you can simply follow with the example here. This example is running on `Windows 11` which has removed IE11 entirely.  Fortunately `Microsoft Edge` comes with an [IE 11 Mode](https://docs.microsoft.com/en-us/deployedge/edge-ie-mode) for testing applications that require backward compatibility.

When we run Babel and try to load our `script-transformed.js` file in IE11 we get the following error on the console:

![Array Includes Error](https://i.imgur.com/fLPE61M.jpg)

Now let's add the `core-js` library to a `<script>` tag inside the `<head>` in our `index.html`.  You can find the most updated minified bundle URL [here](https://cdnjs.com/libraries/core-js).  

`index.html`

```html
...
<head>
  <meta charset="UTF-8" />
  <script src="https://cdnjs.cloudflare.com/ajax/libs/core-js/3.18.1/minified.js"></script>
  <script src="script-transformed.js" defer></script>
</head>
...
```

When we reload the page in IE11 we get:

![Array Includes Example](https://i.imgur.com/ykSDLvL.jpg)

It works! We're writing modern Javascript and running it in an old dinosaur browser! That's great!

## Wrapping Up

You should now have a solid grasp of the fundamentals of what Babel is, and how it works.  Of course there's a lot more to discover.  In future tutorials we'll go deeper into two more of the major presets that are supported by Babel for transpiling supersets of Javascript: [JSX](https://reactjs.org/docs/introducing-jsx.html) and [Typescript](https://www.typescriptlang.org/).  

When we start working with `webpack` we will also look at how to configure Babel so that it only imports those functions from the sizable `core-js` library that you are actually using in your application (like `Array.includes()`) so that you don't need to include the entirety of the library itself.

Please check out the other entries in this series!  Feel free to leave a comment or question and share with others if you find any of them helpful:

- [Running a Local Web Server](https://dev.to/alexeagleson/understanding-the-modern-web-stack-running-a-local-web-server-4d8g)

- [Babel](https://dev.to/alexeagleson/building-a-modern-web-stack-babel-3hfp)

- [React & JSX](https://dev.to/alexeagleson/understanding-the-modern-web-stack-react-with-and-without-jsx-31c7)

- Webpack

    - [The Basics](https://dev.to/alexeagleson/understanding-the-modern-web-stack-webpack-part-1-2mn1)

    - [Loaders, Optimizations & Bundle Analysis](https://dev.to/alexeagleson/understanding-the-modern-web-stack-webpack-part-2-49bj)

    - [DevServer, React & Typescript](https://dev.to/alexeagleson/understanding-the-modern-web-stack-webpack-devserver-react-typescript-4b9b)

<a href="https://twitter.com/eagleson_alex?ref_src=twsrc%5Etfw" class="twitter-follow-button" data-show-count="false">@eagleson_alex</a><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> on Twitter

Thanks for reading, and stay tuned!
