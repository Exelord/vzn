import { observable } from "mobx";
import { render } from "vzn/dom";
import { onCleanup } from "vzn";

function App() {
  const state = observable({ counter: 0 });
  const timer = setInterval(() => state.counter++, 1000);
  
  onCleanup(() => clearInterval(timer));

  return <div>{state.counter}</div>;
}

render(App, document.getElementById("app"));
