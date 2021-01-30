import { createRegistry, StoreRegistryContext } from "@vzn/store";
import IndexRoute from '../routes/index';

const App = () => {
  const registry = createRegistry();

  return (
    <StoreRegistryContext.Provider value={registry}>
      <IndexRoute />
    </StoreRegistryContext.Provider>
  )
}

export default App;