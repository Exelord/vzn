import { createContext, createState, State, useContext } from "@vzn/core";

export function createRegistry(){
  return new Map<State<any>, any>()
}

export const StoreRegistryContext = createContext(createRegistry());

export function useStoreRegistry() {
  return useContext(StoreRegistryContext);
}

export function useStore<T>(storeCreator: State<T>): T {
  const registry = useStoreRegistry();
  
  if (registry.has(storeCreator)) {
    return registry.get(storeCreator);
  }
  
  const state = createState<T>(storeCreator);
  
  registry.set(storeCreator, state);
  
  return state;
}