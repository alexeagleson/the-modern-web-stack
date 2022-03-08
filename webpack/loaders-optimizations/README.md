# Understanding the Modern Web Stack: Webpack - Loaders, Optimizations & Bundle Analysis

_(This tutorial is written using [webpack v5](https://webpack.js.org/blog/2020-10-10-webpack-5-release/) however the general concepts will apply to any version)_

## Table of Contents

1. [Recap](#recap)
2. [Initializing the Project](#initializing-the-project)
3. [Loaders](#loaders)
4. [Optimization](#optimization)
5. [Bundle Analysis](#bundle-analysis)
6. [Wrapping Up](#wrapping-up)

## Recap

This tutorial presumes you are already familiar with the basics of webpack outlined in this tutorial:

[Understanding the Modern Web Stack: Webpack - The Basics](https://dev.to/alexeagleson/understanding-the-modern-web-stack-webpack-part-1-2mn1)

The Basics introduced the concept of module bundles and the [reasons we use them](https://webpack.js.org/concepts/why-webpack/) in modern development.  

We demonstrated how we can importing individual files and functions from larger libraries without the need to carry along code we aren't using.

This tutorial introduces the concept of _file loaders_ and looks at different ways to optimize our bundle, both in terms of size as well as efficient loading.  

For example even if it is necessary to generate a large bundle, we have tools to avoid serving this bundle to users unless they specifically require it.

So before we dive in, let's get our working environment set up.

## Initializing the Project

Create the following directory structure:

```
root
|   webpack.config.js
└───src
│   │   script.js
|   |   index.html
```

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

`src/script.js`

```js
import join from "lodash/join";

function component() {
  const element = document.createElement("div");

  element.innerHTML = join(["Hello", "webpack"], " ");

  return element;
}

document.body.appendChild(component());
```

`webpack.config.js`

```js
const HtmlWebpackPlugin = require("html-webpack-plugin");
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

Now install your dependencies, and run the webpack command to generate your `dist` folder.

```bash
npm init -y
npm install lodash
npm install webpack webpack-cli html-webpack-plugin --save-dev
npx webpack
```

If you can successfully serve your `dist` folder and see the _Hello webpack_ message then you're totally caught up with Part 1 and ready to continue the tutorial.

## Loaders

Out of the box webpack only understands how to import Javascript and JSON files, but thanks to loaders we can teach webpack how to import pretty much any kind of file: CSS, image, font, SVG, MP3, you name it.

If you're every worked with a [create-react-app](https://reactjs.org/docs/create-a-new-react-app.html) codebase and been amazed that you can simply write `import styles.css` in your JS file, that's webpack under the hood.

In this tutorial we're going to look at two of the most common types of loaders:

- CSS
- Assets (images & fonts)

### CSS Loaders

Create a `styles.css` file in your `src` directory:

`src/styles.css`

```css
body {
  background-color: red;
}
```

Then add this like to the top of your `script.js` file:

`src/script.js`

```js
import "./styles.css";
...
```

_(The `./` prefix means "current directory")_

If you try to run `npx webpack` now you'll get this error:

> Can't resolve 'styles.css' in ....

That's because we haven't told webpack how to load that kind of import, and importing CSS files certainly isn't native to the Javascript ecosystem. We need a `loader` that can explain to webpack exactly how that type of file should be handled.

Run the following command on your terminal:

```bash
npm install style-loader css-loader --save-dev
```

Let's take a look at what each one is doing:

- `css-loader` - Handles resolving the `import .css` syntax in JS

- `style-loader` - Handles injecting those loaded CSS styles into the DOM

Now that we've installed those we need to update out webpack config:

`webpack.config.js`

```js
const HtmlWebpackPlugin = require("html-webpack-plugin");
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
  // NEW BLOCK
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  // END: NEW BLOCK
};
```

The `module` block has been added here to our config.

The `test` value is a [regular expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) to match any imported filenames that end with `.css`

The `use` value tells webpack which loaders to use when it encounters an import with that file extension.

Let's try running `npx webpack` again and see what happens.

Now this may blow your mind because if you look in your `dist` folder you won't see any `.css` files. That's because webpack (specifically [style-loader](https://webpack.js.org/loaders/style-loader/)) has taken it a step further and injected those styles directly into your `main.js` file.

Open it up and take a look! You'll see a whole bunch of new code, for example I see a function called `cssWIthMappingToString`. I see a this line:

```js
item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
```

Now I don't pretend to understand the finer details of what's happening here, certainly this code has been written by someone much smarter than myself, but you can easily see the intent. We're loading CSS files as a string and processing those values into Javascript code. Extremely cool!

So despite not having any `.css` files in your release bundle, when we serve out `index.html` from the `dist` folder we will see the styles from our CSS files applied:

![CSS Loader Success](https://i.imgur.com/6GFY8Tz.png)

### Asset Loaders

With asset loaders you can import pretty much any. For this tutorial we're going to focus on one of the most common. Imagine you have the common scenario of an `assets` directory where all the different file dependencies your project requires might live.

Let's create that `assets` directory now inside the `src` directory.

Inside that `assets` directory we'll add two images. A couple of nice photos of mushrooms from _Unsplash_:

[ck-yeo-ZyEnQoFp8RQ-unsplash.jpg](https://unsplash.com/photos/ZyEnQoFp8RQ)

[saxon-white-x4TCvIEGuHs-unsplash.jpg](https://unsplash.com/photos/x4TCvIEGuHs)

We'll keep the filenames as-is to keep credit to the photographers who took them.

So normally without webpack we would add something along these lines to our main HTML file (don't make this change, we are just showing an example):

```html
<img alt="Cute Mushroom" src="src/assets/ck-yeo-ZyEnQoFp8RQ-unsplash.jpg" />
```

You should be able to see one of the difficulties however -- if we were to do this with our webpack bundler, the file path would not be correct for the generated `index.html` in our `dist` directory, and the image would not appear.

You should also have some thoughts about the solution, keeping in mind that with webpack we are moving everything (even images) into the Javascript ecosystem. We need another loader!

_(If this seems like more of a pain in the ass to do something you already know how to do with a simple `src` attribute, don't worry, we'll get to the big benefit before long)_

The nice thing about `assets` is that since [webpack v5](https://webpack.js.org/guides/asset-modules/) asset loaders are built into webpack core and don't require a separate loader to be installed.

All we need to do is add the following new rule to our config file:

`webpack.config.js`

```js
...
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      // NEW BLOCK
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      // END: NEW BLOCK
    ],
  }
...
```

We've truncated some of the config file here as it's getting a bit long. The new code is the additional rule added where indicated with the _"NEW"_ comment.

Next let's update our `script.js` file:

`src/script.js`

```js
import "./styles.css";
import mushroom from "./assets/ck-yeo-ZyEnQoFp8RQ-unsplash.jpg"; // <-- NEW
import join from "lodash/join";

function component() {
  const element = document.createElement("div");

  element.innerHTML = join(["Hello", "webpack"], " ");

  return element;
}

// NEW BLOCK
function imageComponent() {
  const element = document.createElement("img");

  element.src = mushroom;

  return element;
}
// END: NEW BLOCK

document.body.appendChild(component());
document.body.appendChild(imageComponent()); // <-- NEW
```

When you use the asset loader in webpack, you will import a `string` value into your JS variable. That string holds the `src` value that you can use to refer to the paths to those images.

The powerful thing about them is that path is dynamic, it doesn't refer to the current path of the file in your `assets` directory, but rather whatever path webpack will give it in your `dist` folder after the bundling process is complete.

Lastly, before we test, just to make sure the image isn't crazy big, let's add one thing to our styles file:

`src/styles.css`

```css
body {
  background-color: red;
}

/* NEW */
img {
  width: 200px;
  height: auto;
}
```

Now run `npx webpack` and take a look at the result.

The really cool thing you will see when you look in the `dist` directory is that despite having two images available to us in our assets, only only image has been created in the `dist` directory.

Not surprisingly it's the image we actually used, the one we imported. That's the power of the [dependency graph](https://webpack.js.org/concepts/dependency-graph/).

![Bundle With Image](https://i.imgur.com/YdNuQKs.png)

## Optimization

In this section we will look at three common forms of bundle optimization, and how you can configure your project to take advantage of them.

### Code Splitting

Imagine your site has multiple pages, and you want to be able to load different Javascript code in different locations. Everything we've seen so far shows webpack bundling everything into a single `.js` file.

But what do we do if we would like to be able to bundle our codebase down into multiple JS files that can be loaded separately? That's where the concept of [code splitting](https://developer.mozilla.org/en-US/docs/Glossary/Code_splitting) comes in.

Let's create a new page on our site. We want to be able to load it completely on its own, without loading the JS or the CSS code we've already written.

`src/page2.js`

```js
import join from "lodash/join";

console.log("loading page2.js");

const element = document.createElement("h1");

element.innerHTML = join(["Welcome to", "page 2!"], " ");

document.body.append(element);
```

Notice that we are also importing the Lodash `join` in this file. The reason we are doing this is to demonstrate how we can create shared modules. Rather than bundling the `join` function in both our pages, we'll output it once and have both pages share it.

Next we update our webpack config:

`webpack.config.js`

```js
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  mode: "none",
  // NEW BLOCK
  entry: {
    script: { import: "./src/script.js", dependOn: "shared" },
    page2: { import: "./src/page2.js", dependOn: "shared" },
    shared: "lodash/join",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./src/index.html",
      chunks: ["script", "shared"],
    }),
    new HtmlWebpackPlugin({
      filename: "page2/index.html",
      template: "./src/index.html",
      chunks: ["page2", "shared"],
    }),
  ],
  // END: NEW BLOCK
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
};
```

Let's take a look at all the changes that have been made:

- `entry` - Is now an object that names multiple output bundles instead of one. We are going to need both of our pages, and we also need to define a bundle called `shared` which will contain Lodash's `join` function. Both pages will `dependOn` it.

- `output` - What has changed here is `main.js` has become `[name].js`. The brackets mean it will use dynamic names based on what they are called on the `entry` field.

- `plugins` - We have added a second `HTMLWebpackPlugin`. This one uses the same template to generate a second page in the `page2` directory. We use the `chunks` array to explicitly specify which named chunks each page will use. Those HTML files will get `<script>` tags that import only those chunks.

Now run the `npx webpack` command and take a look at the output:

![Code Splitting Chunks](https://i.imgur.com/Ilvm3no.png)

We get three separate bundles, and each one should be properly loaded in the appropriate HTML file. For example take a look for these tags in `dist/page2/index.html`:

```html
<script defer src="../page2.js"></script>
<script defer src="../shared.js"></script>
```

Notice that they are not loading `script.js` because in our config file we told `HTMLWebpackPlugin` that `page2` does not depending on it.

When you serve your dist folder you will get:

![Bundle With Image](https://i.imgur.com/YdNuQKs.png)

When you navigate your browser to `/page2` you will see:

![Page 2 Example](https://i.imgur.com/OmkLAeV.png)

Next we will look at the concept of _tree shaking_.

### Tree Shaking

[Tree Shaking](https://webpack.js.org/guides/tree-shaking/) is the concept of removing dead code, based on the idea of shaking a plant as a way to remove the dead leaves.

Let's create another module with two functions. We will import one and use it. The other we will ignore. Our goal will be to generate a final bundle that recognizes the second function is unused, and drop it from our code.

Create a new file in `src` called `tree-shake.js`:

`src/tree-shake.js`

```js
export const funcA = () => console.log("funcA");

export const funcB = () => console.log("funcB");
```

Next open up `script.js`, import one of those functions, and invoke it:

`script.js`

```js
import "./styles.css";
import mushroom from "./assets/ck-yeo-ZyEnQoFp8RQ-unsplash.jpg";
import join from "lodash/join";
import { funcA } from './tree-shake';

funcA();
...
```

Once the update is complete, run `npx webpack`.

If you take a look at `dist/script.js` and search (ctrl + f) for `funcA` and `funcB` you will find results for both. Unfortunately `funcB` still exists in our bundle even though we never actually import and use it.

The reason for this is we have not yet enabled _tree shaking_. Open your config file and all the following new property inside `modules.exports`:

`webpack.config.js`

```js
  ...
  optimization: {
    usedExports: true,
    minimize: true,
  },
  ...
```

- `usedExports` - Will tell webpack to look for exported code that is actually _used_ in your files. In our example we use `funcA` but we do not use `funcB`.
- `minimize` - Tells webpack to run [minification](https://developer.mozilla.org/en-US/docs/Glossary/minification) on our code. This is the step that will actually strip out anything marked by `usedExports` as unused.

Minification might also shorten the names of our functions, which is why we include the function names as strings in the example. The name of a function does not affect what code does, but the value it returns does, so the value cannot be changed during minification. We will still be able to search for it.

Now open up `dist/script.js` and search for the functions again. This time you will find `funcA` but not `funcB`. The unused function has been removed from the final bundle!

There are even more extreme methods of tree shaking that go beyond the intended scope of this tutorial, if you would like to take your learning further I would encourage you to look into marking files as free of [side effects](https://webpack.js.org/guides/tree-shaking/#mark-the-file-as-side-effect-free).

Next we will examine the concept of lazy loading.

### Dynamic Imports (Lazy Loading)

[Lazy loading]() is the idea of only loading code or assets as close to the time a user actually needs them and not before. This can be either in direct response to an action (like a button click) or in preparation (for example loading images dynamically as a user scrolls down).

We are going to look at how to handle dynamic code imports with webpack. We will create a new file called `lazy-module.js` and configure so that the file is only imported and processed when the user clicks a button. If the button is not clicked, the file will never be downloaded, and bandwidth can be saved.

`src/lazy-module.js`

```js
console.log("this code has been loaded");

const getBigData = () => "big data";

export default getBigData;
```

We add a `console.log` at the start to make it easy for us to see if the module is being loaded on page load instead of dynamically. If it is, the console statement will log before the button is pressed.

Next we will update our `script.js` file to add a button and a dynamic import near the bottom:

`src/script.js`

```js
...

// NEW BLOCK
function buttonComponent() {
  const element = document.createElement("button");

  element.innerText = "Click me!";

  element.onclick = (e) =>
    import("./lazy-module").then((module) => {
      const getBigData = module.default;
      const data = getBigData();
      console.log(data);
    });

  return element;
}
// END: NEW BLOCK

document.body.appendChild(component());
document.body.appendChild(imageComponent());
document.body.appendChild(buttonComponent()); // <-- NEW
```

For this one we don't even need to update our config. Just run `npx webpack` and check out what happens.

When we serve our `dist` directory and load the main page, a new button will be there. Open up the browser's [development console](https://developer.mozilla.org/en-US/docs/Web/API/console) and you should see that the `console.log` statement from our `lazy-module.js` has not been run.

When you click the button that will trigger the dynamic import, and the _this code has been loaded_ statement appears.

Congratulations! You've just configured lazy loading in webpack.

## Bundle Analysis

Although webpack's core job is to generate code bundles, the infinitely customizable nature of it can make it difficult to determine if you are actually generating bundles in the most efficient way possible.

Before you can decide _how_ your bundles should be optimized, you need to first identify where the problems are. That's where the bevy of different webpack bundle analyzer tools comes into play.

The one we are going to demonstrate is [webpack bundle analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer)

Run he following command on your terminal:

```bash
npm install webpack-bundle-analyzer --save-dev
```

Next, we update our config file to use the plugin:

`webpack.config.js`

```js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer');
...

module.exports = {
  ...
  plugins: [
    ...
    new BundleAnalyzerPlugin()
  ],
  ...
}

```

Now when you run `npx webpack` it will run a server on port `http://localhost:8888` with this incredible interactive information:

![Webpack Bundle Information](https://i.imgur.com/rbMpWOB.png)

You will have a wealth of information about exactly which pieces are most contributing to the total size of your bundle so that you can start optimizing properly.

## Wrapping Up

Now that we've learned about loaders and optimizing our bundle, what's next?  webpack's powerful DevServer for setting up fast reloading for instant feedback, as well as implementing React and Typescript into our webpack project.

Please check out the other entries in this series!  Feel free to leave a comment or question and share with others if you find any of them helpful:

- [Understanding the Modern Web Stack: Running a Local Web Server](https://dev.to/alexeagleson/understanding-the-modern-web-stack-running-a-local-web-server-4d8g)
- [Understanding the Modern Web Stack: Babel](https://dev.to/alexeagleson/building-a-modern-web-stack-babel-3hfp)
- [Understanding the Modern Web Stack: Webpack - The Basics](https://dev.to/alexeagleson/understanding-the-modern-web-stack-webpack-part-1-2mn1)
- [Understanding the Modern Web Stack: Webpack - Loaders, Optimizations & Bundle Analysis](https://dev.to/alexeagleson/understanding-the-modern-web-stack-webpack-part-2-49bj)
- [Understanding the Modern Web Stack: Webpack - DevServer, React & Typescript](https://dev.to/alexeagleson/understanding-the-modern-web-stack-webpack-devserver-react-typescript-4b9b)

<a href="https://twitter.com/eagleson_alex?ref_src=twsrc%5Etfw" class="twitter-follow-button" data-show-count="false">@eagleson_alex</a><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> on Twitter

Thanks for reading, and stay tuned!
