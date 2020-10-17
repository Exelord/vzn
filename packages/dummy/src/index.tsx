import { render } from "@vzn/dom";
import { createRegistry, StoreRegistryContext } from "@vzn/store";
import IndexPage from "./pages/index";

function App() {
  const registry = createRegistry();

  return (
    <StoreRegistryContext.Provider value={registry}>
      <IndexPage />
    </StoreRegistryContext.Provider>
  );
}

render(App, document.getElementById("app")!);