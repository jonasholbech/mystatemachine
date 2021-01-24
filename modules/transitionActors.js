import FLIP from "./FLIP";
import { getDOMNode } from "./helpers";

export function setAvailableTransitions(state) {
  const nav = document.querySelector("#debug");
  nav.innerHTML = "";
  document.querySelector("h1").textContent = state.value;
  for (let possible in state.possibleTransitions) {
    const button = document.createElement("button");
    button.textContent = possible;
    button.dataset.action = possible;
    nav.appendChild(button);
  }
}

export async function fetchData() {
  const response = fetch("https://kea-alt-del.dk/t7/api/products");
  const result = await (await response).json();
  return result;
}

export function showProducts(target, template, data) {
  target = getDOMNode(target);
  template = getDOMNode(template).content;
  data.forEach((item) => {
    const clone = template.cloneNode(true);
    clone.querySelector("article").dataset.id = item.id;
    clone.querySelector("h2").textContent = item.productdisplayname;
    clone.querySelector(
      "img"
    ).src = `https://kea-alt-del.dk/t7/images/webp/640/${item.id}.webp`;
    clone.querySelector("p").textContent = item.price + ",-";
    target.appendChild(clone);
  });
}

export function showSortingOptions(machine) {
  getDOMNode("nav").innerHTML = "";
  const button = document.createElement("button");
  button.textContent = "Price (low to high)";
  button.addEventListener("click", (e) => {
    console.log("click sort");
    machine.transition("sort", {
      type: "sort",
      payload: "lowFirst",
      property: "price",
      cast: "number",
    });
  });
  getDOMNode("nav").appendChild(button);

  const button2 = document.createElement("button");
  button2.textContent = "Price (high to low)";
  button2.addEventListener("click", (e) => {
    machine.transition("sort", {
      type: "sort",
      payload: "highFirst",
      property: "price",
      cast: "number",
    });
  });
  getDOMNode("nav").appendChild(button2);

  const button3 = document.createElement("button");
  button3.textContent = "Name (A-Z)";
  button3.addEventListener("click", (e) => {
    console.log("click sort");
    machine.transition("sort", {
      type: "sort",
      payload: "lowFirst",
      property: "productdisplayname",
    });
  });
  getDOMNode("nav").appendChild(button3);

  const button4 = document.createElement("button");
  button4.textContent = "Name (Z-A)";
  button4.addEventListener("click", (e) => {
    machine.transition("sort", {
      type: "sort",
      payload: "highFirst",
      property: "productdisplayname",
    });
  });
  getDOMNode("nav").appendChild(button4);
}

export function reorderProducts(data) {
  data.forEach((product, index) => {
    const el = document.querySelector(`main [data-id="${product.id}"]`);
    const letsFlip = new FLIP(el);
    letsFlip.logFirstPosition().logFirstToDOM();
  });
  data.forEach((product, index) => {
    const el = document.querySelector(`main [data-id="${product.id}"]`);
    document.querySelector("main").appendChild(el);
  });
  data.forEach((product, index) => {
    const el = document.querySelector(`main [data-id="${product.id}"]`);
    const letsFlip = new FLIP(el);
    letsFlip.logLastPosition().logLastToDOM().readFirstFromDOM().animate();
  });
}
