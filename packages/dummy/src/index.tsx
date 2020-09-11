import { render } from "@vzn/dom";
import { onCleanup, createState } from "@vzn/core";
import { StoreRegistry, StoreRegistryContext, useStore } from "@vzn/store";

const AuthStore = () => ({
  test: 'Works'
});

const CounterStore = () => ({
  counter: 0,
  authState: useStore(AuthStore),

  get auth() {
    return `${this.authState.test} - ${this.counter}`;
  }
})

function Clock() {
  const state = createState({
    counter: useStore(CounterStore),

    increment() {
      this.counter.counter++
    }
  })
  
  const timer = setInterval(() => state.increment(), 1000);
  onCleanup(() => clearInterval(timer));

  return <div>{state.counter.auth}</div>;
}

function App() {
  const registry = new StoreRegistry()

  return (
    <StoreRegistryContext.Provider value={registry}>
      <Clock />
    </StoreRegistryContext.Provider>
  );
}

render(App, document.getElementById("app"));
