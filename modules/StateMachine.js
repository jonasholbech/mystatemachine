let context = {};
export class StateMachine {
  constructor(statechart) {
    this.history = [];
    this.state = statechart.initial;
    this.transitions = statechart.states;
    this.actions = statechart.actions || {};
    document.body.dataset.state = this.state;
    context = statechart.context || {};
  }
  //TODO: nested states?

  transition(transitionName) {
    console.log({ transitionName });
    const nextState = this.transitions[this.state].on[transitionName];
    if (!nextState) {
      throw new Error(`invalid: ${this.state} -> ${transitionName}`);
    }
    this.history.push(transitionName);
    document.body.dataset.state = nextState;
    this.state = nextState;

    //Run actions
    const actions = this.transitions[this.state].actions || [];
    actions.forEach((func) => {
      if (typeof func === "function") {
        console.log("calling anonymous function");
        func(context, "some event");
      } else if (typeof this.actions[func] === "function") {
        console.log("calling ", func);
        this.actions[func](context, "actions");
      }
    });

    return this.state;
  }
}

export const assign = (callback) => {
  return () => {
    context = { ...context, ...callback(context, "some event") };
    console.log(context);
  };
};
