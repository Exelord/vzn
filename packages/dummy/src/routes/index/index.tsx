import { signal, action } from '@vzn/core';

class State {
  @signal count = 0

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