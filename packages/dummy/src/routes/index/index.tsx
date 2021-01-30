import { tracked, action } from '@vzn/core';

class State {
  @tracked count = 0

  @action
  doSth() {
    this.count++;
  }
}

const IndexRoute = () => {
  const state = new State();
  
  return (
    <button onClick={state.doSth}>
      Count: {state.count}
    </button>
  );
}

export default IndexRoute;