# Understanding the Modern Web Stack: Webpack - DevServer, React & Typescript

_(This tutorial is written using [webpack v5](https://webpack.js.org/blog/2020-10-10-webpack-5-release/) however the general concepts will apply to any version)_

## Table of Contents

1. [Recap](#recap)
2. [Initializing the Project](#initializing-the-project)
3. [Source Maps](#source-maps)
4. [Webpack DevServer](#webpack-devserver)
5. [React and JSX](#react-and-jsx)
6. [Typescript](#typescript)
7. [Wrapping Up](#wrapping-up)

## Recap

This tutorial presumes you are already familiar with the basics of webpack outlined in this tutorial:

[Understanding the Modern Web Stack: Webpack - The Basics](https://dev.to/alexeagleson/understanding-the-modern-web-stack-webpack-part-1-2mn1)

We demonstrated how we can importing individual files and functions from larger libraries without the need to carry along code we aren't using.

This tutorial introduces you to source maps, webpack's DevServer, as well as how to introduce both React and Typescript into a webpack project.

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
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Webpack Example</title>
  </head>
  <body></body>
</html>
```

`src/script.js`

```js
const element = document.createElement("h1");

element.innerHTML = "Welcome";

document.body.appendChild(element);
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
    clean: true,
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
npm install webpack webpack-cli html-webpack-plugin --save dev
npx webpack
```

If you can successfully serve your `dist` folder and see the _Welcome_ message then you're ready to start the tutorial.

## Source Maps

A [source map](https://developer.mozilla.org/en-US/docs/Tools/Debugger/How_to/Use_a_source_map) is a type of file (or annotations within a file) that provides information to other tools about the origin of source code before transformations occurred.

For example if we run webpack on even a single line `.js` file, the bundled version will include a small amount of additional code injected by webpack.  This means that the code you wrote on `line 1` may actually appear on `line 10` or `line 10000` of your bundle.

This makes it hard to locate errors when your browser reports the error on a different line based on the bundle it's running, rather than the original line in your source code.

Source maps solve this problem for us.  Let's demonstrate how.

First we will add an error to our `script.js` file:

`src/script.js`
```js
throw Error("Something happened!");

const element = document.createElement("h1");

element.innerHTML = "Welcome";

document.body.appendChild(element);
```

Run `npx webpack` and take a look at our "error" program.  Serve the `dist` directory and look at the browser's [development console](https://developer.mozilla.org/en-US/docs/Web/API/console).

![Without Source Maps](https://i.imgur.com/IfR2LEy.png)

Notice that webpack is reporting the error on line 3 of `main.js` (your line number could be different).  

This is technically correct since that's where webpack has placed the `throw Error` code on the output `main.js` file.

To configure it to report the correct line numbers add the following line to your webpack config:

`webpack.config.js`

```js
...
module.exports = {
  ...
  devtool: "inline-source-map",
  ...
};
```

Now when we run `npx webpack` and look at the console:

![With Source Maps](https://i.imgur.com/bVwV1Xb.png)

The error is now correctly being reported where it is actually located in our code!

## Webpack DevServer

webpack's [DevServer](https://webpack.js.org/configuration/dev-server/) is an amazing tool to speed up your development time by giving you instant reloading and instant feedback to your changes.  

DevServer will automatically [watch](https://webpack.js.org/configuration/watch/) your files for changes and update your bundle automatically when you save.  While using live server the bundle lives in memory (RAM) rather than the `dist` folder so it is able to update much faster.

Let's configure DevServer and give it a try.  We'll start by creating a JS file we can test.  Remove the `throw Error` line and update `script.js` to match the following:

`src/script.js`
```js
const element = document.createElement("h1");

element.innerHTML = "Welcome";

document.body.appendChild(element);
```

Next we add a `devServer` property to our webpack config:

`webpack.config.js`

```js
...
module.exports = {
  ...
  devServer: {
    static: './dist',
  },
  ...
};
```

Then we install DevServer:

```bash
npm install --save-dev webpack-dev-server
```

Finally we run the command:

```bash
npx webpack serve --open
```

By default webpack will serve your app on port 8080. The `--open` flag will automatically open your browser to the page for you.

![Webpack DevServer Example](https://i.imgur.com/SgO32iy.png)

Try changing the `Welcome` string to anything else in `script.js` and you'll see that the page updates immediately. This creates an extremely smooth development environment for you with instant feedback.

Next we will look at how to introduce React and JSX.

## React and JSX

_(This tutorial uses [React v17](https://reactjs.org/blog/2020/10/20/react-v17.html), though concepts are the same for any version)_

This section of the tutorial assumes you are already familiar with the basics of React and JSX.  If you need a refresher the [React documentation](https://reactjs.org/docs/getting-started.html) is the best place to start.  

Our goal in this section will be to show you how to configure webpack to transform your JSX into regular Javascript code.  webpack relies on a [loader](https://dev.to/alexeagleson/understanding-the-modern-web-stack-webpack-part-2-49bj#loaders) for Babel to accomplish this.  If you're not familiar with how Babel works, this tutorial will cover everything you need to know:

[Understanding the Modern Web Stack: Babel](https://dev.to/alexeagleson/building-a-modern-web-stack-babel-3hfp)

Our first step will be to install React and update our `script.js` file to use create a React component.  Begin by installing React with this command:

```bash
npm install react react-dom --save-dev
```

Next we update our `script.js` file to use JSX.  Since JSX is a special syntax on top of Javascript, and not valid Javascript on its own, it requires a different file extension.  

Delete `script.js` and create `script.jsx` in the same location with this code:

`src/script.jsx`
```jsx
import ReactDOM from 'react-dom';

const Welcome = () => {
  return <h1>Welcome</h1>;
};

const mountingNode = document.querySelector("#root");

ReactDOM.render(<Welcome />, mountingNode);
```
If you are familiar with React you can see this mounts our component onto a root node with an `id="root"`.  Update our `index.html` to include it:

`src/index.html`
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Webpack Example</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```
We also need to install the packages that will run the transformations for us:

```bash
npm install babel-loader @babel/core @babel/preset-env @babel/preset-react --save-dev
```

In the above list you can see all the standard pieces of Babel that we learned about in the Babel tutorial.  

The only new one is `babel-loader` which is the loader for webpack which runs babel as part of the bundling process.

Now let's update our webpack config to use babel loader:

`webpack.config.js`
```js
...
module.exports = {
  entry: "./src/script.jsx",
  ...
  module: {
    rules: [
      {
        test: /\.m?jsx$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              ["@babel/preset-react", { runtime: "automatic" }],
            ],
          },
        },
      },
    ],
  },
  optimization: {
    nodeEnv: 'development',
  },
}
```

There's a few things to unpack here so let's do so one at a time:

- _**entry**_: Has been updated to use the `JSX` extension rather than `JS`.  Don't miss this small change as it is a common source of errors.

- _**rules**_: We have a regular expression to ensure babel loader is run on any JSX files in the project.  If we are using React v17 or later then we need the `{ runtime: "automatic" }` which tells Babel to include the JSX runtime in our bundle so we don't need to `import React` in our JSX code.

- _**optimization**_: This is another key source of errors.  React requires `process.env.NODE_ENV` to be defined (set to either _development_ or _production_) similar to webpack.  We will set it to _development_ for now.  If you see `process is undefined` error it likely means you forgot this value.

Now run either the `npx webpack serve --open` command (or `npx webpack` if you want to output to disk and serve it yourself).  If everything has worked smoothly you'll see your _Welcome_ page again.

Congratulations!  You've now implemented React and JSX support into a webpack configuration.  

Our final section will show how to implement Typescript.

## Typescript

_(This tutorial uses [Typescript v4.4](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-4.html), though concepts are the same for any version)_

This section of the tutorial assumes you are already familiar with the basics of Typescript.  If you need a refresher the [Typescript documentation](https://www.typescriptlang.org/docs/) is the best place to start.  

It can often be tricky and confusing for newcomers to understand how to integrate Typescript into a webpack configuration, particularly if you are also using JSX and React.

It's the reason tools like [Create React App](https://reactjs.org/docs/create-a-new-react-app.html#create-react-app) are so popular, because they handle all that configuration for you.  But that can be problematic when you need to configure something, and that's why this tutorial exists.

Typescript, webpack and babel can sometimes overlap in the features they offer.  In this tutorial we will take a look at each one with the aim of understanding what they are doing, so you will have a better understanding of the best way to manage them yourself.

We'll begin by installing Typescript:

```npm
npm install typescript --save-dev
```

After we have installed Typescript, we need to initialize it within our project.  That will automatically create a `tsconfig.json` file where we can configure Typescript options similar to our webpack config:

```bash
npx tsc --init
```

_(Be careful with this syntax, notice we are using the `npx` package runner like we do with webpack.  `tsc` is the name of the command line program for Typescript)_

Next let's add some Typescript syntax to our `script.jsx` file.  Similar to the transition to JSX, Typescript also requires its own format to indicate a file is using Typescript.

The base extension for Typescript files is `.ts`, however if you are using JSX, the extension is `.tsx`.  Let's update our file extension and add some code:

`script.tsx`
```tsx
import ReactDOM from 'react-dom';

const x: number = 5; // <-- NEW

const Welcome = () => {
  return <h1>Welcome</h1>;
};

const mountingNode = document.querySelector("#root");

ReactDOM.render(<Welcome />, mountingNode);
```

If using an IDE like VS Code you may notice a couple of errors being highlighted.  The first is the ReactDOM does not include types.  The second errors will highlight your JSX syntax.  That's because Typescript is not configured to handle JSX by default, we have to configure it for that.

We'll begin by providing type info for ReactDOM.

Libraries and packages that don't come bundled with their types automatically often have type packages available in [Definitely Typed](https://github.com/DefinitelyTyped/DefinitelyTyped).

So to import those types from that library for ReactDOM we run the following command:

```bash
npm install @types/react-dom --save-dev
```

This will fix out missing types for ReactDOM.  Next let's configure Typescript to handle JSX.

Understanding the all the options in `tsconfig.json` is beyond the scope of this tutorial, but we are spoiled now since they have implemented a system of automatically generated comments within the generated file.  If that isn't enough you can find [full tsconfig documentation here](https://aka.ms/tsconfig.json).

We need to set the `jsx` property in our `tsconfig` file.  The default value is `preserve`.  What this means is that Typescript will completely ignore the JSX.  It will output a `.jsx` file instead of a `.js` file and leave it to you to use another tool to remove the JSX.  

Let's test that out.  Update your `tsconfig` file:

`tsconfig.json`
```json
{
  "compilerOptions": {
    ...
    "jsx": "preserve",
    ...
  }
}
```

Then run `npx tsc`.  You will see in your `src` directory that a `script.jsx` file is generated.  This is your `script.tsx` file with the types checked and remove.  Great!  We're making good progress.

Feel free to experiment with different settings of `jsx`.  For example `react` will remove your JSX for you and output a `.js` file, but it will presume you are importing React.  A value of `react-jsx` will use the new JSX runtime in React v17 so you don't need to import.

It makes little difference (as far as I know) which tool you use to transform JSX.  We will leave it as `preserve` for Babel since we already configured Babel to handle JSX in the previous section.  

If there is a good reason to choose one over the other, feel free to let us know in the comments!

At this point you can remove any `script.js` or `script.jsx` files you generated while testing.  We only need our `script.tsx` source file.  

We have two options for adding a Typescript stage to our webpack process.  

1. We can use `ts-loader` which will perform type checking during the bundling process.  If there are any type errors, the build will cancel and report the error.

2. We can use Babel to simply remove the type info.  This presumes we are using another tool to type check before bundling.  It will not cancel the build process on errors.

We'll look at how you can configure both options and choose the one that is right for you.

### Option 1: ts-loader

This is the option that will do the type checking and type removal.  We need to install the loader:

```bash
npm install ts-loader --save-dev
```
Then we update out webpack config to include the following line:

`webpack.config.js`
```js
...
module.exports = {
  entry: "./src/script.tsx", // <-- NEW
  ...
  module: {
    rules: [
      {
        test: /\.m?jsx$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              ["@babel/preset-react", { runtime: "automatic" }],
            ],
          },
        },
      },
      { test: /\.tsx?$/, use: "ts-loader" }, // <-- NEW
    ],
  },
  ...
};
```

We have two new lines here.  The first is an update to the `entry` point.  We need to target our `script.tsx` file now instead of `.jsx`.

The second is the `ts-loader`.  Loaders happen in a chain and execute in [reverse order](https://webpack.js.org/concepts/loaders/#loader-features).  So we need to put our Typescript loader at the end so that it passes the transformed JSX file down the chain to `babel-loader`.

Run `npx webpack serve --open` and see the result.  If all goes well you're see your welcome page with type checking occurring.

To see the type checking in action, try introducing an error:

`script.tsx`
```tsx
...
const x: number = 'this is a string';
...
```

If running DevServer with watch enabled you will immediately see an error appear in both your browser and your terminal:

```
Type 'string' is not assignable to type 'number'
```
### Option 2: babel/preset-typescript

The second option assumes that we are running our own type checking before the webpack build process.  If that is the case then running it a second time with `ts-loader` is unnecessary overhead.  

Babel has a plugin to simply remove types without checking.  Run the following command to install it:

```bash
npm install @babel/preset-typescript --save-dev
```

Next we update our webpack config.  If you following the previous step then make sure you remove `ts-loader`:

`webpack.config.js`
```js
...
module.exports = {
  entry: "./src/script.tsx",
  ...
  module: {
    rules: [
      {
        test: /\.m?[jt]sx$/, // <-- NEW
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              ["@babel/preset-react", { runtime: "automatic" }],
              "@babel/preset-typescript", // <-- NEW
            ],
          },
        },
      },
      // { test: /\.tsx?$/, use: "ts-loader" },
    ],
  },
  ...
};
```

There are two new lines to note.  The first is an update to our `test` regex.  We want `babel-loader` to now run on files with either JSX or TSX extension.  The `[jt]` is part of regular expression syntax meaning "j or t".

The second is the addition of `@babel/preset-typescript` at the end of the `presets` array.  Babel, like webpack, runs these presets in reverse order.  We want to strip off the types first before we process the JSX.

When we run `npx webpack serve --open` we should once again see our big "Welcome" message on our page.  If we introduce type errors webpack will still compile, so it's relying on us to do type checking as a separate process first.

## Wrapping Up

Hopefully this tutorial has given you a better understanding of the complicated ecosystem of transforming JSX and Typescript code, as well as the benefits of running a local dev server that supports instant reloading.

While these tools are difficult to set up, they do provide an extremely rich and user-friendly working environment for developing complex web applications at scale.  Once you learn how to configure them yourself, you will be in a much stronger position to troubleshoot any issues you encounter in your build tooling in the future.  

Please check out the other entries in this series!  Feel free to leave a comment or question and share with others if you find any of them helpful:

- [Understanding the Modern Web Stack: Running a Local Web Server](https://dev.to/alexeagleson/understanding-the-modern-web-stack-running-a-local-web-server-4d8g)
- [Understanding the Modern Web Stack: Babel](https://dev.to/alexeagleson/building-a-modern-web-stack-babel-3hfp)
- [Understanding the Modern Web Stack: Webpack - The Basics](https://dev.to/alexeagleson/understanding-the-modern-web-stack-webpack-part-1-2mn1)
- [Understanding the Modern Web Stack: Webpack - Loaders, Optimizations & Bundle Analysis](https://dev.to/alexeagleson/understanding-the-modern-web-stack-webpack-part-2-49bj)
- [Understanding the Modern Web Stack: Webpack - DevServer, React & Typescript](https://dev.to/alexeagleson/understanding-the-modern-web-stack-webpack-devserver-react-typescript-4b9b)

<a href="https://twitter.com/eagleson_alex?ref_src=twsrc%5Etfw" class="twitter-follow-button" data-show-count="false">@eagleson_alex</a><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> on Twitter

Thanks for reading, and stay tuned!