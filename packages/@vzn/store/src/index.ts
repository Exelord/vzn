import { createContext, useContext } from "@vzn/core";

export type Store<T> = () => T;

export function createRegistry() {
  return new Map<Store<any>, any>()
}

export const StoreRegistryContext = createContext(createRegistry());

export function useStoreRegistry() {
  return useContext(StoreRegistryContext);
}

export function useStore<T>(storeCreator: Store<T>): T {
  const registry = useStoreRegistry();
  
  if (registry.has(storeCreator)) {
    return registry.get(storeCreator);
  }
  
  const store = storeCreator();
  
  registry.set(storeCreator, store);
  
  return store;
}