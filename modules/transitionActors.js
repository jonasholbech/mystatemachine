import { getDOMNode } from "./helpers";

export function setAvailableTransitions(state) {
  const nav = document.querySelector("nav");
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
    clone.querySelector("h2").textContent = item.productdisplayname;
    target.appendChild(clone);
  });
}
