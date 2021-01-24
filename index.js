import { StateMachine, assign } from "./modules/StateMachine.js";
import * as transitionsActors from "./modules/transitionActors";
import * as helpers from "./modules/helpers";

const statechart = {
  id: "my-machine",
  initial: "setup",
  context: {
    data: [],
  },
  states: {
    setup: {
      on: {
        loaded: "loaded",
      },
    },
    loaded: {
      actions: ["dataLoaded"],
      on: { next: "showUI" },
    },
    showUI: {
      on: {
        next: "uiReady",
      },
    },
    uiReady: {
      on: {
        sort: "sort",
        productClicked: "showProduct",
      },
    },
    sort: {
      //Could/should be nested in uiReady
      actions: ["sort"],
      on: {
        sorted: "showSorted",
      },
    },
    showSorted: {
      //Could/should be nested in uiReady
      on: {
        shown: "uiReady",
      },
    },
    showProduct: {},
  },
  actions: {
    dataLoaded: assign((ctx, evt) => {
      return {
        data: evt.payload,
      };
    }),
    sort: assign((ctx, evt) => {
      console.log(evt);
      const copy = [...ctx.data];
      if (evt.cast && evt.cast === "number") {
        return {
          data: copy.sort((a, b) =>
            evt.payload === "lowFirst"
              ? Number(a[evt.property]) > Number(b[evt.property])
              : Number(a[evt.property]) < Number(b[evt.property])
          ),
        };
      } else {
        return {
          data: copy.sort((a, b) =>
            evt.payload === "lowFirst"
              ? a[evt.property] > b[evt.property]
              : a[evt.property] < b[evt.property]
          ),
        };
      }
    }),
  },
};
/*
  two ways to use actions
  1. arrow function directly in actions
  2. String in actions, function defined in actions object
  3. TODO: can I have a function outside?

  assign, used to change context/state
  useContext: assign((ctx, evt) => {
      return {
        count: ctx.count + 1,
        message: "Count changed",
      };
    }),
    
*/
//setup state machine
const machine = new StateMachine(statechart);
machine.onTransition(transitionEnded);
machine.onTransition(removeLoader);
function removeLoader(state) {
  if (state.value === "showUI") {
    document.querySelector("#loader").remove();
    machine.unsubscribe(removeLoader);
  }
}
machine.start();

//setup evl on navbar=>buttons
const nav = document.querySelector("#debug");
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
        "main",
        "template#productTemplate",
        state.context.data
      );
      machine.transition("next");
      break;
    case "uiReady":
      transitionsActors.showSortingOptions(machine);
      break;
    case "sort":
      machine.transition("sorted");
      break;
    case "showSorted":
      transitionsActors.reorderProducts(state.context.data);
      machine.transition("shown");
      break;
    default:
      //not reachable, the statemachine covers this
      throw new Error(`A state vas not covered (${state.value})`);
  }
}
