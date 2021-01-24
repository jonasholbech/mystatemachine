let context = {};
export class StateMachine {
  constructor(statechart) {
    this.history = [];
    this.running = false;
    this.state = statechart.initial;
    this.transitions = statechart.states;
    this.actions = statechart.actions || {};
    this.listenerCallbacks = [];
    document.body.dataset.state = this.state;
    context = statechart.context || {};
  }
  //TODO: nested states?
  start() {
    this._callActions({ type: "transition" });
    this._runListenerCallbacks({
      context,
      value: this.state,
      possibleTransitions: this.transitions[this.state].on,
    });
  }
  //register a callback
  onTransition(callbackToRegister) {
    //TODO: Should this be called subscribe?
    this.listenerCallbacks.push(callbackToRegister);
  }
  unsubscribe(callback) {
    //TODO: subscribe to specific transitions?
    const index = this.listenerCallbacks.indexOf(callback);
    this.listenerCallbacks.splice(index, 1);
  }
  once(callback, transition) {
    //TODO: ? subscribe, and automatically unsubscribe on transition
  }
  transition(transitionName, evtObj = { type: "transition" }) {
    console.log(evtObj);
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
    this._runListenerCallbacks({
      context,
      value: this.state,
      possibleTransitions: this.transitions[this.state].on,
    });
    return this.state;
  }

  _callActions(evtObj) {
    const actions = this.transitions[this.state].actions || [];
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
  _runListenerCallbacks(obj) {
    for (let index = 0; index < this.listenerCallbacks.length; index++) {
      this.listenerCallbacks[index](obj);
    }
  }
}

export const assign = (callback) => {
  return (ctx, evt) => {
    context = { ...ctx, ...callback(ctx, evt) };
  };
};
