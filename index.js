import FLIP from "./modules/FLIP.js";
import { StateMachine, assign } from "./modules/StateMachine.js";
import * as transitionsActors from "./modules/transitionActors";
import * as helpers from "./modules/helpers";

const statechart = {
  id: "my-machine",
  initial: "setup",
  context: {
    data: [],
    testboxHidden: true,
  },
  states: {
    setup: {
      actions: ["showLoader"],
      on: {
        loaded: "loaded",
      },
    },
    loaded: {
      //actions: ["dataLoaded", (ctx, evt) => {}, "useContext"],
      actions: ["dataLoaded"],
      on: { next: "showUI" },
    },
    showUI: {
      actions: ["hideLoader"],
      on: {},
    },
  },
  actions: {
    showLoader: (ctx, evt) => {
      document.querySelector("#loader").dataset.hidden = false;
    },
    hideLoader: (ctx, evt) => {
      document.querySelector("#loader").dataset.hidden = true;
    },
    useContext: assign((ctx, evt) => {
      return {
        count: ctx.count + 1,
        message: "Count changed",
      };
    }),
    dataLoaded: assign((ctx, evt) => {
      return {
        data: evt.payload,
      };
    }),
  },
};

//setup state machine
const machine = new StateMachine(statechart);
machine.onTransition(transitionEnded);
machine.start();

//setup evl on navbar=>buttons
const nav = document.querySelector("nav");
nav.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    machine.transition(e.target.dataset.action, e);
  }
});
helpers.getDOMNode("main");
//callback when transitioning
async function transitionEnded(state) {
  console.log(state);
  transitionsActors.setAvailableTransitions(state);
  switch (state.value) {
    case "setup":
      const data = await transitionsActors.fetchData();
      machine.transition("loaded", { payload: data });
      break;
    case "loaded": //Just proceed to next
      machine.transition(Object.keys(state.possibleTransitions)[0]);
      break;
    case "showUI":
      transitionsActors.showProducts(
        document.querySelector("main"),
        document.querySelector("template#productTemplate"),
        state.context.data
      );
      break;
    default:
      //not reachable, the statemachine covers this
      throw new Error(`A state vas not covered (${state.value})`);
  }
}
