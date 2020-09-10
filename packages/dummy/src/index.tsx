import { render } from "@vzn/dom";
import { onCleanup, createState, useContext, createContext } from "@vzn/core";

const TestContext = createContext({ counter: 0 });

// export class Registry {
//   private registry = new Map();

//   lookup<T>(key: any): T | undefined {
//     return this.registry.get(key);
//   }

//   register<T>(key: any, value: T): T {
//     this.registry.set(key, value);
//     return value;
//   }
// }

// const RegistryContext = createContext(new Registry());

// export const useRegistry = () => useContext(RegistryContext)

// function useService<T>(serviceConstructor: () => T): T {
//   const registry = useRegistry();
//   const service = registry.lookup<T>(serviceConstructor);
//   return service || registry.register(serviceConstructor, serviceConstructor());
// }

// function createService<T extends object>(targetConstructor: () => T) {
//   return () => createState(targetConstructor())
// }

// const AuthService = createService(() => ({
//   test: 'Works'
// }));

// const CounterService = createService(() => ({
//   counter: 0,
//   authService: useService(AuthService),

//   get auth() {
//     return `${this.authService.test} - ${this.counter}`;
//   }
// }))

function Clock() {
  const context = useContext(TestContext);

  const timer = setInterval(() => context.counter++, 1000);
  onCleanup(() => clearInterval(timer));

  return <div>{context.counter}</div>;
}

function App() {
  const state = createState({
    show: true,

    toggle() {
      this.show = !this.show
    }
  })

  const counter = createState({ counter: 0 });

  return (
    <>
      <button onClick={state.toggle}>Toggle</button>

      {state.show ? (
        <TestContext.Provider value={counter}>
          <Clock />
        </TestContext.Provider>
      ) : ''}
    </>
  );
}

render(App, document.getElementById("app"));
