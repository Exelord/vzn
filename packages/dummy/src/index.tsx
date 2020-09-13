import { render } from "@vzn/dom";
import { StoreRegistry, StoreRegistryContext } from "@vzn/store";
import { Router } from '@vzn/router';

import routerConfig from './routes';

function App() {
  const registry = new StoreRegistry()

  return (
    <StoreRegistryContext.Provider value={registry}>
      <Router config={routerConfig} />
    </StoreRegistryContext.Provider>
  );
}

render(App, document.getElementById("app")!);