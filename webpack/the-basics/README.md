# Understanding the Modern Web Stack: Webpack - The Basics

_(This tutorial is written using [webpack v5](https://webpack.js.org/blog/2020-10-10-webpack-5-release/) however the general concepts will apply to any version)_

## Table of Contents

1. [What is Webpack?](#what-is-webpack)
1. [Prerequisites](#prerequisites)
1. [Initializing the Project](#initializing-the-project)
1. [Why Bundling?](#why-bundling)
1. [Installing Webpack](#installing-webpack)
1. [Webpack Plugins](#webpack-plugins)
1. [Modules in Javascript](#modules-in-javascript)
1. [Modules in webpack](#modules-in-webpack)
1. [Minimizing Bundle Size](#minimizing-bundle-size)
1. [Wrapping Up](#wrapping-up)

## What is webpack?

In webpack's [own words](https://webpack.js.org/concepts/):

> At its core, webpack is a static module bundler for modern JavaScript applications. When webpack processes your application, it internally builds a dependency graph from one or more entry points and then combines every module your project needs into one or more bundles, which are static assets to serve your content from.

If you find it difficult to understand exactly what that means, don't worry at all, that's why we're here!  

Many of us, including myself, first seek out webpack tutorials when we reach a point with our projects when we know we need it -- but we may not know exactly _what_ we need it to do, or the specific terms to describe the problems we are trying to solve.

webpack (stylized with a lowercase _w_) is extremely configurable and customizable by design, which means that at the cost of a slightly higher learning curve than an out-of-the-box solution, you get incredible power to do whatever it is you need to do.  

If webpack core doesn't do it, you can get a plugin.  If you can't find a plugin for it, you can write your own plugin.  You're probably getting the idea at this point.

The idea behind this tutorial is that we will keep things as simple as possible.  Start with a super basic web app / page, and gradually add pieces as you would on a real project until you encounter a scenario where you realize webpack would help.

At that point we install, configure, and add it to our project.

So we're ready to dive in -- but before we do there are a few prerequisites we should address first.

## Prerequisites

You will need to have [Node.js](https://nodejs.org/en/download/) installed on your machine and available from your terminal. Installing Node will automatically install [npm](<https://en.wikipedia.org/wiki/Npm_(software)>) as well, which is what you will use to install Babel.

Open up your terminal of choice.  If you see version numbers when running the two commands below (your numbers will likely be different than this example) then you are ready to go:

```bash
node --version
> v15.5.0

npm --version
> 7.16.0
```

You will want to have at least a basic understanding of [Javascript](https://developer.mozilla.org/en-US/docs/Web/JavaScript).  We don't deal with any complicated code in this tutorial, but we'll assume you can comfortable read simple programs.  webpack's configuration file is written in JS format.  

We will assume you have the ability to run a local server and test the HTML/JS code we are using.  If not, then check out this tutorial first:

- [Understanding the Modern Web Stack: Running a Local Web Server](https://dev.to/alexeagleson/understanding-the-modern-web-stack-running-a-local-web-server-4d8g)

## Initializing the Project

Let's start by initializing a new `npm` project. Run the following command to generate one:

```bash
npm init -y
```

The `-y` flag will automatically select default values for everything, which is appropriate in our example.

We'll start by creating an HTML entry point where we can load and test our bundle.  Any basic HTML template will work.  Create a file called `index.html` in your root directory.  If you are using VS Code you can generate an instant template by opening the file and typing `!` (then click `!` menu).

Otherwise we can use the template below:

`index.html`
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body></body>
</html>
```

Next we will create a directory called `src`.  in the root directory of your project.  Inside that directory we will have a file called `script.js` with the following code:

`src/script.js`

```js
function component() {
  const element = document.createElement('div');

  // Lodash, currently included via a script, is required for this line to work
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');

  return element;
}

document.body.appendChild(component());
```

_(You will notice that at this beginning stage we are essentially following along with webpack's own fantastic [Getting Started](https://webpack.js.org/guides/getting-started/#basic-setup) guide.  webpack's documentation is known for being extremely high quality thanks to its amazing [contributors](https://webpack.js.org/contribute/).)_


You may notice that we are using a [Lodash](https://lodash.com/) function inside our `script.js` file.  That's the little `_` underscore variable with the `join()` method.  Might be a bit of a simplistic example, but you can replace it with any scenario you can imagine where you might want to use the benefit of an external library function rather than coding it yourself.

Since we are using Lodash in our file, we'll need to add it to our project.  From the root directory run the following terminal command:

```bash
npm install lodash
```
Now your directory structure should look like this:

```
root
│   index.html
|   package.json
└───node_modules
└───src
│   │   script.js
```

Next we need to load both our `script.js` file and the Lodash library into out `index.html` to see everything work together.  Update your `index.html` file like so:

`index.html`
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Webpack Example</title>
    <script src="node_modules/lodash/lodash.min.js"></script>
    <script src="src/script.js" defer></script>
  </head>
  <body></body>
</html>
```

Make sure to notice a couple about our script tags.  `script.js` must be prefixed with `src/` as it is in that directory, and since our JS is working with the DOM, we want to use the `defer` attribute so that it doesn't load until after the HTML is finished parsing.  

At this point you can serve up your root directory and you should be able to see the following result:

![Page Example](https://i.imgur.com/lWszBPB.png)

If you are not sure how to host a local server check out this post to help get you up and running:

- [Understanding the Modern Web Stack: Running a Local Web Server](https://dev.to/alexeagleson/understanding-the-modern-web-stack-running-a-local-web-server-4d8g)

## Why Bundling?

So if everything is working, what do we need webpack for?  Well consider if you were now planning to release this as a product.  You want to be able to say _Hello webpack_ to the entire world!  You're hoping to get a minimum of 1 million unique visitors per day.

You take your project directory and you upload it to your web server.  You need to make sure you also include the `node_modules` folder because that's where the Lodash library is.  Every time our page loads, it loads the `lodash.min.js` file.  Every one of our million users per day (disregarding [cache](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching) and [gzip](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding) options for the moment) will be downloading this file.  

Lodash is a huge library that comes with [tons of great functions](https://lodash.com/docs/4.17.15) for all kinds of different use cases.  Even after being minified, our `lodash.min.js` file is still a sizable 73KB.  That's 73KB of data for every user just to gain access to the `join()` function.  

Wouldn't it be great if we could just extract that `join()` function and leave behind all the excess parts of the library we aren't using?

That's where webpack comes in.

## Installing Webpack

```bash
npm install webpack webpack-cli --save-dev
```

Let's take a look at what each one is doing:

- `webpack` - This is the main engine of webpack, it understands everything related about how the code and files relate to one another, and how to bundle them into a single package.

- `webpack-cli` - This is the actual program we are going to run to trigger the core engine. It allows us to run webpack on our command line and generate a bundle.

Our first goal will be to simply configure webpack to process our `script.js` file and output it without doing any transformations.  We'll add those in soon after.

Create a new file in the root directory called `webpack.config.js` with the following code:

`webpack.config.js`
```js
const path = require("path");

module.exports = {
  mode: "none",
  entry: "./src/script.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
};
```

Before we fun this, let's look at what we expect it will do:

- `mode` - This determines what kind of extra processing is done to your output file.
    - `none` - No extra processing at all.  We are using this for the tutorial because it makes the output file cleaner for a human to read and understand.
    - `development` - Extra work done to add features that make debugging and tracing issues easier.  Will be slower and result in larger file sizes.  Designed only to be used during development.
    - `production` - Removes all unnecessary code and only produces the smallest and leanest file possible.  Designed for your release build.

- `entry` - The starting point of our app, it's pointing to our `script.js` file with our Javascript code

- `output` - This is the name and location of the file it fill generate after all the bundling is done.  This is the file our `index.html` file will load.  Includes both the name of the file and path.  We are going to output everything into a directory called `dist`

Let's run `webpack` now and see if our assumptions are true.  ON your terminal run:

```bash
npx webpack
```

We don't need any arguments with that command because it gets all the config information it needs automatically from your `webpack.config.js` file.  At this point you should see a file generated called `main.js` in your `dist` folder that looks nearly identical to your script file.  

The idea is that your entire project gets bundled into the `dist` directory and that is what you upload to your server as your release build.  OUr issue right now however is that neither your `index.html` nor your `node_modules` folder existed in your `dist` folder.  If you tried to release your project now there would be nothing to load.

We will start by configuring webpack to bundle your `index.html` in your output.  We could technically just copy it in there ourselves, but of course webpack has its own way of handling that.  This is where we introduce our first plugin.

## Webpack Plugins

Plugins are code that give webpack additional information about how to perform certain tasks.  The most common one you will use is called [HtmlWebpackPlugin](https://webpack.js.org/plugins/html-webpack-plugin/).  Its purpose is exactly as we described above, to let you include an HTML file in your output bundle.  

Before we can use it, we have to add it to our project.  Run the following command:

```bash
npm install html-webpack-plugin --save-dev
```

Once that is installed we update our webpack config file:

`webpack.config.js`
```js
const HtmlWebpackPlugin = require("html-webpack-plugin"); // <-- NEW
const path = require("path");

module.exports = {
  mode: "none",
  entry: "./src/script.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./src/index.html",
    }),
  ],
};
```

Two new lines have been added indicated with the _"NEW"_ comments.  We need to first `require` the plugin, and then add it to our config.  

We are also going to move our `index.html` file into our `src` directory.  The `src` directory will be the location of all our source code related to the web application itself.  Config files can continue to live in the project root directory.  When we move the index file we are going to update and remove a couple of the script tags.  

Our new file looks like:
`src/index.html`
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Webpack Example</title>
  </head>
  <body></body>
</html>
```

The only different here is that we have removed the two `<script>` tags with our `script.js` and the Lodash library.  We'll see why in a moment.  Before we run let's confirm the shape of our project directory:

```
root
|   package.json
|   webpack.config.js
└───node_modules
└───src
│   │   script.js
|   |   index.html
└───dist
|   |   main.js
```

Now let's run our `npx webpack` command again and take a look at the output.

Inside your `dist` directory thanks to our new plugin you should see an `index.html` file.  It will look the same as your template with one exception.  

```html
...
<script defer src="main.js"></script>
...
```

HtmlWebpackPlugin has automatically added that script tag for you based on the output filename in your `webpack.config.js` file.  Pretty cool!  

Now you can update your HTML template in your `src` directory any time you like, and a copy will be generated on webpack run that automatically points to your bundle.

Next, if you remember, we removed the reference to the Lodash library, so we're still not ready to run the app.  Before we're ready to do that there's an extremely important concept we need to understand called _modules_.  

## Modules in Javascript

[Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) are not a unique feature of webpack, they are a core part of the modern Javascript ecosystem.  The quick and easy explanation is that they are designed as a way to separate unrelated pieces of code to make it easier to build systems that don't overlap unnecessarily.  

A good example is Lodash,  It is comprised of smaller modules that separate the methods it provides between the ones that work on objects vs arrays vs strings.  Keeping them separate makes it easier for developers to work with them and reason about them.

Modules have a long and complicated history because they never existed in the original design of the language, so there have always been challenges in both syntax standardization and browser support.  

Fortunately webpack supports virtually all module styles, so you can write your code the way you want and run it in any browser.  For the sake of our tutorial we are going to use the modern native module syntax of `import` and `export`.

## Modules in Webpack

Modules in the webpack ecosystem act as a means for your code to communicate to webpack a list of exactly which pieces are needed.  

With this information, webpack can build a [dependency graph](https://webpack.js.org/concepts/dependency-graph/) of all the relationships in your project.

The real power of this graph becomes apparent when you realize that once webpack knows exactly what your program is using, it can leave behind everything that it isn't.  

That's not just full Javascript files either. It can extract individual values and functions from JS files, and even individual files themselves -- for example only pulling images and fonts that your project uses from a large directory of fonts.

This gives you (the developer) the luxury of having instant access to any image or font you want while working, and then when you build your project for release you only include the ones you actually use.  

Ultimately this describes the true value or webpack, and why it's one of the most popular common tools in real world applications today.

## Minimizing Bundle Size

So with that said, let's take a look at how we can apply this knowledge to extract only the piece of the Lodash library that we are actually using.  We will begin by adding an `import` statement to our `script.js` file:

`src/script.js`
```js
import _ from 'lodash'; // <-- NEW

function component() {
    const element = document.createElement('div');
  
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  
    return element;
  }
  
  document.body.appendChild(component());
```

The new line `import _ from 'lodash'` is telling JS to load the entirety of the lodash library and make all the code available on the `_` variable.  If you try and run this code in classic browsers (or even modern ones without the proper config) you will see an error, but webpack understands it perfectly. 

Let's run `npx webpack` again and check the output.  

You can see that `dist.main.js` has now ballooned from roughly ~15 lines of code to almost 20,000!  That's because webpack has done exactly what we asked it to do: load the entirely of Lodash into our project.  

When you run the `npx webpack` command you will also get some great bundle information on the terminal.  Let's take a quick look at that:

![Lodash Bundle Large](https://i.imgur.com/PM3Q6Y7.png)

Our `main.js` is a whopping 536KB in size.  The info also tells us that 531KB of that comes from `lodash.js`.  

This would be a good time to test out the difference `production` mode.  

Edit your `webpack.config.js` file to change `mode` to `production` from `none` and then run `npx webpack` again.  You will probably find you have to wait a bit longer, as your machine is working hard to minimize the size of these files.  

Here's what the bundle information looks like now:

![Lodash Bundle Medium](https://i.imgur.com/6R60OaS.png)

We've made a huge drop from 536KB to 69.5KB in our `main.js` file!  

If you're wondering where all that space went take a look at `dist/main.js`.  Since this is considered a `production` release the most important thing is fast speeds and small file sizes, it's no longer important that the developer be able to read the file.  So webpack shrinks it down into the smallest size it can while still having the same function.  

This process is called [minification](https://developer.mozilla.org/en-US/docs/Glossary/minification).

But even though the library is minified, we're still including the entire library while only using the single `join()` function.  The final step is simply to change what we are asking to do.  

If you recall the line:

```js
import _ from 'lodash';
```

We are specifically asking JS to load _everything_ from Lodash and place it into our file, but that's not actually what we want.  We only want the join function.  

The syntax for exactly how to do so will depend on the way the library itself has set up ts modules (if at all).  It's good practice to check the library's documentation before you decide how you will do your imports.

Lodash makes each individual function available in its own JS file (you can see this easily by simply navigating to `node_modules/lodash`).  

Rather than importing from the `lodash.min.js` file that contains _everything_, let's just import from the `join.js` file that contains the function we want.


So we change the syntax of our import to:

`src/script.js`
```js
// NEW
import join from 'lodash/join';

function component() {
    const element = document.createElement('div');
    
    // NEW
    element.innerHTML = join(['Hello', 'webpack'], ' ');
  
    return element;
  }
  
  document.body.appendChild(component());
```

Since we are now importing the `join` function directly and not creating the underscore variable, we need to change the `_.join()` syntax to just `join()`.  

Before we run our bundler again let's change the `mode` in `webpack.config.js` back to `none` so that we can see exactly what the output looks like in a human-readable format.

Run `npx webpack` again and look at the bundle info:

![Lodash Bundle Small](https://i.imgur.com/l69G2uN.png)

We are now down from 69.5KB to only 4KB!  And we switched out of `production` mode so that's not even minified!  We could still shrink it even further if we wanted.  

Let's take a look at our `dist/main.js` output file to see what happened.

We're down to around 100 lines (including some webpack administrative code for modules).  It should be possible for you to see with your own eyes how your code from `script.js` has been blended into a single file along with Lodash's `join()` function.

And that's webpack!  You can write your code in as many files as you like, with `import` and `export` to manage how they depend and relate to each other, and still package it all together into an efficient single JS file that any browser can load, regardless of its support for modules.

## Wrapping Up

You now understand the fundamentals of webpack.  Of course there's a lot more to it, and we'll continue to explore those features ahead, but this is a great place to stop and take a breather and absorb what you've learned so far.  

Everything onward from here just builds on these same concepts you've just learned.  When you're ready, check out some of the more advanced tutorials introducing loaders, optimization, DevServer, React & Typescript.

Please check out the other entries in this series!  Feel free to leave a comment or question and share with others if you find any of them helpful:

- [Understanding the Modern Web Stack: Running a Local Web Server](https://dev.to/alexeagleson/understanding-the-modern-web-stack-running-a-local-web-server-4d8g)
- [Understanding the Modern Web Stack: Babel](https://dev.to/alexeagleson/building-a-modern-web-stack-babel-3hfp)
- [Understanding the Modern Web Stack: Webpack - The Basics](https://dev.to/alexeagleson/understanding-the-modern-web-stack-webpack-part-1-2mn1)
- [Understanding the Modern Web Stack: Webpack - Loaders, Optimizations & Bundle Analysis](https://dev.to/alexeagleson/understanding-the-modern-web-stack-webpack-part-2-49bj)
- [Understanding the Modern Web Stack: Webpack - DevServer, React & Typescript](https://dev.to/alexeagleson/understanding-the-modern-web-stack-webpack-devserver-react-typescript-4b9b)

<a href="https://twitter.com/eagleson_alex?ref_src=twsrc%5Etfw" class="twitter-follow-button" data-show-count="false">@eagleson_alex</a><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> on Twitter

Thanks for reading, and stay tuned!
