# Understanding the Modern Web Stack: Running a Local Web Server

No matter what kind of project you're working on, whether it be a single HTML file, or a large scale application, you always want to be able to spin up an environment where you can quickly test your work on your own machine.

Many tools these days including [webpack](https://webpack.js.org/) and [create-react-app](https://github.com/facebook/create-react-app) come packaged with commands to spin up a local server built into them.  However this tutorial is going to focus on the absolute simplest options available to getting a basic server up and running yourself to load an HTML file in your browser.

Be aware this tutorial is not about writing your own web server (we'll address that topic in a future tutorial on `Node.js` and `Express`).  Right now we're only examining the fundamentals of what a web server is, and the simplest way to get an existing one up and running.

## What is a Web Server?

Strictly speaking there's nothing specifically different about a "local" web server and a traditional web server.  The _local_ qualifier simply refers to be being run on the same machine you are building your site or application on.  A production web server is obviously going to need to include a lot more features to handle things like traffic volume and security, but fortunately we don't need to worry about things like that when serving our files locally.  All we need to worry about is getting our project to display in our browser.  

A web server (specifically an [HTTP server](https://developer.mozilla.org/en-US/docs/Glossary/HTTP)) is a piece of software designed to deliver content from one device to another. In our case that content is an HTML file, and we are delivering it to our web browser which will display it for us.

Before we go any further it's important to outline a couple basic terms that you will encounter frequently when running a webserver:

- `localhost` - This is an alias for the IP of your machine, typically resolving to 127.0.0.1, a _loopback_ address that directs requests back at your own machine.  You'll often refer to that IP referred to as your _home_ address.  [More information here](https://en.wikipedia.org/wiki/Localhost).

- `port` - The port is a special number used to refer the the process or program running on the machine that the request should be sent to.  So if you were mailing a letter, you can think of the IP like a house address and the port as the person in the house the letter is addressed to.  Some port numbers are _reserved_.  For example port 80 is the default for all HTTP internet traffic.  When you don't include a port number in a URL, it is assumed to be 80 by default.  Making a browser request to a process on your own machine using port 8000 would look like this: `http://localhost:8000`

_(Don't worry if you don't understand all these terms at this point, you can still run a server without knowing the finer details, but it helps to understand some of the basic concepts)_

For the most part, unless you edit your operating system's [hosts file](https://en.wikipedia.org/wiki/Hosts_(file)), all your requests to your local server will be made to the `localhost` domain.  The port can be assigned by you manually, or depending on what server you use, might be assigned automatically.  

Some common local server ports you'll see are 3000 (used by `create-react-app`), 5000 (used by VS Code's `Live Server` extension) and port 8000 (a port developers commonly use for local servers, just by convention).  

Most server applications that detect a process already running on a port on your machine will simply increment the port number by one until it finds an available port.


## Running a Local Web Server

In each of these examples we assume you have a file called `index.html` in the root of the directory that you are running the server in.

If you don't already have one you can either use the below template, or if you are using VS Code, then you can create a file called `index.html` and simply press the `!` key.  You will get a context menu that when clicked will automatically generate a template for you:

`index.html`
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
  </head>
  <body>My web page</body>
</html>
```

### Option 1 (Recommended): Live Server Extension (VS Code)

If you are using VS Code the easiest way is going to be installing the `Live Server` extension (extension id `ritwickdey.liveserver`). Simply install the extension and a `Go Live` icon will appear on the blue bar at the lower right corner of VS Code.

![Go Live Icon](https://raw.githubusercontent.com/ritwickdey/vscode-live-server/master/images/Screenshot/vscode-live-server-statusbar-3.jpg)

After clicking it you will be able to view your web page at whatever port the server decides, the default URL being [http://localhost:5500]()

If you have any difficulty you can refer to the full documentation [here](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer).

_Edit: It has been pointed out that Live Server may present issues with SVG support.  If you encounter this issue try [Five Server](https://marketplace.visualstudio.com/items?itemName=yandeu.five-server), a fork of Live Server._

### Option 2: Node Web Server

If you have [Node.js](https://nodejs.org/en/download/) installed already on your machine (you will need it for other tutorials in this series) then you will automatically have `npx` package runner installed as well (don't confuse `npx` with `npm` they are two different commands).

Run the following command:

```bash
npx http-server -p 8000
```

It will prompt you to install `http-server` (if it is not installed already). Afterward you can access your web page at [http://localhost:8000]()

### Option 3: Python3 Web Server

If you are on a machine with Python 3 installed, then you can run a simple webserver with the following command:

```bash
python3 -m http.server 8000
```

Then access your web page at [http://localhost:8000]()


### Option 4: PHP Web Server

If you already have PHP installed on your machine then you can run an easy local web server with the following command:

```bash
php -S localhost:8000
```

It will serve your HTML and Javascript the same as any other server, but as a nice bonus you can also include some [PHP](https://www.php.net/manual/en/intro-whatis.php) code in your `index.html` if you so choose (it's not necessary though).

Access your web page at [http://localhost:8000]()

## Viewing Your Web Page

Whichever option you choose, if you used the default HTML template from the previous section your result should be the same:

![Web Page Example](https://i.imgur.com/goULnTE.png)

## Wrapping Up

Now that you have the ability to view your files on a live server, you have all the tools you need to test your web app.  

Though you may use more advanced tools as your stack expands, ultimately regardless of complexity you will always be able to fallback on any of these simple web servers to host the entry point of your application.

Thanks for reading!  Stay tuned for more tutorials in the _Understanding the Modern Web Stack_ series.

- [Understanding the Modern Web Stack: Running a Local Web Server](https://dev.to/alexeagleson/understanding-the-modern-web-stack-running-a-local-web-server-4d8g)
- [Understanding the Modern Web Stack: Babel](https://dev.to/alexeagleson/building-a-modern-web-stack-babel-3hfp)