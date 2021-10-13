import join from "lodash/join";

console.log("loading page2.js");

const element = document.createElement("h1");

element.innerHTML = join(['Welcome to', 'page 2!'], ' ');

document.body.append(element);
