import "./styles.css";
import mushroom from "./assets/ck-yeo-ZyEnQoFp8RQ-unsplash.jpg";
import join from "lodash/join";
import { funcA } from './tree-shake';

funcA();

function component() {
  const element = document.createElement("div");

  element.innerHTML = join(["Hello", "webpack"], " ");

  return element;
}

function imageComponent() {
  const element = document.createElement("img");

  element.src = mushroom;

  return element;
}

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