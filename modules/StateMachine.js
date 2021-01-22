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

  _callActions(evtObj) {
    const actions = this.transitions[this.state].actions || [];
    console.log(actions);
    actions.forEach((func) => {
      //Call anon function
      if (typeof func === "function") {
        console.log("calling anonymous function");
        func(context, evtObj);
        // call "functions" and assign() functions
      } else if (typeof this.actions[func] === "function") {
        console.log("calling ", func, this.actions[func]);
        this.actions[func](context, evtObj);
      }
    });
  }
  transition(transitionName, evtObj = { type: "transition" }) {
    console.log("before:", { context });
    const nextState = this.transitions[this.state].on[transitionName];
    if (!nextState) {
      throw new Error(`invalid: ${this.state} -> ${transitionName}`);
    }
    this.history.push(transitionName);
    document.body.dataset.state = nextState;
    this.state = nextState;

    //Run actions
    this._callActions(evtObj);
    console.log("after:", { context });
    return this.state;
  }
}

export const assign = (callback) => {
  return (ctx, evt) => {
    context = { ...ctx, ...callback(ctx, evt) };
  };
};
