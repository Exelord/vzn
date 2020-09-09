import { render } from "vzn/dom";
import { onCleanup, createState } from "vzn";

function Clock() {
  const state = createState({ counter: 0 });
  
  const timer = setInterval(() => state.counter++, 1000);

  onCleanup(() => {
    clearInterval(timer);
    console.log('clear1');
  });
  
  return <div>{state.counter}</div>;
}

function App() {
  const state = createState({
    show: true,

    toggle() {
      state.show = !state.show;
    }
  });

  return (
    <div>
      <button onClick={state.toggle}>Toggle</button>
      {state.show ? <Clock /> : null}
    </div>
  );
}

render(App, document.getElementById("app"));

{/* <input
on={[["input", state.onChange, "firstName"]]}
value={state.firstName}
/> */}