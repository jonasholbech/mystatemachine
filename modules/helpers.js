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
