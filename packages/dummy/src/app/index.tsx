import { RegistryProvider } from "@vzn/store";
import IndexRoute from '../routes/index/index';

const App = () => {
  return (
    <RegistryProvider>
      <IndexRoute />
    </RegistryProvider>
  )
}

export default App;