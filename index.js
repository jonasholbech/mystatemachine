import FLIP from "./modules/FLIP.js";
import { StateMachine, assign } from "./modules/StateMachine.js";
import observer from "./modules/Observer";
import * as helpers from "./modules/helpers";

const statechart = {
  id: "my-machine",
  initial: "setup",
  context: {
    count: 0,
    stuff: [],
  },
  states: {
    setup: {
      actions: ["sayHiAgain"],
      on: {
        loaded: "loaded",
      },
    },
    loaded: {
      actions: ["sayHiAgain", (ctx, evt) => {}, "useContext"],
      on: { next: "showUI" },
    },
    showUI: {
      on: {},
    },
  },
  actions: {
    sayHiAgain: (ctx, evt) => {
      console.log("Hi!");
    },
    useContext: assign((ctx, evt) => {
      return {
        count: ctx.count + 1,
        message: "Count changed",
      };
    }),
  },
};

const machine = new StateMachine(statechart, observer);
machine.onTransition(transitionEnded);
machine.start();
const nav = document.querySelector("nav");
nav.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    machine.transition(e.target.dataset.action, e);
  }
});

function transitionEnded(state) {
  console.log(state);
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
