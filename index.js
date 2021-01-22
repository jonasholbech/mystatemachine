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
      on: {
        loaded: "loaded",
      },
    },
    loaded: {
      actions: [
        "sayHiAgain",
        (ctx, evt) => {
          console.log("I AM ANON", ctx, evt);
        },
        "useContext",
      ],
      on: { next: "showUI" },
    },
    showUI: {
      on: {},
    },
  },
  actions: {
    sayHiAgain: (ctx, evt) => {
      console.log({ ctx, evt });
    },
    useContext: assign((ctx, evt) => {
      console.log(ctx, evt);
      return {
        count: ctx.count + 1,
        message: "Count changed",
      };
    }),
  },
};

const machine = new StateMachine(statechart, observer);
machine.transition("loaded", { type: "whatever" });
