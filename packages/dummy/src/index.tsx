import { observable } from "mobx";
import { render } from "vzn/dom";
import { onCleanup } from "vzn";

function Clock2() {
  const state = observable({ counter: 0 });
  
  const timer = setInterval(() => state.counter++, 1000);

  onCleanup(() => {
    clearInterval(timer);
    console.log('clear2');
    
  });

  return <div>{state.counter}</div>;
}

function Clock() {
  const state = observable({ counter: 0 });
  
  const timer = setInterval(() => state.counter++, 1000);

  onCleanup(() => {
    clearInterval(timer);
    console.log('clear1');
  });

  return <div>{state.counter} <Clock2 /></div>;
}

function App() {
  const state = observable(
    {
      show: true,

      toggle() {
        state.show = !state.show;
      }
    }
  );

  return (
    <div>
      <button onClick={state.toggle}>Toggle</button>
      {state.show ? <Clock /> : null}
    </div>
  );
}

render(App, document.getElementById("app"));
