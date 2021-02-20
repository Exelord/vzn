import { signal, action } from '@vzn/core';
// @ts-ignore
import styles from './styles.module.css';

class State {
  @signal count = 0;

  @action
  doSth() {
    this.count++;
  }
}

const IndexRoute = () => {
  const state = new State();
  
  return (
    <button class={styles.button} onClick={state.doSth}>
      Count: {state.count}
    </button>
  );
}

export default IndexRoute;